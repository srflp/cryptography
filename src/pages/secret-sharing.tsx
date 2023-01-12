import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useMemo, useState } from "react";
import { Input, InputContainer } from "../components/Input";
import { generateShares } from "../algorithms/shamirs-secret-sharing/generateShares";
import { decodeFromShares } from "../algorithms/shamirs-secret-sharing/decodeFromShares";
import Head from "next/head";

export default function SecretSharing() {
  const [secret, setSecret] = useState("sekret123");

  const [shareCount, setShareCount] = useState(5);
  const [threshold, setThreshold] = useState(3);
  const [generatingInfo, setGeneratingInfo] = useState<Record<string, any>>({});
  const shares = useMemo(
    () => generateShares(secret, shareCount, threshold, setGeneratingInfo),
    [secret, shareCount, threshold, setGeneratingInfo]
  );

  const [sharesDecodingCount, setSharesDecodingCount] = useState(3);
  const [sharesDecoding, setSharesDecoding] = useState<string[]>(
    Array.from({ length: sharesDecodingCount }, () => "")
  );
  const decodedSecret = useMemo(
    () =>
      sharesDecoding.filter(Boolean).length === sharesDecodingCount
        ? decodeFromShares(sharesDecoding).toString()
        : "",
    [sharesDecoding, sharesDecodingCount]
  );

  return (
    <div className="prose dark:prose-invert max-w-none mb-10">
      <Head>
        <title>Podział sekretu</title>
      </Head>
      <h2>Podział sekretu - Shamir&apos;s Secret Sharing</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h3>Podział sekretu</h3>
          <InputContainer>
            <Input
              label="Sekret"
              placeholder="tekst"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <Input
              label="Udziały"
              placeholder="liczba całkowita"
              type="number"
              value={shareCount}
              min={1}
              max={10}
              onChange={(e) => {
                if (e.target.valueAsNumber < 1) setShareCount(1);
                else
                  e.target.valueAsNumber > 10
                    ? setShareCount(10)
                    : setShareCount(e.target.valueAsNumber);

                if (e.target.valueAsNumber < threshold)
                  setThreshold(e.target.valueAsNumber);
              }}
            />
            <Input
              label="Próg (threshold) - minimalna liczba udziałów do odzyskania sekretu"
              placeholder="liczba całkowita"
              type="number"
              value={threshold}
              min={2}
              max={shareCount}
              onChange={(e) => {
                if (e.target.valueAsNumber < 1) setThreshold(1);
                else
                  e.target.valueAsNumber > shareCount
                    ? setThreshold(shareCount)
                    : setThreshold(e.target.valueAsNumber);
              }}
            />
          </InputContainer>
          <pre>{JSON.stringify(generatingInfo, null, 2)}</pre>
          <h3>Wygenerowane udziały</h3>
          <InputContainer>
            {Array.from({ length: shareCount }, (_, i) => i + 1).map(
              (i, index) => (
                <div key={i} className="">
                  <Input
                    label={`Udział ${i}`}
                    placeholder="liczba 256-bitowa"
                    value={shares[index]}
                    readOnly
                    after={
                      <button
                        className="w-10 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-gray-400 disabled:bg-blue-100 disabled:cursor-not-allowed"
                        onClick={() => {
                          const firstEmptyIndex = sharesDecoding.findIndex(
                            (s) => s === "" || !shares.includes(s)
                          );

                          const newSharesDecoding = [...sharesDecoding];
                          if (firstEmptyIndex !== -1) {
                            if (sharesDecodingCount > sharesDecoding.length) {
                              newSharesDecoding[sharesDecoding.length] =
                                shares[index];
                            } else {
                              newSharesDecoding[firstEmptyIndex] =
                                shares[index];
                            }
                          } else {
                            newSharesDecoding[sharesDecoding.length - 1] =
                              shares[index];
                          }
                          setSharesDecoding(newSharesDecoding);
                        }}
                        disabled={sharesDecoding.includes(shares[index])}
                      >
                        {sharesDecoding.includes(shares[index])
                          ? sharesDecoding.findIndex(
                              (s) => s === shares[index]
                            ) + 1
                          : ">>"}
                      </button>
                    }
                  />
                </div>
              )
            )}
          </InputContainer>
        </div>
        <div>
          <h3>Dekodowanie sekretu</h3>
          <div className="flex flex-col gap-3">
            <InputContainer>
              <Input
                label="Liczba udziałów"
                placeholder="liczba całkowita"
                type="number"
                min={1}
                max={10}
                value={sharesDecodingCount}
                onChange={(e) => {
                  if (e.target.valueAsNumber < 1) setSharesDecodingCount(1);
                  else
                    e.target.valueAsNumber > 10
                      ? setSharesDecodingCount(10)
                      : setSharesDecodingCount(e.target.valueAsNumber);
                }}
              />
            </InputContainer>
            <InputContainer>
              {Array.from({ length: sharesDecodingCount }, (_, i) => i + 1).map(
                (i, index) => (
                  <Input
                    key={i}
                    label={`Udział ${i}`}
                    placeholder="liczba 256-bitowa"
                    value={sharesDecoding[index]}
                    onChange={(e) => {
                      const newSharesDecoding = [...sharesDecoding];
                      newSharesDecoding[index] = e.target.value;
                      setSharesDecoding(newSharesDecoding);
                    }}
                    after={
                      sharesDecoding[index] !== "" ? (
                        <button
                          className="w-10 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-gray-400"
                          onClick={() => {
                            const newSharesDecoding = [...sharesDecoding];
                            newSharesDecoding[index] = "";
                            setSharesDecoding(newSharesDecoding);
                          }}
                        >
                          x
                        </button>
                      ) : null
                    }
                  />
                )
              )}
            </InputContainer>
            <InputContainer>
              <Input
                label="Zdekodowany sekret"
                placeholder="tekst"
                value={decodedSecret}
                readOnly
              />
            </InputContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
