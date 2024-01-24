import { translate } from "../translate/translate";
import { Glob } from "bun";

var lines_translated = 1;
var files_translated = 1;
var files_translation_needed = 0;
var lines_translation_needed = 0;
// read files line by line
async function readFile(fileName: string) {
  // Create a BunFile reference to the input file
  const input = Bun.file(fileName);

  // Get a ReadableStream of the file contents
  const stream = await input.stream();

  var lines = [];
  // Iterate over the chunks of data
  for await (const chunk of stream) {
    // Convert the chunk to a string (assuming ASCII encoding)
    const chunkText = Buffer.from(chunk).toString();

    // Split the chunk by newline characters
    lines = chunkText.split("\n");
    lines_translation_needed = lines.length;
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].length == 0) {
        i += 2;
      } else {
        let translated = await translate(lines[i]);
        try {
          lines[i] = translated?.translation.toString();
        } catch (error) {}
        lines_translated++;
        progress(
          `file translation: ${files_translated} / ${files_translation_needed} line translated: ${lines_translated} / ${lines_translation_needed}`
        );
      }
    }

    lines_translated = 0;
  }

  // Join the array elements with a newline character
  const data = lines.join("\n");

  // Write the data to a txt file
  await Bun.write(
    `./kurdishSub/${fileName.split(".").at(-2)?.split("/").at(-1)}.vtt`,
    data
  );
}

// to get all files inside a folder
export const getAllFiles = async () => {
  const glob = new Glob("./englishSub/*.srt");
  const files = glob.scanSync(".");
  files_translation_needed = Array.from(files).length;

  for (const file of glob.scanSync(".")) {
    await readFile(file.toString());
    files_translated++;
  }
};

function progress(value: string) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(value);
}
