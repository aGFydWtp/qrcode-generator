import QRCode from 'qrcode';
import type { QRCodeToStringOptions } from 'qrcode';

export async function generateQRCode(
  text: string,
  options: QRCodeToStringOptions
): Promise<string> {
  try {
    if (options.type === 'svg') {
      return await QRCode.toString(text, {
        ...options,
        type: 'svg',
      });
    } else {
      return await QRCode.toDataURL(text, {
        ...options,
        type: 'image/png',
      });
    }
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}