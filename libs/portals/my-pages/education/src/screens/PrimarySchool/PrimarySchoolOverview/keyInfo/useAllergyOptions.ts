import { useLocale } from '@island.is/localization'
import { LocaleEnum } from '@island.is/api/schema'
import { usePrimarySchoolAllergiesQuery } from './PrimarySchoolKeyInfo.generated'
import type { AllergyCategory, MmsError } from './types'

/**
 * The selectable allergy reference list, served by MMS as two `GET /key-options`
 * lists. Callers split by `type`.
 *
 * `code` is not unique across types: `code: "other"` exists in both the food
 * and the other list, so always key selections off `value` (the id).
 */
export interface AllergySelectOption {
  /** allergy id — what HealthProfile.allergies[].id / a PATCH stores */
  value: string
  label: string
  code: string
  type: AllergyCategory
}

export const useAllergyOptions = (): {
  options: AllergySelectOption[]
  loading: boolean
  error: MmsError | undefined
} => {
  const { lang } = useLocale()
  const { data, loading, error } = usePrimarySchoolAllergiesQuery({
    variables: { locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is },
  })

  const options = (data?.primarySchoolAllergies ?? []).map((allergy) => ({
    value: allergy.id,
    label: allergy.title,
    code: allergy.code,
    type: allergy.type,
  }))

  return {
    options,
    loading,
    error: error ? { message: error.message } : undefined,
  }
}
