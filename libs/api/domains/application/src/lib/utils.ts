import {
  institutionMapper,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { ApplicationAdmin } from './application.model'
import { ApplicationCard } from './applicationV2.model'
import { ApplicationResponseDto as AppSystemCardDto } from '../../gen/fetch'
import {
  MyPagesApplicationResponseDto as FormSystemCardDto,
  ApplicationDto as FormSystemApplicationDto,
} from '@island.is/clients/form-system'
import { ApplicationResponseDtoStatusEnum } from '../../gen/fetch/models/ApplicationResponseDto'
import {
  ApplicationListAdminResponseDtoTypeIdEnum,
  ApplicationListAdminResponseDtoStatusEnum,
} from '../../gen/fetch/models/ApplicationListAdminResponseDto'

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

export const mapFormSystemApplicationAdmin = (
  application: FormSystemApplicationDto,
): ApplicationAdmin => {
  return {
    id: application.id ?? '',
    created: application.created ?? new Date(),
    modified: application.modified ?? new Date(),
    applicant: 'TODO',
    assignees: [], //TODO
    applicantActors: [], //TODO
    state: 'TODO',
    typeId:
      'ExampleAuthDelegation' as ApplicationListAdminResponseDtoTypeIdEnum, //TODO
    status: application.status as ApplicationListAdminResponseDtoStatusEnum,
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
