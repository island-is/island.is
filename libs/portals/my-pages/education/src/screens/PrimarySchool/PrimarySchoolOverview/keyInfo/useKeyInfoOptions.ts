import { useLocale } from '@island.is/localization'
import { LocaleEnum } from '@island.is/api/schema'
import {
  usePrimarySchoolAgentRelationTypesQuery,
  usePrimarySchoolLanguageEnvironmentsQuery,
} from './PrimarySchoolKeyInfo.generated'
import type { MmsError } from './types'

/**
 * Lookup lists for the key-information sections. Both come from Frigg
 * `GET /key-options`, one key-option type each (`relation` and
 * `languageEnvironment`); the api resolves the type, localises the titles and
 * orders the list. Allergies have their own hook (useAllergyOptions) because
 * callers also need `code` / `type`.
 */
export interface KeyInfoSelectOption {
  value: string
  label: string
}

interface KeyInfoOptions {
  options: KeyInfoSelectOption[]
  loading: boolean
  error: MmsError | undefined
}

/** Tengsl (EmergencyContact.relationTypeId). */
export const useAgentRelationTypeOptions = (): KeyInfoOptions => {
  const { lang } = useLocale()
  const { data, loading, error } = usePrimarySchoolAgentRelationTypesQuery({
    variables: { locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is },
  })

  const options = (data?.primarySchoolAgentRelationTypes ?? []).map((type) => ({
    value: type.id,
    label: type.title,
  }))

  return {
    options,
    loading,
    error: error ? { message: error.message } : undefined,
  }
}

/** Tungumálaumhverfi (LanguageProfile.languageEnvironmentId). */
export const useLanguageEnvironmentOptions = (): KeyInfoOptions => {
  const { lang } = useLocale()
  const { data, loading, error } = usePrimarySchoolLanguageEnvironmentsQuery({
    variables: { locale: lang === 'en' ? LocaleEnum.En : LocaleEnum.Is },
  })

  const options = (data?.primarySchoolLanguageEnvironments ?? []).map(
    (environment) => ({
      value: environment.id,
      label: environment.title,
    }),
  )

  return {
    options,
    loading,
    error: error ? { message: error.message } : undefined,
  }
}
