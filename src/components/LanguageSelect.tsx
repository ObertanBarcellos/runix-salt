import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './LanguageSelect.css'

const LANGUAGES = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`lang-select__chevron ${open ? 'is-open' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LanguageSelect() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const resolvedCode = useMemo(() => {
    const raw = i18n.resolvedLanguage ?? i18n.language
    return raw.split('-')[0] ?? 'pt'
  }, [i18n.language, i18n.resolvedLanguage])

  const current =
    LANGUAGES.find((l) => l.code === resolvedCode) ?? LANGUAGES[0]

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const select = (code: string) => {
    void i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className="lang-select" ref={rootRef}>
      <button
        type="button"
        className={`lang-select__trigger ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('a11y.language')}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="lang-select__flag" aria-hidden>
          {current.flag}
        </span>
        <span className="lang-select__trigger-text">{current.label}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <ul className="lang-select__menu" role="listbox">
          {LANGUAGES.map((lang) => (
            <li key={lang.code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={lang.code === resolvedCode}
                className={`lang-select__option ${
                  lang.code === resolvedCode ? 'is-active' : ''
                }`}
                onClick={() => select(lang.code)}
              >
                <span className="lang-select__flag" aria-hidden>
                  {lang.flag}
                </span>
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
