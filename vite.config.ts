import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        const brandName = env.VITE_BRAND_NAME || "Shoe Reminder"
        const brandTagline = env.VITE_BRAND_TAGLINE || "Simple reminders for rotating your running shoes."
        const brandDesc = env.VITE_BRAND_DESCRIPTION || "Schedule smart reminders to replace your running shoes. Generate calendar events with flexible durations, QR codes, and universal calendar support."
        const brandFaviconPath = env.VITE_BRAND_FAVICON_PATH || "/favicon.svg"
        const brandUrl = env.VITE_BRAND_URL || "https://shoereminder.github.io"

        return html
          .replace(/%VITE_BRAND_NAME%/g, brandName)
          .replace(/%VITE_BRAND_TAGLINE%/g, brandTagline)
          .replace(/%VITE_BRAND_DESCRIPTION%/g, brandDesc)
          .replace(/%VITE_BRAND_FAVICON_PATH%/g, brandFaviconPath)
          .replace(/%VITE_BRAND_URL%/g, brandUrl)
      },
    }
  }

  return {
    plugins: [react(), tailwindcss(), htmlPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
