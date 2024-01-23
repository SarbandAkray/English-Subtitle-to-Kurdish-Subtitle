async function main() {
  await readFile();
}

async function readFile() {
  // Create a BunFile reference to the input file
  const input = Bun.file("./englishSub/fastAndFerious.srt");

  // Get a ReadableStream of the file contents
  const stream = await input.stream();

  var lines;
  // Iterate over the chunks of data
  for await (const chunk of stream) {
    // Convert the chunk to a string (assuming ASCII encoding)
    const chunkText = Buffer.from(chunk).toString();

    // Split the chunk by newline characters
    lines = chunkText.split("\n");

    for (let i = 2; i < lines.length; i++) {
      if (lines[i].length == 0) {
        i += 2;
      } else {
        let translated = await translate(lines[i]);
        try {
          lines[i] = translated?.translation.toString();
        } catch (error) {
          console.log(error);
        }
        console.log(translated);
      }
    }
  }

  // Join the array elements with a newline character
  const data = lines.join("\n");

  // Write the data to a txt file
  await Bun.write("./kurdishSub/fastAndFerious.vtt", data);
}

async function translate(line: string) {
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

main();
