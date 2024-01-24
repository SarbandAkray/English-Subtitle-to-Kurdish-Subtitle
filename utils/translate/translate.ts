export async function translate(line: string) {
  const result = await fetch(
    "https://translator-api.glosbe.com/translateByLangWithScore?sourceLang=en&targetLang=ckb",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.6",
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Brave";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        Referer: "https://glosbe.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: line,
      method: "POST",
    }
  );
  const ready = await result.json();
  return ready;
}
