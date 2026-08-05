import { formatDate } from '@island.is/web/utils/formatDate'

export const formatValidityDate = (
  iso: string,
  indefinite: string,
  locale: string,
): string => {
  if (!iso) return indefinite
  const d = new Date(iso)
  if (isNaN(d.getTime()) || d.getFullYear() >= 2200) return indefinite
  return formatDate(d, locale as 'is' | 'en', 'dd.MM.yyyy') ?? indefinite
}
