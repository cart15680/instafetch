import VideoDownloader from "@/components/video-downloader";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Content */}
      <div className=" max-w-7xl mx-auto py-8 sm:py-12 lg:py-16">
        <VideoDownloader />
      </div>

      {/* Footer */}
      <footer className="relative  py-6 sm:py-8 lg:py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
            <div className="h-[1px]  max-w-md bg-gradient-to-r from-transparent via-[#00fff2]/30 to-transparent" />

            <div className="space-y-2">
              <p className="text-sm sm:text-base text-[#a0a0b8]">
                Developed with ⚡ by{" "}
                <span className="text-[#00fff2] font-bold text-glow-cyan">
                  Sumon Faruki
                </span>
              </p>
              <p className="text-xs sm:text-sm text-[#6b6b7f]">
                © {new Date().getFullYear()} INSTAFETCH. All rights reserved.
              </p>
            </div>

            <div className="h-[1px]  max-w-md bg-gradient-to-r from-transparent via-[#b537ff]/30 to-transparent" />
          </div>
        </div>
      </footer>
    </main>
  );
}
