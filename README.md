# 🚀 INSTAFETCH

**Ultra-Futuristic Instagram Video Downloader**

INSTAFETCH is a production-ready, high-performance web application for downloading Instagram videos and reels. Built with cutting-edge technology and featuring an ultra-futuristic dark UI with ambient glowing effects.

---

## ✨ Features

- **🎯 One-Click Download** - Instantly download Instagram videos and reels
- **🌐 No Login Required** - Works without Instagram authentication
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile
- **⚡ Ultra-Fast** - Powered by Next.js with Turbopack for blazing speed
- **🎨 Futuristic UI** - Dark theme with neon glows, glassmorphism, and ambient effects
- **🔒 Privacy First** - No data storage, all processing happens in real-time
- **📊 High Quality** - Preserves original video quality
- **🎬 Supports Reels** - Works with both posts and reels

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager

### Local Development

1. **Install Dependencies**

```bash
npm install
# or
yarn install
```

2. **Run Development Server**

```bash
npm run dev
# or
yarn dev
```

3. **Open in Browser**

Navigate to [http://localhost:3000](http://localhost:3000)

The application will hot-reload as you make changes.

---

## 📦 Production Build

### Build for Production

```bash
npm run build
# or
yarn build
```

This will:
- Optimize all components and assets
- Generate static pages where possible
- Minimize JavaScript and CSS bundles
- Prepare the app for deployment

### Start Production Server

```bash
npm run start
# or
yarn start
```

The production server will run on [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

### AWS Amplify (Recommended)

1. Connect your GitHub repository to [AWS Amplify Console](https://console.aws.amazon.com/amplify).
2. Amplify will automatically detect Next.js and use the provided `amplify.yml`.
3. Click "Save and Deploy".

### Other Platforms

INSTAFETCH can be deployed to any platform that supports Next.js:

- **Vercel**: Import project and deploy with one click.
- **Netlify**: Set build command to `npm run build` and publish directory to `.next`.
- **Railway**: Automatically detects Next.js.
- **Self-hosted**: Run `npm run build` then `npm run start`.

---

## 📂 Project Structure

```
INSTAFETCH/
├── app/
│   ├── api/
│   │   ├── fetch/          # Instagram data fetching endpoint
│   │   └── download/       # Video download proxy endpoint
│   ├── globals.css         # Global styles with futuristic theme
│   ├── layout.tsx          # Root layout with SEO
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── video-downloader.tsx # Main downloader component
├── lib/
│   └── utils.ts           # Utility functions
├── types/
│   └── instagram.ts       # TypeScript interfaces
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🎨 UI/UX Features

### Visual Design
- **Dark Theme**: Deep space-inspired color palette
- **Neon Accents**: Cyan (#00fff2), Purple (#b537ff), Pink (#ff006e)
- **Glassmorphism**: Frosted glass effects with blur
- **Ambient Particles**: Floating gradient orbs in background
- **Smooth Animations**: All interactions have fluid transitions

### Interactive Elements
- **Hover Effects**: Buttons and cards glow on hover
- **Loading States**: Animated spinners and pulse effects
- **Toast Notifications**: Futuristic feedback messages
- **Responsive Grid**: Adapts to all screen sizes

---

## 🔧 Configuration

### Environment Variables

No environment variables required! INSTAFETCH works out of the box.

### Customization

To customize colors, edit `app/globals.css`:

```css
@theme {
  --color-neon-cyan: #00fff2;    /* Change primary glow color */
  --color-neon-purple: #b537ff;  /* Change secondary glow color */
  --color-neon-pink: #ff006e;    /* Change accent color */
}
```

---

## 📖 How It Works

1. **User Input**: User pastes Instagram video URL
2. **URL Validation**: Extract shortcode from URL
3. **GraphQL Request**: Fetch video metadata from Instagram's GraphQL API
4. **Data Processing**: Extract video URL and thumbnail
5. **Display Preview**: Show video information
6. **Download Proxy**: Serve video through internal API to bypass CORS
7. **File Download**: Browser downloads video file

---

## ⚠️ Disclaimer

This tool is for **educational purposes only**. Users must:

- Respect copyright laws
- Follow Instagram's Terms of Service
- Only download content they have permission to use
- Not use for commercial purposes without proper rights

The developers are not responsible for misuse of this application.

---

## 🐛 Troubleshooting

### "Failed to fetch video"
- Ensure the URL is a valid Instagram post or reel
- Check if the post is public (private posts cannot be downloaded)
- Try again in a few minutes (rate limiting may apply)

### "This post is not a video"
- The URL must be a video post or reel, not a photo

### Build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Ensure Node.js version is 18.17+

---

## 🤝 Credits

**Developed by**: Sumon Faruki

Built with modern web technologies and a passion for clean, functional design.

---

## 📄 License

This project is provided as-is for educational purposes.

---

## 🌟 Support

If you encounter issues or have questions:

1. Check this README thoroughly
2. Review the code comments
3. Ensure all dependencies are installed
4. Verify Node.js version compatibility

---

**Made with ⚡ and Next.js**

*INSTAFETCH - Where speed meets style*
