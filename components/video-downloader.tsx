"use client";

import { useState } from "react";
import { Download, Video as VideoIcon, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { DownloadResponse } from "@/types/instagram";

export default function VideoDownloader() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [videoData, setVideoData] = useState<DownloadResponse["data"] | null>(null);

    const handleFetch = async () => {
        if (!url.trim()) {
            toast.error("Please enter an Instagram URL");
            return;
        }

        setLoading(true);
        setVideoData(null);

        try {
            const response = await fetch("/api/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data: DownloadResponse = await response.json();

            if (!data.success) {
                toast.error(data.error || "Failed to fetch video");
                return;
            }

            setVideoData(data.data);
            toast.success("Video fetched successfully!");
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!videoData) return;

        const downloadUrl = `/api/download?url=${encodeURIComponent(
            videoData.videoUrl
        )}&filename=instafetch-${Date.now()}.mp4`;

        window.open(downloadUrl, "_blank");
        toast.success("Download started!");
    };

    return (
        <div className=" max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo Section */}
            <div className="flex items-center gap-2 mb-8 sm:mb-12">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                <span className="text-lg sm:text-xl font-bold text-white">INSTAFETCH</span>
            </div>

            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
                    <span className="text-white">Instagram Video</span>{" "}
                    <span className="text-purple-500">Downloader</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-400 px-4">
                    Download public Instagram videos in HD instantly. Free, fast, no signup required.
                </p>
            </div>

            {/* Input + Download Button (Inline) */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
                <Input
                    type="url"
                    placeholder="https://www.instagram.com/reel/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                    className="flex-1 h-12 sm:h-14 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 text-sm sm:text-base"
                />
                <Button
                    onClick={handleFetch}
                    disabled={loading}
                    className=" sm:w-36 h-12 sm:h-14 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm sm:text-base"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Loading...
                        </span>
                    ) : (
                        "Download"
                    )}
                </Button>
            </div>

            {/* Video Player Section (Conditional) */}
            {videoData && (
                <div className="mb-6 sm:mb-8 animate-in fade-in duration-500">
                    <div className="rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900 mb-3 sm:mb-4">
                        <video
                            src={videoData.videoUrl}
                            poster={videoData.thumbnailUrl}
                            controls
                            className=" h-auto max-h-[400px] sm:max-h-[500px]"
                        />
                    </div>

                    {videoData.title && (
                        <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 px-2">
                            {videoData.title}
                        </p>
                    )}

                    <Button
                        onClick={handleDownload}
                        className=" h-12 sm:h-14 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm sm:text-base"
                    >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Download Video
                    </Button>
                </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 text-center border border-slate-700/50">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⚡</div>
                    <h3 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Lightning Fast</h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Get your video in seconds with our optimized pipeline.
                    </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 text-center border border-slate-700/50">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🛡️</div>
                    <h3 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">Safe & Private</h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                        No data stored. We never save your URLs or videos.
                    </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 sm:p-6 text-center border border-slate-700/50">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">▶️</div>
                    <h3 className="font-bold text-white text-base sm:text-lg mb-1 sm:mb-2">HD Quality</h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                        Download videos in the highest quality available.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-2 sm:space-y-3 py-4 sm:py-6 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-gray-500">
                    This tool is for downloading publicly available content only. Users are responsible for respecting copyright
                    and platform terms. We do not host or store any copyrighted content.
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                    Developed with ⚡ by <span className="text-cyan-400 font-semibold">Sumon Faruki</span>
                </p>
            </div>
        </div>
    );
}
