import path from 'path';

// Get the root directory of the project
const rootDir = process.cwd();

// Define the PDF folder path relative to the root directory
export const PDF_FOLDER_PATH = path.join(rootDir, 'BacaUrtakPDF');

// Export other configuration values
export const config = {
  pdfFolderPath: PDF_FOLDER_PATH,
  // Add other configuration values here as needed
}; 