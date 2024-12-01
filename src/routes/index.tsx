import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import QRCode from '~/components/qr-code/qr-code';

export default component$(() => {
  return (
    <div class="container container-center">
      <QRCode />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'QR Code Generator',
  meta: [
    {
      name: 'description',
      content: 'Generate QR codes in SVG or PNG format',
    },
  ],
};