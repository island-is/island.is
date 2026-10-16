import { useLocale } from '@island.is/localization'
import { usePrimarySchoolAllergiesQuery } from './PrimarySchoolKeyInfo.generated'
import type { MmsError } from './types'

/**
 * `GET /allergies` (contract §4.1) — the selectable allergy reference list. One
 * flat list covering food / medicine / environmental; callers split by `type`
 * (values match AllergyCategory). Each entry resolves to a `{ value, label,
 * code, type }` pair in the active locale.
 *
 * `code` is not unique across types (`code: "other"` exists in both food and
 * environmental) — always key selections off `value` (the id).
 */
export interface AllergySelectOption {
  /** allergy id — what HealthProfile.allergies[].id / a PATCH stores */
  value: string
  /** title resolved to the active UI locale */
  label: string
  code: string
  /** food | medicine | environmental (AllergyCategory) */
  type: string
}

export const useAllergyOptions = (): {
  options: AllergySelectOption[]
  loading: boolean
  error: MmsError | undefined
} => {
  const { lang } = useLocale()
  const { data, loading, error } = usePrimarySchoolAllergiesQuery()

  const options: AllergySelectOption[] = (data?.primarySchoolAllergies ?? [])
    .map((allergy) => ({
      value: allergy.id,
      label: lang === 'en' ? allergy.title.en : allergy.title.is,
      code: allergy.code,
      type: allergy.type,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return {
    options,
    loading,
    error: error ? { message: error.message } : undefined,
  }
}
