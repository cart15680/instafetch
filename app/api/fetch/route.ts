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
        av: "0",
        __d: "www",
        __user: "0",
        __a: "1",
        __req: "b",
        __hs: "20183.HYP:instagram_web_pkg.2.1...0",
        dpr: "3",
        __ccg: "GOOD",
        __rev: "1021613311",
        __s: "hm5eih:ztapmw:x0losd",
        __hsi: "7489787314313612244",
        __dyn:
            "7xeUjG1mxu1syUbFp41twpUnwgU7SbzEdF8aUco2qwJw5ux609vCwjE1EE2Cw8G11wBz81s8hwGxu786a3a1YwBgao6C0Mo2swtUd8-U2zxe2GewGw9a361qw8Xxm16wa-0oa2-azo7u3C2u2J0bS1LwTwKG1pg2fwxyo6O1FwlA3a3zhA6bwIxe6V8aUuwm8jwhU3cyVrDyo",
        __csr:
            "goMJ6MT9Z48KVkIBBvRfqKOkinBtG-FfLaRgG-lZ9Qji9XGexh7VozjHRKq5J6KVqjQdGl2pAFmvK5GWGXyk8h9GA-m6V5yF4UWagnJzazAbZ5osXuFkVeGCHG8GF4l5yp9oOezpo88PAlZ1Pxa5bxGQ7o9VrFbg-8wwxp1G2acxacGVQ00jyoE0ijonyXwfwEnwWwkA2m0dLw3tE1I80hCg8UeU4Ohox0clAhAtsM0iCA9wap4DwhS1fxW0fLhpRB51m13xC3e0h2t2H801HQw1bu02j-",
        __comet_req: "7",
        lsd: "AVrqPT0gJDo",
        jazoest: "2946",
        __spin_r: "1021613311",
        __spin_b: "trunk",
        __spin_t: "1743852001",
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
        variables: JSON.stringify({
            shortcode: shortcode,
            fetch_tagged_user_count: null,
            hoisted_comment_id: null,
            hoisted_reply_id: null,
        }),
        server_timestamps: "true",
        doc_id: "8845758582119845",
    });

    return {
        url: "https://www.instagram.com/graphql/query",
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
            Accept: "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
            "X-BLOKS-VERSION-ID":
                "0d99de0d13662a50e0958bcb112dd651f70dea02e1859073ab25f8f2a477de96",
            "X-CSRFToken": "uy8OpI1kndx4oUHjlHaUfu",
            "X-IG-App-ID": "1217981644879628",
            "X-FB-LSD": "AVrqPT0gJDo",
            "X-ASBD-ID": "359341",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
        },
        body: body.toString(),
        referrer: `https://www.instagram.com/p/${shortcode}/`,
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
            referrer: requestConfig.referrer,
        });

        if (!response.ok) {
            if (response.status === 429) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Too many requests. Please try again later.",
                    },
                    { status: 429 }
                );
            }

            if (response.status === 404) {
                return NextResponse.json(
                    { success: false, error: "Post not found" },
                    { status: 404 }
                );
            }

            throw new Error(`Instagram API returned ${response.status}`);
        }

        const data: InstagramGraphQLResponse = await response.json();

        if (!data.data?.xdt_shortcode_media) {
            return NextResponse.json(
                { success: false, error: "Post not found or unavailable" },
                { status: 404 }
            );
        }

        const media = data.data.xdt_shortcode_media;

        if (!media.is_video) {
            return NextResponse.json(
                { success: false, error: "This post is not a video" },
                { status: 400 }
            );
        }

        if (!media.video_url) {
            return NextResponse.json(
                { success: false, error: "Video URL not available" },
                { status: 404 }
            );
        }

        const caption = media.edge_media_to_caption?.edges[0]?.node?.text || "";

        return NextResponse.json({
            success: true,
            data: {
                videoUrl: media.video_url,
                thumbnailUrl: media.display_url,
                title: caption.slice(0, 100) || "Instagram Video",
                dimensions: {
                    width: media.dimensions.width,
                    height: media.dimensions.height,
                },
            },
        });
    } catch (error: any) {
        console.error("Instagram API Error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch video data",
            },
            { status: 500 }
        );
    }
}
