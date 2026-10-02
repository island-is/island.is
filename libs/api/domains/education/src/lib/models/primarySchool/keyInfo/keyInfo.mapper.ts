import type {
  AgentRelationTypeDto,
  AllergyDto,
  ChildAgentDto,
  HealthProfileDto,
  LanguageEnvironmentDto,
  LanguageProfileDto,
} from '@island.is/clients/mms/primary-school'
import { PrimarySchoolAgent } from './agent.model'
import { Allergy, LanguageEnvironment, RelationType } from './lookups.model'
import { HealthProfile, LanguageProfile } from './profiles.model'

export const mapRelationType = (dto: AgentRelationTypeDto): RelationType => ({
  id: dto.id,
  relation: dto.relation,
  title: dto.title,
})

export const mapAllergy = (dto: AllergyDto): Allergy => ({
  id: dto.id,
  code: dto.code,
  type: dto.type,
  title: dto.title,
})

export const mapLanguageEnvironment = (
  dto: LanguageEnvironmentDto,
): LanguageEnvironment => ({
  id: dto.id,
  code: dto.code,
  title: dto.title,
})

export const mapAgent = (dto: ChildAgentDto): PrimarySchoolAgent => ({
  id: dto.id,
  person: { nationalId: dto.person.nationalId, name: dto.person.name },
  relationType: { id: dto.relationType.id, title: dto.relationType.title },
  createdBy: {
    kind: dto.createdBy.kind,
    displayName: dto.createdBy.displayName ?? undefined,
    at: dto.createdBy.at,
  },
  canEdit: dto.canEdit,
})

export const mapHealthProfile = (
  dto: HealthProfileDto,
  canEdit: boolean,
): HealthProfile => ({
  epipen: dto.epipen,
  medicalDiagnoses: dto.medicalDiagnoses,
  medicationAssistance: dto.medicationAssistance,
  allergies: dto.allergies.map(mapAllergy),
  updatedAt: dto.updatedAt,
  updatedBy: {
    kind: dto.updatedBy.kind,
    displayName: dto.updatedBy.displayName ?? undefined,
  },
  canEdit,
})

export const mapLanguageProfile = (
  dto: LanguageProfileDto,
): LanguageProfile => ({
  languageEnvironment: mapLanguageEnvironment(dto.languageEnvironment),
  preferredLanguage: dto.preferredLanguage ?? undefined,
  languages: dto.languages,
  interpreter: dto.interpreter,
  signLanguage: dto.signLanguage,
  updatedAt: dto.updatedAt,
  updatedBy: {
    kind: dto.updatedBy.kind,
    displayName: dto.updatedBy.displayName ?? undefined,
  },
})
