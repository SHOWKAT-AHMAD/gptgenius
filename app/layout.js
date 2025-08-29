import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GPTGenius",
  description:
    "GPTGenius: Your AI language companion. Powered by OpenAI, it enhances your conversations, content creation, and more!",
};

export default async function RootLayout({ children }) {
  // Await cookies() on the server (prevents Next.js sync-dynamic-APIs warning)
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;

  // Only used if there is no server cookie — runs before hydration to avoid flash
  const inlineThemeScript = `
(function() {
  try {
    // If server already set data-theme on <html>, don't override it.
    if (document.documentElement.getAttribute('data-theme')) return;

    var theme = null;
    try { theme = localStorage.getItem('theme'); } catch (e) { theme = null; }
    if (!theme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dracula';
      } else {
        theme = 'winter';
      }
    }
    document.documentElement.setAttribute('data-theme', theme);
    try {
      document.cookie = 'theme=' + theme + '; Path=/; Max-Age=' + (60*60*24*365) + '; SameSite=Lax';
    } catch (e) {}
  } catch (e) {}
})();
`;

  const htmlProps = themeCookie ? { "data-theme": themeCookie } : {};

  return (
    <ClerkProvider>
      <html lang="en" {...htmlProps}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {!themeCookie && <script dangerouslySetInnerHTML={{ __html: inlineThemeScript }} />}
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}