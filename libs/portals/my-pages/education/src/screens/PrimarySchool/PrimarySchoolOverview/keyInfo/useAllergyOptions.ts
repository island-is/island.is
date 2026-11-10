import { useLocale } from '@island.is/localization'
import { usePrimarySchoolAllergiesQuery } from './PrimarySchoolKeyInfo.generated'
import type { MmsError } from './types'

/**
 * The selectable allergy reference list, served by MMS as two `GET /key-options`
 * lists. Callers split by `type` (values match AllergyCategory).
 *
 * `code` is not unique across types: `code: "other"` exists in both the food
 * and the other list, so always key selections off `value` (the id).
 */
export interface AllergySelectOption {
  /** allergy id — what HealthProfile.allergies[].id / a PATCH stores */
  value: string
  label: string
  code: string
  /** food | other (AllergyCategory) */
  type: string
}

export const useAllergyOptions = (): {
  options: AllergySelectOption[]
  loading: boolean
  error: MmsError | undefined
} => {
  const { lang } = useLocale()
  const { data, loading, error } = usePrimarySchoolAllergiesQuery({
    variables: { locale: lang },
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
