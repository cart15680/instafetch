import { NextRequest, NextResponse } from "next/server";

// Extract shortcode from Instagram URL
function extractShortcode(url: string): string | null {
    try {
        const patterns = [
            /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
            /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
            /instagram\.com\/reels\/([A-Za-z0-9_-]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { success: false, error: "URL is required" },
                { status: 400 }
            );
        }

        const shortcode = extractShortcode(url);
        if (!shortcode) {
            return NextResponse.json(
                { success: false, error: "Invalid Instagram URL" },
                { status: 400 }
            );
        }

        // Method: Use the Embed endpoint which is less restricted on Cloud IPs
        const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

        const response = await fetch(embedUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
        });

        if (!response.ok) {
            throw new Error(`Instagram Embed returned ${response.status}`);
        }

        const html = await response.text();

        // Extract the JSON data from the embed HTML
        const videoUrlMatch = html.match(/"video_url":"([^"]+)"/);
        const displayUrlMatch = html.match(/"display_url":"([^"]+)"/);
        const captionMatch = html.match(/"caption":"([^"]+)"/);

        if (!videoUrlMatch) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Could not find video. This post might be private, deleted, or an image."
                },
                { status: 404 }
            );
        }

        // Clean the extracted URLs
        const videoUrl = videoUrlMatch[1].replace(/\\u0026/g, "&");
        const thumbnailUrl = displayUrlMatch ? displayUrlMatch[1].replace(/\\u0026/g, "&") : "";

        let title = "Instagram Video";
        if (captionMatch) {
            try {
                title = JSON.parse(`"${captionMatch[1]}"`).slice(0, 100);
            } catch {
                title = captionMatch[1].slice(0, 100);
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                videoUrl: videoUrl,
                thumbnailUrl: thumbnailUrl,
                title: title,
                dimensions: {
                    width: 1080,
                    height: 1920,
                },
            },
        });
    } catch (error: unknown) {
        console.error("Scraper Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Instagram is temporarily blocking the server. Please try again soon.",
            },
            { status: 500 }
        );
    }
}
