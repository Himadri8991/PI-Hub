import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export interface PDFProcessingOptions {
  rangeMode?: "range" | "all";
  pageRange?: string;
  rotationDegrees?: number;
  watermarkText?: string;
  opacity?: number;
  angle?: string;
  password?: string;
  orientation?: "portrait" | "landscape" | "auto";
  margin?: "none" | "small" | "big";
}

/**
 * Merge multiple PDF files into a single unified document
 */
export async function mergePDFs(files: File[]): Promise<{ blob: Blob; outputName: string }> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return {
    blob: new Blob([pdfBytes], { type: "application/pdf" }),
    outputName: "merged_document.pdf",
  };
}

/**
 * Split a PDF by extracting specified page ranges
 */
export async function splitPDF(
  file: File,
  options: PDFProcessingOptions
): Promise<{ blob: Blob; outputName: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const totalPages = srcPdf.getPageCount();
  const rangeStr = options.pageRange || "1";
  const targetIndices: number[] = [];

  // Parse comma-separated and dash ranges (e.g. "1-3, 5")
  const parts = rangeStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          targetIndices.push(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        targetIndices.push(pageNum - 1);
      }
    }
  }

  const uniqueIndices = Array.from(new Set(targetIndices));
  const pagesToCopy = uniqueIndices.length > 0 ? uniqueIndices : [0];

  const copiedPages = await newPdf.copyPages(srcPdf, pagesToCopy);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob: new Blob([pdfBytes], { type: "application/pdf" }),
    outputName: `${baseName}_split.pdf`,
  };
}

/**
 * Rotate all pages in a PDF document
 */
export async function rotatePDF(
  file: File,
  options: PDFProcessingOptions
): Promise<{ blob: Blob; outputName: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const rotAngle = Number(options.rotationDegrees) || 90;

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const currentRot = page.getRotation().angle;
    page.setRotation(degrees((currentRot + rotAngle) % 360));
  }

  const pdfBytes = await pdfDoc.save();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob: new Blob([pdfBytes], { type: "application/pdf" }),
    outputName: `${baseName}_rotated.pdf`,
  };
}

/**
 * Add diagonal or horizontal watermark stamp to PDF pages
 */
export async function watermarkPDF(
  file: File,
  options: PDFProcessingOptions
): Promise<{ blob: Blob; outputName: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const text = options.watermarkText || "CONFIDENTIAL";
  const opacity = (options.opacity ?? 30) / 100;
  const angleDeg = options.angle === "0" ? 0 : 45;

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) * 0.1;
    const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
    const textHeight = helveticaFont.heightAtSize(fontSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0.85, 0.1, 0.1),
      opacity: opacity,
      rotate: degrees(angleDeg),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return {
    blob: new Blob([pdfBytes], { type: "application/pdf" }),
    outputName: `${baseName}_watermarked.pdf`,
  };
}

/**
 * Convert images into a multi-page PDF document
 */
export async function imagesToPDF(
  files: File[],
  options: PDFProcessingOptions
): Promise<{ blob: Blob; outputName: string }> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let embeddedImg;

    if (file.type === "image/png") {
      embeddedImg = await pdfDoc.embedPng(arrayBuffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(arrayBuffer);
    }

    const { width: imgW, height: imgH } = embeddedImg;
    const margin = options.margin === "none" ? 0 : options.margin === "big" ? 50 : 20;

    let pageWidth = 595.28; // Standard A4 points
    let pageHeight = 841.89;

    if (options.orientation === "landscape" || (options.orientation === "auto" && imgW > imgH)) {
      pageWidth = 841.89;
      pageHeight = 595.28;
    }

    const availW = pageWidth - margin * 2;
    const availH = pageHeight - margin * 2;
    const scale = Math.min(availW / imgW, availH / imgH, 1);

    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const posX = margin + (availW - drawW) / 2;
    const posY = margin + (availH - drawH) / 2;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImg, {
      x: posX,
      y: posY,
      width: drawW,
      height: drawH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return {
    blob: new Blob([pdfBytes], { type: "application/pdf" }),
    outputName: "images_converted.pdf",
  };
}
