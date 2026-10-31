import type { PrintSettings } from '@/types/printSettings';
import { SUPPORTED_FILE_TYPES } from '@/utils/fileValidation';

export const BRAND_NAME = 'Jagan Web Solutions';
export const BRAND_WEBSITE = 'https://jaganwebsolutions.netlify.app';

export const DEFAULT_SETTINGS: PrintSettings = {
  schoolName: BRAND_NAME,
  maxFileSize: 10,
  maxCopies: 10,
  allowedFileTypes: SUPPORTED_FILE_TYPES.map((type) => type.extension),
  printApprovalRequired: false,
  defaultPrintMode: 'BLACK_WHITE',
  defaultDuplex: 'SINGLE',
};

export const HARD_MAX_FILE_MB = 50;
export const MAX_PAGE_NUMBER = 9999;
