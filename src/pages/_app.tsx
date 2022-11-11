import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { SiteTitle } from "../algorithms/shared/Title";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="container overflow-auto">
      <SiteTitle>Kryptografia</SiteTitle>
      <nav className="flex justify-between">
        <Link href="visual-cryptography">Kryptografia wizualna</Link>
        <Link href="steganography">Steganografia</Link>
        <Link href="steganography2">Steganografia 2</Link>
        <Link href="secret-sharing">Podział sekretu</Link>
        <Link href="bbs">BBS</Link>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}
