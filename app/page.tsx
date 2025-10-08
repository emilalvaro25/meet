// PATH: app/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import { encodePassphrase, generateRoomId, randomString } from '@/lib/client-utils';
import styles from '../styles/Home.module.css';

/* =========================
   Full Language Catalog (ISO 639-1)
   ========================= */
type Lang = { code: string; label: string };
const LANGUAGES: Lang[] = [
  { code: 'af', label: 'Afrikaans' },
  { code: 'ak', label: 'Akan' },
  { code: 'am', label: 'Amharic' },
  { code: 'ar', label: 'Arabic' },
  { code: 'as', label: 'Assamese' },
  { code: 'az', label: 'Azerbaijani' },
  { code: 'be', label: 'Belarusian' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'bh', label: 'Bihari' },
  { code: 'bn', label: 'Bengali' },
  { code: 'bs', label: 'Bosnian' },
  { code: 'ca', label: 'Catalan' },
  { code: 'ceb', label: 'Cebuano' },
  { code: 'co', label: 'Corsican' },
  { code: 'cs', label: 'Czech' },
  { code: 'cy', label: 'Welsh' },
  { code: 'da', label: 'Danish' },
  { code: 'de', label: 'German' },
  { code: 'dv', label: 'Divehi' },
  { code: 'ee', label: 'Ewe' },
  { code: 'el', label: 'Greek' },
  { code: 'en', label: 'English' },
  { code: 'eo', label: 'Esperanto' },
  { code: 'es', label: 'Spanish' },
  { code: 'et', label: 'Estonian' },
  { code: 'eu', label: 'Basque' },
  { code: 'fa', label: 'Persian' },
  { code: 'fi', label: 'Finnish' },
  { code: 'fil', label: 'Filipino' },
  { code: 'fj', label: 'Fijian' },
  { code: 'fo', label: 'Faroese' },
  { code: 'fr', label: 'French' },
  { code: 'fy', label: 'Frisian' },
  { code: 'ga', label: 'Irish' },
  { code: 'gd', label: 'Scottish Gaelic' },
  { code: 'gl', label: 'Galician' },
  { code: 'gn', label: 'Guarani' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ha', label: 'Hausa' },
  { code: 'haw', label: 'Hawaiian' },
  { code: 'he', label: 'Hebrew' },
  { code: 'hi', label: 'Hindi' },
  { code: 'hmn', label: 'Hmong' },
  { code: 'hr', label: 'Croatian' },
  { code: 'ht', label: 'Haitian Creole' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'hy', label: 'Armenian' },
  { code: 'ia', label: 'Interlingua' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ig', label: 'Igbo' },
  { code: 'is', label: 'Icelandic' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'jv', label: 'Javanese' },
  { code: 'ka', label: 'Georgian' },
  { code: 'kk', label: 'Kazakh' },
  { code: 'km', label: 'Khmer' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ko', label: 'Korean' },
  { code: 'ku', label: 'Kurdish' },
  { code: 'ky', label: 'Kyrgyz' },
  { code: 'la', label: 'Latin' },
  { code: 'lb', label: 'Luxembourgish' },
  { code: 'lg', label: 'Ganda' },
  { code: 'ln', label: 'Lingala' },
  { code: 'lo', label: 'Lao' },
  { code: 'lt', label: 'Lithuanian' },
  { code: 'lv', label: 'Latvian' },
  { code: 'mg', label: 'Malagasy' },
  { code: 'mi', label: 'Maori' },
  { code: 'mk', label: 'Macedonian' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mn', label: 'Mongolian' },
  { code: 'mr', label: 'Marathi' },
  { code: 'ms', label: 'Malay' },
  { code: 'mt', label: 'Maltese' },
  { code: 'my', label: 'Burmese' },
  { code: 'nb', label: 'Norwegian Bokmål' },
  { code: 'ne', label: 'Nepali' },
  { code: 'nl', label: 'Dutch (Vlaams)' },
  { code: 'nn', label: 'Norwegian Nynorsk' },
  { code: 'no', label: 'Norwegian' },
  { code: 'ny', label: 'Nyanja (Chichewa)' },
  { code: 'om', label: 'Oromo' },
  { code: 'or', label: 'Odia (Oriya)' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'pl', label: 'Polish' },
  { code: 'ps', label: 'Pashto' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'qu', label: 'Quechua' },
  { code: 'ro', label: 'Romanian' },
  { code: 'ru', label: 'Russian' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'sd', label: 'Sindhi' },
  { code: 'si', label: 'Sinhala' },
  { code: 'sk', label: 'Slovak' },
  { code: 'sl', label: 'Slovene' },
  { code: 'sm', label: 'Samoan' },
  { code: 'sn', label: 'Shona' },
  { code: 'so', label: 'Somali' },
  { code: 'sq', label: 'Albanian' },
  { code: 'sr', label: 'Serbian' },
  { code: 'st', label: 'Sesotho' },
  { code: 'su', label: 'Sundanese' },
  { code: 'sv', label: 'Swedish' },
  { code: 'sw', label: 'Swahili' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'tg', label: 'Tajik' },
  { code: 'th', label: 'Thai' },
  { code: 'ti', label: 'Tigrinya' },
  { code: 'tl', label: 'Tagalog' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ts', label: 'Tsonga' },
  { code: 'tt', label: 'Tatar' },
  { code: 'ug', label: 'Uyghur' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'ur', label: 'Urdu' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'xh', label: 'Xhosa' },
  { code: 'yi', label: 'Yiddish' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'zh', label: 'Chinese (Mandarin)' },
  { code: 'zu', label: 'Zulu' },
];

/* =========================
   Language Dropdown (no AI branding)
   ========================= */
function LanguageDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <label htmlFor="language" style={{ fontWeight: 600, minWidth: 90 }}>
        Language
      </label>
      <select
        id="language"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '0.5rem', minWidth: 260 }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================
   Tabs
   ========================= */
function Tabs(props: React.PropsWithChildren<{}>) {
  const searchParams = useSearchParams();
  const tabIndex = searchParams?.get('tab') === 'custom' ? 1 : 0;
  const router = useRouter();
  function onTabSelected(index: number) {
    const tab = index === 1 ? 'custom' : 'demo';
    router.push(`/?tab=${tab}`);
  }

  const tabs = React.Children.map(props.children, (child, index) => {
    return (
      <button
        className="lk-button"
        onClick={() => onTabSelected(index)}
        aria-pressed={tabIndex === index}
      >
        {/* @ts-ignore */}
        {child?.props.label}
      </button>
    );
  });

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabSelect}>{tabs}</div>
      {/* @ts-ignore */}
      {props.children[tabIndex]}
    </div>
  );
}

/* =========================
   Demo Tab
   ========================= */
function DemoMeetingTab(props: { label: string }) {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

  const startMeeting = () => {
    if (e2ee) {
      router.push(`/rooms/${generateRoomId()}#${encodePassphrase(sharedPassphrase)}`);
    } else {
      router.push(`/rooms/${generateRoomId()}`);
    }
  };

  return (
    <div className={styles.tabContent}>
      <p style={{ margin: 0 }}>
        Try <strong>Zumi — Multi Translator Meeting</strong> with our live demo.
      </p>
      <button style={{ marginTop: '1rem' }} className="lk-button" onClick={startMeeting}>
        Start Meeting
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input
            id="use-e2ee"
            type="checkbox"
            checked={e2ee}
            onChange={(ev) => setE2ee(ev.target.checked)}
          />
          <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
        </div>
        {e2ee && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   Custom Tab (passes lang+voice silently)
   ========================= */
function CustomConnectionTab(props: { label: string }) {
  const router = useRouter();
  const [e2ee, setE2ee] = useState(false);
  const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

  // Language and voice (voice fixed to Charon as requested)
  const defaultLang =
    (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_DEFAULT_LANG) || 'en';
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const voice = 'Charon';

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const serverUrl = String(formData.get('serverUrl') || '');
    const token = String(formData.get('token') || '');

    const base = `/custom/?liveKitUrl=${encodeURIComponent(serverUrl)}&token=${encodeURIComponent(
      token,
    )}&lang=${encodeURIComponent(selectedLang)}&voice=${encodeURIComponent(voice)}`;

    if (e2ee) {
      router.push(`${base}#${encodePassphrase(sharedPassphrase)}`);
    } else {
      router.push(base);
    }
  };

  return (
    <form className={styles.tabContent} onSubmit={onSubmit}>
      <p style={{ marginTop: 0 }}>
        Connect <strong>Zumi — Multi Translator Meeting</strong> to your own LiveKit server.
      </p>

      <input
        id="serverUrl"
        name="serverUrl"
        type="url"
        placeholder="LiveKit Server URL (e.g., wss://*.livekit.cloud)"
        required
      />

      <textarea
        id="token"
        name="token"
        placeholder="Token"
        required
        rows={5}
        style={{ padding: '1px 2px', fontSize: 'inherit', lineHeight: 'inherit' }}
      />

      {/* Language selector only — no AI branding shown */}
      <LanguageDropdown value={selectedLang} onChange={setSelectedLang} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
          <input
            id="use-e2ee"
            type="checkbox"
            checked={e2ee}
            onChange={(ev) => setE2ee(ev.target.checked)}
          />
          <label htmlFor="use-e2ee">Enable end-to-end encryption</label>
        </div>

        {e2ee && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={sharedPassphrase}
              onChange={(ev) => setSharedPassphrase(ev.target.value)}
            />
          </div>
        )}
      </div>

      <hr
        style={{ width: '100%', borderColor: 'rgba(255, 255, 255, 0.15)', marginBlock: '1rem' }}
      />

      <button style={{ paddingInline: '1.25rem', width: '100%' }} className="lk-button" type="submit">
        Connect
      </button>
    </form>
  );
}

/* =========================
   Page
   ========================= */
export default function Page() {
  return (
    <>
      <main className={styles.main} data-lk-theme="default">
        <div className="header" style={{ textAlign: 'center' }}>
          <img
            src="/images/zumi-logo.svg"
            alt="Zumi — Multi Translator Meeting"
            width="360"
            height="45"
          />
          <h2 style={{ marginTop: '0.75rem' }}>Zumi — Multi Translator Meeting</h2>
          <p style={{ opacity: 0.85, marginTop: '0.25rem' }}>
            Real-time multilingual meetings. Choose your target language; voice defaults to Charon.
          </p>
        </div>

        <Suspense fallback="Loading">
          <Tabs>
            <DemoMeetingTab label="Demo" />
            <CustomConnectionTab label="Custom" />
          </Tabs>
        </Suspense>
      </main>

      <footer data-lk-theme="default" style={{ textAlign: 'center' }}>
        © {new Date().getFullYear()} Zumi — Multi Translator Meeting
      </footer>
    </>
  );
}
