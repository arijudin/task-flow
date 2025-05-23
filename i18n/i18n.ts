import i18next from "i18next"
import { initReactI18next } from "react-i18next"

// Import translations
import enTranslation from "./locales/en.json"
import idTranslation from "./locales/id.json"
import jaTranslation from "./locales/ja.json"

// Initialize i18next
i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    id: {
      translation: idTranslation,
    },
    ja: {
      translation: jaTranslation,
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
})

export default i18next
