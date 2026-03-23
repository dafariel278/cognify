import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";

export const metadata: Metadata = {
  title: "COGNIFY — Your Skills, Verified On-Chain",
  description: "The first privacy-preserving skill verification platform. Prove what you can do — without exposing who you are. Built on COTI Network.",
  keywords: ["skill verification", "privacy", "COTI", "blockchain", "recruitment", "cognitive assessment"],
  openGraph: {
    title: "COGNIFY — Your Skills, Verified On-Chain",
    description: "Prove cognitive skills to any employer. You control who sees your score.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="noise">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
