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
import { AdminApplication } from '../types/adminApplication'

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
  }: {
    institutionFilters?: string[]
  },
) => {
  let filteredApplications = applications
  if (institutionFilters) {
    filteredApplications = filteredApplications.filter((x) =>
      institutionFilters.includes(x.typeId),
    )
  }

  return filteredApplications
}
