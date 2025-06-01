import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import "./custom.css";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}
