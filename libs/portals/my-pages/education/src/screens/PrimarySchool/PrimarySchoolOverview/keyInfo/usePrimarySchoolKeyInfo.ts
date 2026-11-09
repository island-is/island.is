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
 * Data hook for the primary-school key-information sections (Aðstandendur,
 * Tungumálaumhverfi, Heilsufarsupplýsingar). It runs the education GraphQL
 * queries/mutations and maps the (locale-neutral) GraphQL shapes onto the
 * section view models in ./types.
 *
 * The three sections are read in one query, so one request resolves the frigg
 * child id once for all of them (see PrimarySchoolKeyInfo.graphql). A caller
 * passes the sections it actually reads and the rest are left out of the
 * selection set — an edit screen needs one of the three. The mutations are
 * always available and refetch exactly what the caller reads.
 */

interface LocalizedTitle {
  is: string
  en: string
}

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
   * `false` while the read is still in flight or the sections are skipped. */
  hasKeyInfo: boolean
  /** true while the key-info read is in flight */
  loading: boolean
  /**
   * Set when the read failed outright — frigg unreachable, the token refused,
   * the child-id lookup down — so no section resolved and `hasKeyInfo` cannot
   * be trusted. A failure confined to one section is reported on that section
   * instead, and the others still carry their data.
   */
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

  const localize = (title: LocalizedTitle | undefined | null) =>
    title ? (lang === 'en' ? title.en : title.is) : undefined

  const variables = {
    studentId,
    withEmergencyContacts: sections.includes('emergencyContacts'),
    withLanguageProfile: sections.includes('languageProfile'),
    withHealthProfile: sections.includes('healthProfile'),
  }

  // errorPolicy 'all' keeps the sections that resolved: a section that failed
  // comes back null with an error of its own, which toMmsFieldError picks out
  // by path below.
  const sectionsQuery = usePrimarySchoolKeyInfoSectionsQuery({
    variables,
    errorPolicy: 'all',
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
    relationTypeLabel: localize(agent.relationType.title),
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
    languageEnvironmentLabel: localize(profile.languageEnvironment?.title),
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
      label: localize(allergy.title) ?? '',
    })),
    epipen: profile.epipen,
    medicalDiagnoses: profile.medicalDiagnoses,
    medicationAssistance: profile.medicationAssistance,
  })

  const student = sectionsQuery.data?.primarySchoolStudent
  const agents = student?.emergencyContacts
  const languageProfileData = student?.languageProfile
  const healthProfileData = student?.healthProfile

  // `hasKeyInfo` is non-nullable, so a failed child-id lookup nulls the whole
  // student and takes every section with it. That is the only case the caller
  // cannot render around, so it is reported as one read-level error rather than
  // three identical section errors.
  const readError =
    !sectionsQuery.loading && sectionsQuery.error && !student
      ? toMmsError(sectionsQuery.error)
      : undefined

  /** A section fails either on its own or with the read that carried it. The
   * overview reports the read-level failure once and leaves the sections out;
   * an edit screen reads only its own section, so it has to see it here. */
  const sectionError = (field: KeyInfoSectionName) =>
    toMmsFieldError(sectionsQuery.error, field) ?? readError

  const addAgent = useCallback(
    async (input: EmergencyContactCreateInput) => {
      await addAgentMutation({
        variables: {
          input: {
            studentId,
            nationalId: input.nationalId,
            relationTypeId: input.relationTypeId,
          },
        },
      })
    },
    [addAgentMutation, studentId],
  )

  const updateAgent = useCallback(
    async (agentId: string, input: EmergencyContactUpdateInput) => {
      await updateAgentMutation({
        variables: {
          input: {
            studentId,
            agentId,
            relationTypeId: input.relationTypeId,
          },
        },
      })
    },
    [updateAgentMutation, studentId],
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
    [updateLanguageMutation, studentId],
  )

  const saveHealthProfile = useCallback(
    async (input: HealthProfileUpdateInput) => {
      await updateHealthMutation({
        variables: {
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
    [updateHealthMutation, studentId],
  )

  return {
    hasKeyInfo: student?.hasKeyInfo ?? false,
    loading: sectionsQuery.loading,
    error: readError,
    emergencyContacts: {
      data: agents?.map(mapAgent),
      loading: sectionsQuery.loading,
      error: sectionError('emergencyContacts'),
    },
    languageProfile: {
      data: languageProfileData
        ? mapLanguageProfile(languageProfileData)
        : undefined,
      loading: sectionsQuery.loading,
      error: sectionError('languageProfile'),
    },
    healthProfile: {
      data: healthProfileData ? mapHealthProfile(healthProfileData) : undefined,
      loading: sectionsQuery.loading,
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
