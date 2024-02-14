import { Inter } from "next/font/google";
import '../assets/main.scss';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wallet",
  description: "Wallet app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
