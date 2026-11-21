import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BPBD Kota Bitung - Badan Penanggulangan Bencana Daerah",
  description:
    "Website Resmi BPBD Kota Bitung - Siap Siaga, Tangguh, dan Cepat Tanggap dalam Penanggulangan Bencana.",
  icons: {
    icon: "/bpbd.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#ea580c] selection:text-white">
        {children}
      </body>
    </html>
  );
}
