import { $, component$, useOnWindow, useSignal, useTask$ } from '@builder.io/qwik';
import type { QRCodeToStringOptions } from 'qrcode';
import { generateQRCode } from '~/utils/qr-utils';
import styles from './qr-code.module.css';

export default component$(() => {
  const text = useSignal('https://qr.hr20k.com');
  const qrCode = useSignal('');
  const format = useSignal<'svg' | 'png'>('png');
  const size = useSignal<'medium' | 'large'>('medium');

  // create mobile flag
  const isMobile = useSignal<boolean | null>(null);

  // update mobile flag on window resize
  useOnWindow(
    'resize',
    $(() => {
      isMobile.value = window.innerWidth < 768;
    })
  );
  useOnWindow(
    'load',
    $(() => {
      isMobile.value = window.innerWidth < 768;
    })
  );

  useTask$(async ({ track }) => {
    track(() => text.value);
    track(() => format.value);
    track(() => size.value);
    track(() => isMobile.value);
    const options: QRCodeToStringOptions = {
      type: format.value === 'svg' ? 'svg' : 'utf8',
      width: format.value === 'png' && size.value === 'large' ? 1000 : isMobile.value ? 150 : 300,
      margin: 1,
      scale: 3,
    };
    qrCode.value = await generateQRCode(text.value, options);
  });

  const downloadQRCode = $(() => {
    const element = document.createElement('a');
    const fileName = `qrcode.${format.value}`;

    if (format.value === 'svg') {
      const blob = new Blob([qrCode.value], { type: 'image/svg+xml' });
      element.href = URL.createObjectURL(blob);
    } else {
      element.href = qrCode.value;
    }

    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  });

  if (isMobile.value === null) {
    return null;
  }

  return (
    <div class={styles.qrContainer}>
      <input
        type="text"
        value={text.value}
        onInput$={(ev) => (text.value = (ev.target as HTMLInputElement).value)}
        placeholder="Enter text or URL"
        class={styles.input}
      />

      <div class={styles.controls}>
        <select
          value={format.value}
          onChange$={(ev) => {
            const target = ev.target;
            if (target instanceof HTMLSelectElement) {
              if (target.value === 'svg' || target.value === 'png') {
                format.value = target.value;
              } else {
                format.value = 'svg'; // fallback to svg
              }
            }
          }}
          class={styles.select}
        >
          <option value="svg">SVG</option>
          <option value="png">PNG</option>
        </select>

        {format.value === 'png' && (
          <select
            value={size.value}
            onChange$={(ev) => {
              const target = ev.target;
              if (target instanceof HTMLSelectElement) {
                if (target.value === 'medium' || target.value === 'large') {
                  size.value = target.value;
                } else {
                  size.value = 'medium'; // fallback to medium
                }
              }
            }}
            class={styles.select}
          >
            <option value="medium">Medium (300x300)</option>
            <option value="large">Large (1000x1000)</option>
          </select>
        )}
      </div>
      <div class={styles.qrCode}>
        {format.value === 'svg' ? (
            <div dangerouslySetInnerHTML={qrCode.value} />
        ) : (
          <img
            src={qrCode.value}
            alt="QR Code"
            width={isMobile.value ? 150 : 300}
            height={isMobile.value ? 150 : 300}
          />
        )}
      </div>
      <button onClick$={downloadQRCode} class={styles.button}>
        Download {format.value.toUpperCase()}
      </button>
    </div>
  );
});
