import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './useLang'
import { translations } from './i18n'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('uz')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => {
    const t = (key) => {
      const parts = key.split('.')
      return parts.reduce((acc, part) => acc?.[part], translations[lang])
    }
    return { lang, setLang, t }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
