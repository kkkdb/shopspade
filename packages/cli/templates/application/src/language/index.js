import { createI18n } from 'vue-i18n'
import en from './en.json'
import th from './th.json'
import zh from './zh.json'

const i18n = createI18n({
  locale: localStorage.getItem('lang') || navigator.language,
  legacy: false,
  globalInjection: true,
  messages: {
    zh,
    en,
    th,
  },
})

export default i18n
