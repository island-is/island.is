import {
  ActionCardTag,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { Organization } from '@island.is/shared/types'
import { m } from '../lib/messages'
import { institutionMapper } from '@island.is/application/types'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { ApplicationListAdminResponseDtoTypeIdEnum } from '@island.is/api/schema'

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
  const institutionSlug = institutionMapper[typeId]
  const institution = organizations.find((x) => x.slug === institutionSlug)
  return getOrganizationLogoUrl(
    institution?.title ?? 'stafraent-island',
    organizations,
  )
}
