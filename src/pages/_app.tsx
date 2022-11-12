import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { SiteTitle } from "../algorithms/shared/Title";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "../components/ThemeToggle";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <div className="container overflow-auto">
        <header className="flex justify-between items-baseline">
          <SiteTitle>Kryptografia</SiteTitle>
          <ThemeToggle />
        </header>
        <nav className="flex justify-between my-5">
          <Link href="visual-cryptography">Kryptografia wizualna</Link>
          <Link href="steganography">Steganografia</Link>
          <Link href="steganography2">Steganografia 2</Link>
          <Link href="secret-sharing">Podział sekretu</Link>
          <Link href="bbs">BBS</Link>
        </nav>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
