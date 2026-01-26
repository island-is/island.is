import {
  ActionCardTag,
  ApplicationConfigurations,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { Organization } from '@island.is/shared/types'
import { m } from '../lib/messages'
import { institutionMapper } from '@island.is/application/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { ApplicationListAdminResponseDtoTypeIdEnum } from '@island.is/api/schema'
import { ApplicationFilters } from '../types/filters'
import { AdminApplication } from '../types/adminApplication'
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'

interface Tag {
  variant: ActionCardTag
  label: MessageDescriptor
}

export const statusMapper: Record<ApplicationStatus, Tag> = {
  [ApplicationStatus.APPROVED]: {
    variant: 'mint',
    label: m.tagsApproved,
  },
  [ApplicationStatus.REJECTED]: {
    variant: 'red',
    label: m.tagsRejected,
  },
  [ApplicationStatus.IN_PROGRESS]: {
    variant: 'blueberry',
    label: m.tagsInProgress,
  },
  [ApplicationStatus.COMPLETED]: {
    variant: 'mint',
    label: m.tagsDone,
  },
  [ApplicationStatus.DRAFT]: {
    variant: 'blue',
    label: m.tagsDraft,
  },
  [ApplicationStatus.NOT_STARTED]: {
    variant: 'blueberry',
    label: m.newApplication,
  },
}

export const getLogo = (
  typeId: ApplicationListAdminResponseDtoTypeIdEnum,
  organizations: Organization[],
): string => {
  const institutionSlug = institutionMapper[typeId].slug
  const institution = organizations.find((x) => x.slug === institutionSlug)
  return getOrganizationLogoUrl(
    institution?.title ?? 'stafraent-island',
    organizations,
  )
}

export const getSlugFromType = (type: ApplicationTypes) => {
  for (const [key, value] of Object.entries(ApplicationConfigurations)) {
    if (type === key) {
      return value.slug
    }
  }

  return undefined
}

export const getBaseUrlForm = () => {
  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  return isLocalhost ? 'http://localhost:4242/umsoknir' : `${path}/umsoknir`
}

export const getFilteredApplications = (
  applications: AdminApplication[],
  {
    institutionFilters,
    period,
    nationalId,
  }: {
    institutionFilters?: string[]
    period?: ApplicationFilters['period']
    nationalId: ApplicationFilters['nationalId']
  },
) => {
  let filteredApplications = applications

  if (period?.from) {
    const { from } = period
    filteredApplications = filteredApplications.filter(
      (x) => new Date(x.created) > startOfDay(from),
    )
  }
  if (period?.to) {
    const { to } = period
    filteredApplications = filteredApplications.filter(
      (x) => endOfDay(to) > new Date(x.created),
    )
  }
  if (nationalId) {
    filteredApplications = filteredApplications.filter(
      (x) => x.applicant === nationalId,
    )
  }
  if (institutionFilters) {
    filteredApplications = filteredApplications.filter((x) =>
      institutionFilters.includes(x.typeId),
    )
  }

  return filteredApplications
}
