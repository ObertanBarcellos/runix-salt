import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import es from './locales/es.json'
import pt from './locales/pt.json'

export const defaultNS = 'translation'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { [defaultNS]: pt },
      en: { [defaultNS]: en },
      es: { [defaultNS]: es },
    },
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en', 'es'],
    load: 'languageOnly',
    ns: [defaultNS],
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'runix-lang',
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
