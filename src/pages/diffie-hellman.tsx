import { MathJax, MathJaxContext } from "better-react-mathjax";
import Head from "next/head";
import { useState } from "react";
import { Input } from "../components/Input";

export default function DiffieHellman() {
  const [_g, setG] = useState("5");
  const [_n, setN] = useState("23");

  const [_x, setX] = useState("6");
  const [_y, setY] = useState("15");

  const g = BigInt(_g);
  const n = BigInt(_n) || 1n;
  const x = BigInt(_x);
  const y = BigInt(_y);

  return (
    <div className="prose dark:prose-invert max-w-none mb-10">
      <Head>
        <title>Diffie-Hellman</title>
      </Head>
      <h2>Uzgadnianie klucza metodą Diffie-Hellman</h2>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <h3>Publiczne</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="g"
              placeholder="liczba całkowita"
              type="number"
              value={_g}
              min={1}
              max={100000}
              onChange={(e) => setG(e.target.value)}
            />
            <Input
              label="n"
              placeholder="liczba całkowita"
              type="number"
              value={_n}
              min={1}
              max={100000}
              onChange={(e) => setN(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3>Alicja</h3>
              <Input
                label="x"
                placeholder="liczba całkowita"
                type="number"
                value={_x}
                min={1}
                max={100000}
                onChange={(e) => setX(e.target.value)}
              />
              <MathJaxContext>
                <MathJax>{`\\(x=${x}\\)`}</MathJax>
                <MathJax>{`\\(X = g^x \\bmod n = ${g}^{${x}} \\bmod ${n} = ${
                  g ** x % n
                } \\)`}</MathJax>
              </MathJaxContext>
            </div>
            <div>
              <h3>Bob</h3>
              <Input
                label="y"
                placeholder="liczba całkowita"
                type="number"
                value={_y}
                min={1}
                max={100000}
                onChange={(e) => setY(e.target.value)}
              />
              <MathJaxContext>
                <MathJax>{`\\(y=${y} \\)`}</MathJax>
                <MathJax>{`\\(Y = g^y \\bmod n = ${g}^{${y}} \\bmod ${n} = ${
                  g ** y % n
                } \\)`}</MathJax>
              </MathJaxContext>
            </div>
            <h3 className="col-span-2 text-center">
              Publiczna wymiana kluczy X i Y
            </h3>
            <MathJaxContext>
              <MathJax>{`\\( k = Y^x \\bmod n = ${
                g ** y % n
              }^{${x}} \\bmod ${n} = ${(g ** y % n) ** x % n} \\)`}</MathJax>
            </MathJaxContext>
            <MathJaxContext>
              <MathJax>{`\\( k = X^y \\bmod n = ${
                g ** x % n
              }^{${y}} \\bmod ${n} = ${(g ** x % n) ** y % n} \\)`}</MathJax>
            </MathJaxContext>
          </div>
          <p>
            Klucze k uzyskane przez Alicję i Boba są takie same, a nie zostały
            ujawnione ich klucze prywatne x i y.
          </p>
          <p>Klucz został uzgodniony.</p>
        </div>
      </div>
    </div>
  );
}
