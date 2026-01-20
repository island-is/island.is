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
import { ApplicationFilters, MultiChoiceFilter } from '../types/filters'
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

export const getFilteredApplications = (
  applications: AdminApplication[],
  {
    multiChoiceFilters,
    institutionFilters,
    period,
  }: {
    multiChoiceFilters: Record<MultiChoiceFilter, string[] | undefined>
    institutionFilters?: string[]
    period?: ApplicationFilters['period']
  },
) => {
  let filteredApplications = applications
  const multiChoiceStatus = multiChoiceFilters[MultiChoiceFilter.STATUS]
  const multiChoiceApplication =
    multiChoiceFilters[MultiChoiceFilter.APPLICATION]

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
  if (multiChoiceApplication) {
    filteredApplications = filteredApplications.filter(
      (x) => !!x.name && multiChoiceApplication.includes(x.name),
    )
  }
  if (multiChoiceStatus) {
    filteredApplications = filteredApplications.filter((x) =>
      multiChoiceStatus.includes(x.status),
    )
  }
  if (institutionFilters) {
    filteredApplications = filteredApplications.filter((x) =>
      institutionFilters.includes(x.typeId),
    )
  }

  return filteredApplications
}
