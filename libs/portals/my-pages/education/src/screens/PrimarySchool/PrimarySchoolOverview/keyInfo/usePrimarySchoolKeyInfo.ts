import { useCallback } from 'react'
import { useLocale } from '@island.is/localization'
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
 * Heilsufarsupplýsingar). It runs the education GraphQL queries/mutations and
 * flattens them onto the section view models in ./types.
 *
 * A caller passes the sections it reads — the overview takes all three, an edit
 * screen one — and the rest are left out of the selection set; see
 * PrimarySchoolKeyInfo.graphql for why they share one query. The mutations are
 * always available and refetch exactly what the caller reads.
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

  const variables = {
    studentId,
    locale: lang,
    withEmergencyContacts: sections.includes('emergencyContacts'),
    withLanguageProfile: sections.includes('languageProfile'),
    withHealthProfile: sections.includes('healthProfile'),
  }

  // errorPolicy 'all' keeps the sections that resolved; a failed one comes back
  // null with an error of its own, which toMmsFieldError picks out by path.
  // That null is cached, and the portal client is cache-first, so without
  // 'cache-and-network' a section that failed once would read back as "no
  // information" on every later mount until the page is reloaded.
  const sectionsQuery = usePrimarySchoolKeyInfoSectionsQuery({
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !studentId || sections.length === 0,
  })

  // Every mutation refetches the same selection the caller reads, so a save
  // refreshes exactly the sections on screen and nothing else.
  const refetchQueries = [
    { query: PrimarySchoolKeyInfoSectionsDocument, variables },
  ]

  const [addAgentMutation, addAgentState] = usePrimarySchoolAddAgentMutation({
    refetchQueries,
    awaitRefetchQueries: true,
  })
  const [updateAgentMutation, updateAgentState] =
    usePrimarySchoolUpdateAgentMutation({
      refetchQueries,
      awaitRefetchQueries: true,
    })
  const [deleteAgentMutation, deleteAgentState] =
    usePrimarySchoolDeleteAgentMutation({
      refetchQueries,
      awaitRefetchQueries: true,
    })
  const [updateLanguageMutation, updateLanguageState] =
    usePrimarySchoolUpdateLanguageProfileMutation({
      refetchQueries,
      awaitRefetchQueries: true,
    })
  const [updateHealthMutation, updateHealthState] =
    usePrimarySchoolUpdateHealthProfileMutation({
      refetchQueries,
      awaitRefetchQueries: true,
    })

  const mapAgent = (
    agent: PrimarySchoolAgentFieldsFragment,
  ): EmergencyContact => ({
    id: agent.id,
    name: agent.person.name,
    nationalId: agent.person.nationalId,
    relationTypeId: agent.relationType.id,
    relationTypeLabel: agent.relationType.title,
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

  // Only a loading state while there is nothing to show: 'cache-and-network'
  // re-reads on every mount, which would otherwise flash a loader over cached
  // sections each time.
  const loading = sectionsQuery.loading && !sectionsQuery.data

  // The child-id lookup is what every section starts from, so when it fails all
  // three fail with it. The failure is named on `hasKeyInfo` and reported once
  // here rather than as three identical section errors.
  const readError =
    toMmsFieldError(sectionsQuery.error, 'hasKeyInfo') ??
    // A transport failure never reached a resolver, so it carries no field
    // path to be found under — and brings back no student at all.
    (sectionsQuery.error && !student
      ? toMmsError(sectionsQuery.error)
      : undefined)

  /** A section fails either on its own or with the read that carried it. The
   * overview reports the read-level failure once and leaves the sections out;
   * an edit screen reads only its own section, so it has to see it here. */
  const sectionError = (field: KeyInfoSectionName) =>
    toMmsFieldError(sectionsQuery.error, field) ?? readError

  const addAgent = useCallback(
    async (input: EmergencyContactCreateInput) => {
      await addAgentMutation({
        variables: {
          locale: lang,
          input: {
            studentId,
            nationalId: input.nationalId,
            relationTypeId: input.relationTypeId,
          },
        },
      })
    },
    [addAgentMutation, lang, studentId],
  )

  const updateAgent = useCallback(
    async (agentId: string, input: EmergencyContactUpdateInput) => {
      await updateAgentMutation({
        variables: {
          locale: lang,
          input: {
            studentId,
            agentId,
            relationTypeId: input.relationTypeId,
          },
        },
      })
    },
    [updateAgentMutation, lang, studentId],
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
          locale: lang,
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
    [updateLanguageMutation, lang, studentId],
  )

  const saveHealthProfile = useCallback(
    async (input: HealthProfileUpdateInput) => {
      await updateHealthMutation({
        variables: {
          locale: lang,
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
    [updateHealthMutation, lang, studentId],
  )

  return {
    hasKeyInfo: student?.hasKeyInfo ?? false,
    loading,
    error: readError,
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
