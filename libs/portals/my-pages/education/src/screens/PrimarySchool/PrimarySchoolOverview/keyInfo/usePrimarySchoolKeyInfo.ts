import { useCallback } from 'react'
import type { ApolloError } from '@apollo/client'
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
import type {
  EmergencyContact,
  EmergencyContactCreateInput,
  EmergencyContactUpdateInput,
  HealthProfile,
  HealthProfileUpdateInput,
  LanguageProfile,
  LanguageProfileUpdateInput,
  MmsError,
} from './types'

/**
 * Data hook for the primary-school key-information sections (Aðstandendur,
 * Tungumálaumhverfi, Heilsufarsupplýsingar). It runs the education GraphQL
 * queries/mutations and maps the (locale-neutral) GraphQL shapes onto the
 * section view models in ./types.
 *
 * The backend currently answers from mocked MMS payloads — see
 * libs/clients/mms/primary-school. Connecting the X-Road client there is the
 * only remaining step; nothing in this hook or the section components changes.
 */

interface LocalizedTitle {
  is: string
  en: string
}

interface SectionState<T> {
  data: T | undefined
  loading: boolean
  error: MmsError | undefined
}

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

/** ApolloError → MmsError, preserving the MMS requestId so a failure can be
 * traced (ticket §5). */
const toMmsError = (error: ApolloError | undefined): MmsError | undefined => {
  if (!error) return undefined
  const extensions = error.graphQLErrors?.[0]?.extensions as
    | { code?: string; requestId?: string }
    | undefined
  return {
    code: extensions?.code,
    message: error.message,
    requestId: extensions?.requestId,
  }
}

export const usePrimarySchoolKeyInfo = (
  studentId?: string,
): PrimarySchoolKeyInfo => {
  const { lang } = useLocale()
  const childId = studentId ?? ''
  const skip = !childId

  const localize = (title: LocalizedTitle | undefined | null) =>
    title ? (lang === 'en' ? title.en : title.is) : undefined

  const agentsQuery = usePrimarySchoolAgentsQuery({
    variables: { childId },
    skip,
  })
  const languageQuery = usePrimarySchoolLanguageProfileQuery({
    variables: { childId },
    skip,
  })
  const healthQuery = usePrimarySchoolHealthProfileQuery({
    variables: { childId },
    skip,
  })

  const refetchQueries = [
    { query: PrimarySchoolAgentsDocument, variables: { childId } },
  ]
  const refetchLanguage = [
    { query: PrimarySchoolLanguageProfileDocument, variables: { childId } },
  ]
  const refetchHealth = [
    { query: PrimarySchoolHealthProfileDocument, variables: { childId } },
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

  const mapAgent = (agent: PrimarySchoolAgentFieldsFragment): EmergencyContact => ({
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

  const agents = agentsQuery.data?.primarySchoolAgents
  const languageProfileData = languageQuery.data?.primarySchoolLanguageProfile
  const healthProfileData = healthQuery.data?.primarySchoolHealthProfile

  const addAgent = useCallback(
    async (input: EmergencyContactCreateInput) => {
      await addAgentMutation({
        variables: {
          input: {
            childId,
            nationalId: input.nationalId,
            relationTypeId: input.relationTypeId,
          },
        },
      })
    },
    [addAgentMutation, childId],
  )

  const updateAgent = useCallback(
    async (agentId: string, input: EmergencyContactUpdateInput) => {
      await updateAgentMutation({
        variables: {
          input: { childId, agentId, relationTypeId: input.relationTypeId },
        },
      })
    },
    [updateAgentMutation, childId],
  )

  const removeAgent = useCallback(
    async (agentId: string) => {
      await deleteAgentMutation({ variables: { input: { childId, agentId } } })
    },
    [deleteAgentMutation, childId],
  )

  const saveLanguageProfile = useCallback(
    async (input: LanguageProfileUpdateInput) => {
      await updateLanguageMutation({
        variables: {
          input: {
            childId,
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
    [updateLanguageMutation, childId],
  )

  const saveHealthProfile = useCallback(
    async (input: HealthProfileUpdateInput) => {
      await updateHealthMutation({
        variables: {
          input: {
            childId,
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
    [updateHealthMutation, childId],
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
      data: healthProfileData
        ? mapHealthProfile(healthProfileData)
        : undefined,
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
