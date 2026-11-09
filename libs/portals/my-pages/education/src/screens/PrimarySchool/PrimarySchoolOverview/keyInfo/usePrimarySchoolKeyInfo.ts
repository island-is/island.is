import { useCallback } from 'react'
import { useLocale } from '@island.is/localization'
import {
  PrimarySchoolAgentsDocument,
  PrimarySchoolHealthProfileDocument,
  PrimarySchoolLanguageProfileDocument,
  usePrimarySchoolAddAgentMutation,
  usePrimarySchoolAgentsQuery,
  usePrimarySchoolDeleteAgentMutation,
  usePrimarySchoolHealthProfileQuery,
  usePrimarySchoolLanguageProfileQuery,
  usePrimarySchoolUpdateAgentMutation,
  usePrimarySchoolUpdateHealthProfileMutation,
  usePrimarySchoolUpdateLanguageProfileMutation,
  type PrimarySchoolAgentFieldsFragment,
  type PrimarySchoolHealthProfileFieldsFragment,
  type PrimarySchoolLanguageProfileFieldsFragment,
} from './PrimarySchoolKeyInfo.generated'
import { toMmsError } from './mmsError'
import type {
  EmergencyContact,
  EmergencyContactCreateInput,
  EmergencyContactUpdateInput,
  HealthProfile,
  HealthProfileUpdateInput,
  LanguageProfile,
  LanguageProfileUpdateInput,
  SectionState,
} from './types'

/**
 * Data hook for the primary-school key-information sections (Aðstandendur,
 * Tungumálaumhverfi, Heilsufarsupplýsingar). It runs the education GraphQL
 * queries/mutations and maps the (locale-neutral) GraphQL shapes onto the
 * section view models in ./types.
 *
 * Each section is its own query, so a caller passes the sections it actually
 * reads and the rest are skipped — an edit screen needs one of the three. The
 * mutations are always available; their refetches run whether or not the
 * matching read is active.
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
  const skipSection = (section: KeyInfoSectionName) =>
    !studentId || !sections.includes(section)

  const localize = (title: LocalizedTitle | undefined | null) =>
    title ? (lang === 'en' ? title.en : title.is) : undefined

  const agentsQuery = usePrimarySchoolAgentsQuery({
    variables: { studentId },
    skip: skipSection('emergencyContacts'),
  })
  const languageQuery = usePrimarySchoolLanguageProfileQuery({
    variables: { studentId },
    skip: skipSection('languageProfile'),
  })
  const healthQuery = usePrimarySchoolHealthProfileQuery({
    variables: { studentId },
    skip: skipSection('healthProfile'),
  })

  const refetchQueries = [
    { query: PrimarySchoolAgentsDocument, variables: { studentId } },
  ]
  const refetchLanguage = [
    { query: PrimarySchoolLanguageProfileDocument, variables: { studentId } },
  ]
  const refetchHealth = [
    { query: PrimarySchoolHealthProfileDocument, variables: { studentId } },
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
    usePrimarySchoolUpdateLanguageProfileMutation()
  const [updateHealthMutation, updateHealthState] =
    usePrimarySchoolUpdateHealthProfileMutation()

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

  const agents = agentsQuery.data?.primarySchoolStudent?.emergencyContacts
  const languageProfileData =
    languageQuery.data?.primarySchoolStudent?.languageProfile
  const healthProfileData =
    healthQuery.data?.primarySchoolStudent?.healthProfile

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
        refetchQueries: refetchLanguage,
        awaitRefetchQueries: true,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        refetchQueries: refetchHealth,
        awaitRefetchQueries: true,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateHealthMutation, studentId],
  )

  return {
    emergencyContacts: {
      data: agents?.map(mapAgent),
      loading: agentsQuery.loading,
      error: toMmsError(agentsQuery.error),
    },
    languageProfile: {
      data: languageProfileData
        ? mapLanguageProfile(languageProfileData)
        : undefined,
      loading: languageQuery.loading,
      error: toMmsError(languageQuery.error),
    },
    healthProfile: {
      data: healthProfileData ? mapHealthProfile(healthProfileData) : undefined,
      loading: healthQuery.loading,
      error: toMmsError(healthQuery.error),
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
