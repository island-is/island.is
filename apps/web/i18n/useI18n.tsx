import { useContext } from 'react'

import { I18nContext } from './I18n'

export const useI18n = () => {
  const i18n = useContext(I18nContext)
  if (!i18n) {
    throw new Error('Missing i18n context')
  }
  return i18n
}

export default useI18n
