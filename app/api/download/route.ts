import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get("url");
        const filename = searchParams.get("filename") || "instafetch-video.mp4";

        if (!url) {
            return NextResponse.json(
                { error: "URL parameter is required" },
                { status: 400 }
            );
        }

        // Fetch the video
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Accept: "*/*",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.status}`);
        }

        const videoBuffer = await response.arrayBuffer();

        // Return the video with proper headers for download
        return new NextResponse(videoBuffer, {
            status: 200,
            headers: {
                "Content-Type": "video/mp4",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": videoBuffer.byteLength.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error: any) {
        console.error("Download proxy error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to download video" },
            { status: 500 }
        );
    }
}
