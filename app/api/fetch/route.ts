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

        // We try the Embed page as it's the most reliable on Cloud IPs
        const targetUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        if (!response.ok) {
            throw new Error(`Instagram returned ${response.status}`);
        }

        const html = await response.text();

        // --- EXTRACTION STRATEGY 1: Embed JSON Data ---
        let videoUrl = html.match(/"video_url":"([^"]+)"/)?.[1];
        let thumbnailUrl = html.match(/"display_url":"([^"]+)"/)?.[1];
        const captionText = html.match(/"caption":"([^"]+)"/)?.[1];

        // --- EXTRACTION STRATEGY 2: Meta Tags ---
        if (!videoUrl) {
            videoUrl = html.match(/property="og:video" content="([^"]+)"/)?.[1];
            thumbnailUrl = thumbnailUrl || html.match(/property="og:image" content="([^"]+)"/)?.[1];
        }

        if (!videoUrl) {
            if (html.includes("login") || html.includes("challenge")) {
                return NextResponse.json(
                    { success: false, error: "Instagram restricted this request on the server. Try again in a minute." },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                { success: false, error: "Could not find video. Ensure the post is Public and try another link." },
                { status: 404 }
            );
        }

        // Clean URLs
        const cleanVideoUrl = videoUrl.replace(/\\u0026/g, "&");
        const cleanThumbnailUrl = (thumbnailUrl || "").replace(/\\u0026/g, "&");

        let title = "Instagram Video";
        if (captionText) {
            try {
                title = JSON.parse(`"${captionText}"`).slice(0, 100);
            } catch {
                title = captionText.slice(0, 100);
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                videoUrl: cleanVideoUrl,
                thumbnailUrl: cleanThumbnailUrl,
                title: title,
                dimensions: { width: 1080, height: 1920 },
            },
        });
    } catch (error: unknown) {
        console.error("Scraper Error:", error);
        return NextResponse.json(
            { success: false, error: "Connection lost. Please try again soon." },
            { status: 500 }
        );
    }
}
