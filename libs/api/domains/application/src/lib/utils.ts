import {
  institutionMapper,
  ApplicationConfigurations,
} from '@island.is/application/types'
import {
  ApplicationAdmin,
  ApplicationInstitution,
  ApplicationStatistics,
} from './application.model'
import { ApplicationCard } from './applicationV2.model'
import {
  ApplicationTypeAdmin,
  ApplicationResponseDto as AppSystemCardDto,
} from '../../gen/fetch'
import {
  MyPagesApplicationResponseDto as FormSystemCardDto,
  ApplicationAdminDto as FormSystemApplicationAdminDto,
  ApplicationTypeDto,
  InstitutionDto,
  ApplicationStatisticsDto,
} from '@island.is/clients/form-system'
import { ApplicationResponseDtoStatusEnum } from '../../gen/fetch/models/ApplicationResponseDto'
import { ApplicationListAdminResponseDtoStatusEnum } from '../../gen/fetch/models/ApplicationListAdminResponseDto'

export const mapAppSystemCards = (
  application: AppSystemCardDto,
): ApplicationCard => {
  return {
    id: application.id,
    created: application.created,
    modified: application.modified,
    typeId: application.typeId,
    status: application.status,
    name: application.name,
    progress: application.progress,
    slug: ApplicationConfigurations[application.typeId]?.slug,
    org: institutionMapper[application.typeId].slug,
    applicationPath: `umsoknir/${
      ApplicationConfigurations[application.typeId]?.slug
    }/${application.id}`,
    orgContentfulId: institutionMapper[application.typeId].contentfulId,
    nationalId: institutionMapper[application.typeId].nationalId,
    actionCard: application.actionCard,
  }
}

export const mapFormSystemCards = (
  application: FormSystemCardDto,
): ApplicationCard => {
  return {
    id: application.id,
    created: application.created,
    modified: application.modified,
    typeId: application.typeId,
    status: application.status as ApplicationResponseDtoStatusEnum,
    name: application.name,
    progress: application.progress,
    slug: application.formSystemFormSlug,
    org: application.formSystemOrgSlug,
    applicationPath: `form/${application.formSystemFormSlug}/${application.id}`,
    orgContentfulId: application.formSystemOrgContentfulId,
    nationalId: undefined, // TODO: add nationalId if possible
    actionCard: application.actionCard,
  }
}

export const cardSortByModified = (
  a: ApplicationCard,
  b: ApplicationCard,
): number => {
  return b.modified.getTime() - a.modified.getTime()
}

export const applicationAdminSortByCreated = (
  a: ApplicationAdmin,
  b: ApplicationAdmin,
): number => {
  const createdDiff = b.created.getTime() - a.created.getTime()
  if (createdDiff !== 0) {
    return createdDiff
  }

  return a.id.localeCompare(b.id)
}

export const mapFormSystemApplicationAdmin = (
  application: FormSystemApplicationAdminDto,
): ApplicationAdmin => {
  return {
    ...application,
    assignees: [],
    applicantActors: [],
    state: application.status,
    status: application.status as ApplicationListAdminResponseDtoStatusEnum,
    isFormSystem: true,
    typeId: application.formId,
    name: application.formName,
    institution: application.institutionName,
    progress: undefined,
    paymentStatus: undefined,
    adminData: undefined,
  }
}

export const mapFormSystemApplicationTypeAdmin = (
  type: ApplicationTypeDto,
): ApplicationTypeAdmin => {
  return {
    id: type.id,
    name: type.name ?? '',
  }
}

export const mapFormSystemInstitutionAdmin = (
  institution: InstitutionDto,
): ApplicationInstitution => {
  return {
    nationalId: institution.nationalId,
    contentfulSlug: institution.contentfulSlug ?? '',
  }
}

export const mapFormSystemStatisticsAdmin = (
  statistics: ApplicationStatisticsDto,
): ApplicationStatistics => {
  return {
    typeid: statistics.formId,
    name: statistics.formName ?? '',
    count: statistics.totalCount,
    draft: 0,
    inprogress: statistics.inProgressCount,
    completed: statistics.completedCount,
    rejected: 0,
    approved: 0,
  }
}
