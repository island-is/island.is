import { usePreferencesStore } from '../new-stores/preferences-store'

export const useLocale = () => {
  const locale = usePreferencesStore(({ locale }) => locale)
  return locale === 'is-IS' ? 'is' : 'en'
}
