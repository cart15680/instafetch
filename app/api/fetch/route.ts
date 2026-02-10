import { NextRequest, NextResponse } from "next/server";
import type { InstagramGraphQLResponse } from "@/types/instagram";

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

// Build Instagram GraphQL request
function buildGraphQLRequest(shortcode: string) {
    const body = new URLSearchParams({
        variables: JSON.stringify({
            shortcode: shortcode,
            fetch_tagged_user_count: null,
            hoisted_comment_id: null,
            hoisted_reply_id: null,
        }),
        doc_id: "8845758582119845", // Standard ID for post data
    });

    return {
        url: "https://www.instagram.com/graphql/query",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-IG-App-ID": "1217981644879628", // Essential for the web API
            "X-Requested-With": "XMLHttpRequest",
            "X-ASBD-ID": "129477",
            "Origin": "https://www.instagram.com",
            "Sec-Fetch-Site": "same-origin",
        },
        body: body.toString(),
    };
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

        const requestConfig = buildGraphQLRequest(shortcode);

        const response = await fetch(requestConfig.url, {
            method: "POST",
            headers: requestConfig.headers,
            body: requestConfig.body,
        });

        // Handle 401 or other errors by attempting a fallback if necessary
        if (!response.ok) {
            console.error(`Instagram API error (${response.status}):`, await response.text().catch(() => "No body"));

            if (response.status === 401 || response.status === 403) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Instagram restricted this request on the server. Try again or try a different link."
                    },
                    { status: response.status }
                );
            }

            throw new Error(`Instagram API returned ${response.status}`);
        }

        const data: InstagramGraphQLResponse = await response.json();

        const media = data.data?.xdt_shortcode_media;
        if (!media) {
            return NextResponse.json(
                { success: false, error: "Media not found. Is it a private post?" },
                { status: 404 }
            );
        }

        if (!media.is_video) {
            return NextResponse.json(
                { success: false, error: "This post is not a video" },
                { status: 400 }
            );
        }

        const videoUrl = media.video_url;
        if (!videoUrl) {
            return NextResponse.json(
                { success: false, error: "Video URL not available" },
                { status: 404 }
            );
        }

        const caption = media.edge_media_to_caption?.edges[0]?.node?.text || "";

        return NextResponse.json({
            success: true,
            data: {
                videoUrl: videoUrl,
                thumbnailUrl: media.display_url,
                title: caption.slice(0, 100) || "Instagram Video",
                dimensions: {
                    width: media.dimensions.width,
                    height: media.dimensions.height,
                },
            },
        });
    } catch (error: any) {
        console.error("Fetch API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch video data",
            },
            { status: 500 }
        );
    }
}
