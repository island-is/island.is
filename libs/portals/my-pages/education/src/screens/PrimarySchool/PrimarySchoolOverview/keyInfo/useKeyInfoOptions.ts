import { useLocale } from '@island.is/localization'
import {
  usePrimarySchoolAgentRelationTypesQuery,
  usePrimarySchoolLanguageEnvironmentsQuery,
} from './PrimarySchoolKeyInfo.generated'
import type { MmsError } from './types'

/**
 * Lookup lists for the key-information sections, resolved to `{ value, label }`
 * in the active locale:
 *   - agent relation types → GET /agent-relation-types (contract §4.1)
 *   - language environments → GET /language-environments (contract §4.1)
 *
 * These replace the earlier Frigg `key-options` guesses: the MMS contract v0.2
 * serves them from their own endpoints, not from Frigg. Allergies have their
 * own hook (useAllergyOptions) because callers also need `code` / `type`.
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
