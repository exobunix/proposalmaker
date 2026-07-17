import puppeteer from "puppeteer";
import { logger } from "./logger";
import { Proposal } from "@workspace/db";

export interface GeneratePdfOptions {
  proposalId: number;
  token: string;
  format?: "A4" | "Letter";
  theme?: string;
}

export async function generateProposalPdf(options: GeneratePdfOptions): Promise<Buffer> {
  const { proposalId, token, format = "A4", theme = "indigo" } = options;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const url = `${frontendUrl}/proposals/${proposalId}/preview?token=${token}&print=true&format=${format}&theme=${theme}`;

  let authorName = "TechVision Solutions";
  try {
    const proposal = await Proposal.findById(proposalId).lean();
    if (proposal && proposal.contactDetails) {
      authorName = proposal.contactDetails;
    }
  } catch (err) {
    logger.warn({ err, proposalId }, "Failed to fetch proposal for PDF author name");
  }

  logger.info({ url, format, theme, authorName }, "Generating PDF for proposal");

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--allow-running-insecure-content"
    ],
  });

  try {
    const page = await browser.newPage();

    // Set high DPI viewport
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    // Navigate to preview page with print params
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for proposal charts and images to load completely
    await page.waitForSelector(".proposal-ready", { timeout: 15000 }).catch(() => {
      logger.warn("Selector .proposal-ready not found, generating PDF anyway");
    });

    const isLetter = format === "Letter";

    const pdfBuffer = await page.pdf({
      format: isLetter ? "letter" : "a4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 8px; color: #94a3b8; width: 100%; padding: 0 45px; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; -webkit-print-color-adjust: exact;">
          <span>${authorName} Proposal</span>
          <span>Confidential</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-family: 'Inter', 'Segoe UI', sans-serif; font-size: 8px; color: #94a3b8; width: 100%; padding: 0 45px; display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 5px; -webkit-print-color-adjust: exact;">
          <span>${authorName} — Confidential & Proprietary</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: "70px",
        bottom: "70px",
        left: "45px",
        right: "45px",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
