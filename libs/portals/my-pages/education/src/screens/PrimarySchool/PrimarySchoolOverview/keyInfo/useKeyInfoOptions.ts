import { useLocale } from '@island.is/localization'
import {
  usePrimarySchoolAgentRelationTypesQuery,
  usePrimarySchoolLanguageEnvironmentsQuery,
} from './PrimarySchoolKeyInfo.generated'
import type { MmsError } from './types'

/**
 * Lookup lists for the key-information sections, resolved to `{ value, label }`
 * in the active locale. Both come from Frigg `GET /key-options`, one key-option
 * type each (`relation` and `languageEnvironment`); the api resolves the type
 * and hands back a flat list. Allergies have their own hook (useAllergyOptions)
 * because callers also need `code` / `type`.
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
  const { data, loading, error } = usePrimarySchoolAgentRelationTypesQuery()

  const options = (data?.primarySchoolAgentRelationTypes ?? [])
    .map((type) => ({
      value: type.id,
      label: lang === 'en' ? type.title.en : type.title.is,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return {
    options,
    loading,
    error: error ? { message: error.message } : undefined,
  }
}

/** Tungumálaumhverfi (LanguageProfile.languageEnvironmentId). */
export const useLanguageEnvironmentOptions = (): KeyInfoOptions => {
  const { lang } = useLocale()
  const { data, loading, error } = usePrimarySchoolLanguageEnvironmentsQuery()

  const options = (data?.primarySchoolLanguageEnvironments ?? []).map(
    (environment) => ({
      value: environment.id,
      label: lang === 'en' ? environment.title.en : environment.title.is,
    }),
  )

  return {
    options,
    loading,
    error: error ? { message: error.message } : undefined,
  }
}
