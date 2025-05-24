import fs from 'fs';
import path from 'path';
import { config } from '../config';

export interface PDFDocument {
  name: string;
  path: string;
  content?: string;
}

export class PDFService {
  private static instance: PDFService;
  private pdfFolderPath: string;

  private constructor() {
    this.pdfFolderPath = config.pdfFolderPath;
  }

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  public getPDFFolderPath(): string {
    return this.pdfFolderPath;
  }

  public setPDFFolderPath(newPath: string): void {
    this.pdfFolderPath = newPath;
  }

  public async listPDFs(): Promise<PDFDocument[]> {
    try {
      const files = await fs.promises.readdir(this.pdfFolderPath);
      return files
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .map(file => ({
          name: file,
          path: path.join(this.pdfFolderPath, file)
        }));
    } catch (error) {
      console.error('Error listing PDFs:', error);
      throw new Error('Failed to list PDF files');
    }
  }

  public async readPDFContent(pdfPath: string): Promise<string> {
    try {
      // Here you would implement the actual PDF reading logic
      // For now, we'll just return a placeholder
      return `Content of ${pdfPath}`;
    } catch (error) {
      console.error('Error reading PDF:', error);
      throw new Error('Failed to read PDF content');
    }
  }
} 