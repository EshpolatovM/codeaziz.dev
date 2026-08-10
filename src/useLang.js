import { createContext, useContext } from 'react'

export const LanguageContext = createContext(null)

export function useLang() {
  return useContext(LanguageContext)
}
