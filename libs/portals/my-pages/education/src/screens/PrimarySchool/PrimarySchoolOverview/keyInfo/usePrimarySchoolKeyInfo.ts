import { useCallback } from 'react'
import { useLocale } from '@island.is/localization'
import { LocaleEnum } from '@island.is/api/schema'
import {
  PrimarySchoolKeyInfoSectionsDocument,
  usePrimarySchoolAddAgentMutation,
  usePrimarySchoolDeleteAgentMutation,
  usePrimarySchoolKeyInfoSectionsQuery,
  usePrimarySchoolUpdateAgentMutation,
  usePrimarySchoolUpdateHealthProfileMutation,
  usePrimarySchoolUpdateLanguageProfileMutation,
  type PrimarySchoolAgentFieldsFragment,
  type PrimarySchoolHealthProfileFieldsFragment,
  type PrimarySchoolLanguageProfileFieldsFragment,
} from './PrimarySchoolKeyInfo.generated'
import { toMmsError, toMmsFieldError } from './mmsError'
import type {
  EmergencyContact,
  EmergencyContactCreateInput,
  EmergencyContactUpdateInput,
  HealthProfile,
  HealthProfileUpdateInput,
  LanguageProfile,
  LanguageProfileUpdateInput,
  MmsError,
  SectionState,
} from './types'

/**
 * Data hook for the key-information sections (Aðstandendur, Tungumálaumhverfi,
 * Heilsufarsupplýsingar). A caller passes the sections it reads; the rest are
 * left out of the selection set.
 */

/** The three key-info sections, as named on {@link PrimarySchoolKeyInfo}. */
export type KeyInfoSectionName =
  | 'emergencyContacts'
  | 'languageProfile'
  | 'healthProfile'

const ALL_SECTIONS: KeyInfoSectionName[] = [
  'emergencyContacts',
  'languageProfile',
  'healthProfile',
]

export interface PrimarySchoolKeyInfo {
  /** Whether the child has a counterpart in the frigg key-info database.
   * `false` while the read is still in flight or the sections are skipped.
   * Stale rather than `false` when the read fails, so check `error` first. */
  hasKeyInfo: boolean
  /** true while the key-info read is in flight and there is nothing to show
   * yet. A background refresh over cached data does not raise it. */
  loading: boolean
  /** Set when the child-id lookup failed, so no section could resolve and
   * `hasKeyInfo` is unknown. A failure confined to one section is reported on
   * that section instead. */
  error: MmsError | undefined
  emergencyContacts: SectionState<EmergencyContact[]>
  languageProfile: SectionState<LanguageProfile>
  healthProfile: SectionState<HealthProfile>
  /** true while any key-info mutation is in flight */
  saving: boolean
  addAgent: (input: EmergencyContactCreateInput) => Promise<void>
  updateAgent: (
    agentId: string,
    input: EmergencyContactUpdateInput,
  ) => Promise<void>
  removeAgent: (agentId: string) => Promise<void>
  saveLanguageProfile: (input: LanguageProfileUpdateInput) => Promise<void>
  saveHealthProfile: (input: HealthProfileUpdateInput) => Promise<void>
}

export const usePrimarySchoolKeyInfo = (
  studentId = '',
  sections: KeyInfoSectionName[] = ALL_SECTIONS,
): PrimarySchoolKeyInfo => {
  const { lang } = useLocale()
  const locale = lang === 'en' ? LocaleEnum.En : LocaleEnum.Is

  const variables = {
    studentId,
    locale,
    withEmergencyContacts: sections.includes('emergencyContacts'),
    withLanguageProfile: sections.includes('languageProfile'),
    withHealthProfile: sections.includes('healthProfile'),
  }

  // errorPolicy 'all' caches a failed section as null, and the portal client is
  // cache-first, so without 'cache-and-network' that section would read back as
  // "no information" on every later mount until the page is reloaded.
  const sectionsQuery = usePrimarySchoolKeyInfoSectionsQuery({
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !studentId || sections.length === 0,
  })

  const refetchQueries = [
    { query: PrimarySchoolKeyInfoSectionsDocument, variables },
  ]

  // Not awaited: a refetch that fails after the write succeeded would reject
  // the caller's promise and report a successful save as a failure. The read is
  // 'cache-and-network', so the sections re-read on the next mount regardless.
  const [addAgentMutation, addAgentState] = usePrimarySchoolAddAgentMutation({
    refetchQueries,
  })
  const [updateAgentMutation, updateAgentState] =
    usePrimarySchoolUpdateAgentMutation({ refetchQueries })
  const [deleteAgentMutation, deleteAgentState] =
    usePrimarySchoolDeleteAgentMutation({ refetchQueries })
  const [updateLanguageMutation, updateLanguageState] =
    usePrimarySchoolUpdateLanguageProfileMutation({ refetchQueries })
  const [updateHealthMutation, updateHealthState] =
    usePrimarySchoolUpdateHealthProfileMutation({ refetchQueries })

  const mapAgent = (
    agent: PrimarySchoolAgentFieldsFragment,
  ): EmergencyContact => ({
    id: agent.id,
    name: agent.person.name,
    nationalId: agent.person.nationalId,
    relationTypeId: agent.relationType?.id,
    relationTypeLabel: agent.relationType?.title,
    createdBy: {
      kind: agent.createdBy.kind,
      name: agent.createdBy.displayName ?? undefined,
    },
    createdDate: agent.createdBy.at ?? undefined,
    canEdit: agent.canEdit,
  })

  const mapLanguageProfile = (
    profile: PrimarySchoolLanguageProfileFieldsFragment,
  ): LanguageProfile => ({
    languageEnvironmentId: profile.languageEnvironment?.id,
    languageEnvironmentLabel: profile.languageEnvironment?.title,
    preferredLanguage: profile.preferredLanguage ?? undefined,
    languages: profile.languages ?? [],
    interpreter: profile.interpreter,
    signLanguage: profile.signLanguage,
  })

  const mapHealthProfile = (
    profile: PrimarySchoolHealthProfileFieldsFragment,
  ): HealthProfile => ({
    allergies: (profile.allergies ?? []).map((allergy) => ({
      id: allergy.id,
      type: allergy.type,
      label: allergy.title,
    })),
    epipen: profile.epipen,
    medicalDiagnoses: profile.medicalDiagnoses,
    medicationAssistance: profile.medicationAssistance,
  })

  const student = sectionsQuery.data?.primarySchoolStudent
  const agents = student?.emergencyContacts
  const languageProfileData = student?.languageProfile
  const healthProfileData = student?.healthProfile

  // 'cache-and-network' re-reads on every mount, so this is only a loading
  // state while there is nothing to show.
  const loading = sectionsQuery.loading && !sectionsQuery.data

  // A failed child-id lookup fails every section, and is named on `hasKeyInfo`.
  const readError =
    toMmsFieldError(sectionsQuery.error, 'hasKeyInfo') ??
    // A transport failure never reached a resolver, so it carries no field
    // path to be found under — and brings back no student at all.
    (sectionsQuery.error && !student
      ? toMmsError(sectionsQuery.error)
      : undefined)

  // An error whose path names no section and not `hasKeyInfo` would otherwise
  // be dropped, leaving every section showing its empty state as if the read
  // had succeeded.
  const unattributedError =
    sectionsQuery.error &&
    !readError &&
    !ALL_SECTIONS.some((field) => toMmsFieldError(sectionsQuery.error, field))
      ? toMmsError(sectionsQuery.error)
      : undefined

  const sectionError = (field: KeyInfoSectionName) =>
    toMmsFieldError(sectionsQuery.error, field) ?? readError

  const addAgent = useCallback(
    async (input: EmergencyContactCreateInput) => {
      await addAgentMutation({
        variables: {
          locale,
          input: {
            studentId,
            nationalId: input.nationalId,
            relationTypeId: input.relationTypeId,
          },
        },
      })
    },
    [addAgentMutation, locale, studentId],
  )

  const updateAgent = useCallback(
    async (agentId: string, input: EmergencyContactUpdateInput) => {
      await updateAgentMutation({
        variables: {
          locale,
          input: {
            studentId,
            agentId,
            relationTypeId: input.relationTypeId,
          },
        },
      })
    },
    [updateAgentMutation, locale, studentId],
  )

  const removeAgent = useCallback(
    async (agentId: string) => {
      await deleteAgentMutation({
        variables: { input: { studentId, agentId } },
      })
    },
    [deleteAgentMutation, studentId],
  )

  const saveLanguageProfile = useCallback(
    async (input: LanguageProfileUpdateInput) => {
      await updateLanguageMutation({
        variables: {
          locale,
          input: {
            studentId,
            languageEnvironmentId: input.languageEnvironmentId,
            preferredLanguage: input.preferredLanguage,
            languages: input.languages,
            interpreter: input.interpreter,
            signLanguage: input.signLanguage,
          },
        },
      })
    },
    [updateLanguageMutation, locale, studentId],
  )

  const saveHealthProfile = useCallback(
    async (input: HealthProfileUpdateInput) => {
      await updateHealthMutation({
        variables: {
          locale,
          input: {
            studentId,
            epipen: input.epipen,
            medicalDiagnoses: input.medicalDiagnoses,
            medicationAssistance: input.medicationAssistance ?? false,
            // Contract §4.5: the PATCH body sends allergy ids, not objects.
            allergies: input.allergies.map((allergy) => allergy.id),
          },
        },
      })
    },
    [updateHealthMutation, locale, studentId],
  )

  return {
    hasKeyInfo: student?.hasKeyInfo ?? false,
    loading,
    error: readError ?? unattributedError,
    emergencyContacts: {
      data: agents?.map(mapAgent),
      loading,
      error: sectionError('emergencyContacts'),
    },
    languageProfile: {
      data: languageProfileData
        ? mapLanguageProfile(languageProfileData)
        : undefined,
      loading,
      error: sectionError('languageProfile'),
    },
    healthProfile: {
      data: healthProfileData ? mapHealthProfile(healthProfileData) : undefined,
      loading,
      error: sectionError('healthProfile'),
    },
    saving:
      addAgentState.loading ||
      updateAgentState.loading ||
      deleteAgentState.loading ||
      updateLanguageState.loading ||
      updateHealthState.loading,
    addAgent,
    updateAgent,
    removeAgent,
    saveLanguageProfile,
    saveHealthProfile,
  }
}
