import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'

import {
  mockAgentRelationTypes,
  mockAllergies,
  mockChildAgents,
  mockChildren,
  mockHealthProfile,
  mockLanguageEnvironments,
  mockLanguageProfile,
  mockMyContact,
  MOCK_HEALTH_EDIT_ENABLED,
} from './keyInfo.mock'
import type {
  AgentRelationTypeDto,
  AllergyDto,
  ChildAgentCreateDto,
  ChildAgentDto,
  ChildAgentUpdateDto,
  ChildDto,
  HealthProfileDto,
  HealthProfileUpdateDto,
  LanguageEnvironmentDto,
  LanguageProfileDto,
  LanguageProfileUpdateDto,
  MyContactDto,
  MyContactUpdateDto,
} from './keyInfo.types'

/**
 * Client for the MMS nemendagrunnur "Lykilupplýsingar" endpoints (contract
 * v0.2, §4). Every method is the exact seam that will call the generated
 * gen/fetch function once the client is connected — for now each returns the
 * mocked contract payload.
 *
 * TODO(MMS v0.2 / connect-the-client): replace each mocked body with the
 * generated call, e.g.
 *
 *     return withAuthContext(user, () =>
 *       dataOr404Null(getMeChildrenByChildIdAgents({ path: { childId } })),
 *     ) ?? []
 *
 * The signatures here already match what the education GraphQL resolver expects,
 * so nothing above this file changes when the swap happens. `whenHealthEditEnabled`
 * below is the only feature-gate mock: §8 keeps the health PATCH closed for now.
 */
@Injectable()
export class PrimarySchoolKeyInfoClientService {
  /* -- 4.1 Lookup lists (no guardianship check) ---------------------------- */

  async getAgentRelationTypes(_user: User): Promise<AgentRelationTypeDto[]> {
    // TODO: withAuthContext(user, () => dataOr404Null(getAgentRelationTypes()))
    return mockAgentRelationTypes
  }

  async getAllergies(_user: User): Promise<AllergyDto[]> {
    // TODO: withAuthContext(user, () => dataOr404Null(getAllergies()))
    return mockAllergies
  }

  async getLanguageEnvironments(
    _user: User,
  ): Promise<LanguageEnvironmentDto[]> {
    // TODO: withAuthContext(user, () => dataOr404Null(getLanguageEnvironments()))
    return mockLanguageEnvironments
  }

  /* -- 4.2 Own contact ----------------------------------------------------- */

  async getMyContact(_user: User): Promise<MyContactDto> {
    return mockMyContact
  }

  async updateMyContact(
    _user: User,
    input: MyContactUpdateDto,
  ): Promise<MyContactDto> {
    return { ...mockMyContact, ...input, updatedAt: new Date().toISOString() }
  }

  /* -- 4.3 Children -------------------------------------------------------- */

  async getMyChildren(_user: User): Promise<ChildDto[]> {
    return mockChildren
  }

  /* -- 4.4 Emergency contacts (agents) ------------------------------------- */

  async getChildAgents(
    _user: User,
    _childId: string,
  ): Promise<ChildAgentDto[]> {
    // TODO: getMeChildrenByChildIdAgents({ path: { childId } })
    return mockChildAgents
  }

  async addChildAgent(
    _user: User,
    _childId: string,
    input: ChildAgentCreateDto,
  ): Promise<ChildAgentDto> {
    // TODO: postMeChildrenByChildIdAgents({ path: { childId }, body: input })
    // Real errors to expect: 422 PERSON_NOT_FOUND, 409 AGENT_EXISTS,
    // 422 IS_GUARDIAN (surfaced as GraphQL errors by the resolver).
    const relationType =
      mockAgentRelationTypes.find((t) => t.id === input.relationTypeId) ??
      mockAgentRelationTypes[0]
    return {
      id: `mock-${Date.now()}`,
      person: { nationalId: input.nationalId, name: 'Nýr aðstandandi' },
      relationType: { id: relationType.id, title: relationType.title },
      createdBy: {
        kind: 'guardian',
        displayName: 'Þú',
        at: new Date().toISOString(),
      },
      canEdit: true,
    }
  }

  async updateChildAgent(
    _user: User,
    _childId: string,
    agentId: string,
    input: ChildAgentUpdateDto,
  ): Promise<ChildAgentDto> {
    // TODO: patchMeChildrenByChildIdAgentsByAgentId(...) — 403 NOT_EDITABLE if canEdit=false
    const existing =
      mockChildAgents.find((a) => a.id === agentId) ?? mockChildAgents[0]
    const relationType =
      mockAgentRelationTypes.find((t) => t.id === input.relationTypeId) ??
      existing.relationType
    return {
      ...existing,
      relationType: { id: relationType.id, title: relationType.title },
    }
  }

  async deleteChildAgent(
    _user: User,
    _childId: string,
    _agentId: string,
  ): Promise<boolean> {
    // TODO: deleteMeChildrenByChildIdAgentsByAgentId(...) — 403 NOT_EDITABLE if canEdit=false
    return true
  }

  /* -- 4.5 Health profile -------------------------------------------------- */

  async getChildHealthProfile(
    _user: User,
    _childId: string,
  ): Promise<HealthProfileDto> {
    return mockHealthProfile
  }

  /** §8: MMS has not opened this PATCH yet. Until it does the real endpoint
   * answers 403 FEATURE_DISABLED — this flag mirrors that state for the seam. */
  healthEditEnabled(): boolean {
    return MOCK_HEALTH_EDIT_ENABLED
  }

  async updateChildHealthProfile(
    _user: User,
    _childId: string,
    input: HealthProfileUpdateDto,
  ): Promise<HealthProfileDto> {
    // TODO: patchMeChildrenByChildIdHealthProfile(...) — 403 FEATURE_DISABLED until §8
    const allergies = mockAllergies.filter((a) =>
      input.allergies.includes(a.id),
    )
    return {
      ...mockHealthProfile,
      epipen: input.epipen,
      medicalDiagnoses: input.medicalDiagnoses,
      medicationAssistance: input.medicationAssistance,
      allergies,
      updatedAt: new Date().toISOString(),
    }
  }

  /* -- 4.6 Language profile ------------------------------------------------ */

  async getChildLanguageProfile(
    _user: User,
    _childId: string,
  ): Promise<LanguageProfileDto> {
    return mockLanguageProfile
  }

  async updateChildLanguageProfile(
    _user: User,
    _childId: string,
    input: LanguageProfileUpdateDto,
  ): Promise<LanguageProfileDto> {
    // TODO: patchMeChildrenByChildIdLanguageProfile(...)
    const languageEnvironment =
      mockLanguageEnvironments.find(
        (e) => e.id === input.languageEnvironmentId,
      ) ?? mockLanguageProfile.languageEnvironment
    return {
      ...mockLanguageProfile,
      languageEnvironment,
      preferredLanguage: input.preferredLanguage,
      languages: input.languages,
      interpreter: input.interpreter,
      signLanguage: input.signLanguage,
      updatedAt: new Date().toISOString(),
    }
  }
}
