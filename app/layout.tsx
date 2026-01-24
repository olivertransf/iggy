import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIPREP",
  description: "A Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="shrink-0 w-full border-b border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-800 tracking-tight">
                SIPREP Wiki
              </h1>
            </Link>
            <nav>
              <ul className="flex gap-6">
                <li>
                  <Link
                    href="/teachers"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Teachers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/schedule"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Schedule
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu"
                    className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Menu
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <div className="flex-1 min-h-0 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
