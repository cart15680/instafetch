import VideoDownloader from "@/components/video-downloader";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Content */}
      <div className=" max-w-7xl mx-auto py-8 sm:py-12 lg:py-16">
        <VideoDownloader />
      </div>


    </main>
  );
}
