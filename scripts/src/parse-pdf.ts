import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

async function main() {
  const pdfPath = "d:\\all software\\Propsal Builder\\Proposal-AI-Builder\\refrence\\proposal.pdf";
  const outputPath = "d:\\all software\\Propsal Builder\\Proposal-AI-Builder\\refrence\\proposal_extracted.txt";

  console.log("Reading PDF from:", pdfPath);
  const dataBuffer = fs.readFileSync(pdfPath);
  
  try {
    const parser = new pdf.PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    console.log("Number of pages parsed:", result.total);
    fs.writeFileSync(outputPath, result.text);
    console.log("Saved extracted text to:", outputPath);
  } catch (error) {
    console.error("Error parsing PDF:", error);
  }
}

main();
