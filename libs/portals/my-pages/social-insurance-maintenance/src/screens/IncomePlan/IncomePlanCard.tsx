import {
  SocialInsuranceIncomePlan,
  SocialInsuranceIncomePlanStatus,
} from '@island.is/api/schema'
import { FormatMessage, useLocale } from '@island.is/localization'
import {
  ActionCard,
  formatDate,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { Status } from './types'
import { SocialInsuranceMaintenancePaths } from '../../lib/paths'

interface Props {
  status: Status
  registrationDate?: string
}

export const IncomePlanCard = ({ status, registrationDate }: Props) => {
  const { formatMessage } = useLocale()

  const parseSubtext = (
    tag: SocialInsuranceIncomePlanStatus,
    date: Date,
    formatMessage: FormatMessage,
  ) => {
    switch (tag) {
      case SocialInsuranceIncomePlanStatus.ACCEPTED:
        return `${formatMessage(coreMessages.approved)}: ${formatDate(date)}`
      case SocialInsuranceIncomePlanStatus.IN_PROGRESS:
        return `${formatMessage(m.receivedInProgress)}: ${formatDate(date)}`
      case SocialInsuranceIncomePlanStatus.CANCELLED:
        return `${formatMessage(coreMessages.rejected)}: ${formatDate(date)}`
      default:
        return
    }
  }

  switch (status) {
    case 'in_progress': {
      return (
        <ActionCard
          image={{
            type: 'image',
            url: './assets/images/tr.svg',
          }}
          text={formatMessage(m.applicationInProgress)}
          headingColor="currentColor"
          heading={formatMessage(coreMessages.incomePlan)}
          backgroundColor="blue"
          borderColor="blue200"
          cta={{
            label: formatMessage(m.continueApplication),
            url: `${document.location.origin}/${formatMessage(
              m.incomePlanModifyLink,
            )}`,
            variant: 'primary',
            size: 'medium',
            icon: 'open',
            centered: true,
          }}
        />
      )
    }
    case 'accepted_no_changes':
    case 'accepted': {
      return (
        <ActionCard
          image={{
            type: 'image',
            url: './assets/images/tr.svg',
          }}
          text={
            registrationDate
              ? parseSubtext(
                  SocialInsuranceIncomePlanStatus.ACCEPTED,
                  new Date(registrationDate),
                  formatMessage,
                )
              : undefined
          }
          headingColor="currentColor"
          heading={formatMessage(coreMessages.incomePlan)}
          backgroundColor="blue"
          borderColor="blue200"
          cta={{
            label: formatMessage(m.viewIncomePlan),
            url: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
            variant: 'text',
          }}
        />
      )
    }
    case 'in_review': {
      return (
        <ActionCard
          image={{
            type: 'image',
            url: './assets/images/tr.svg',
          }}
          text={formatMessage(m.applicationInReview)}
          headingColor="currentColor"
          heading={formatMessage(coreMessages.incomePlan)}
          backgroundColor="blue"
          borderColor="blue200"
          cta={{
            label: formatMessage(m.modifyIncomePlan),
            disabled: true,
            variant: 'primary',
            size: 'medium',
            icon: 'open',
            iconType: 'outline',
            centered: true,
          }}
        />
      )
    }
    default:
      return (
        <ActionCard
          image={{
            type: 'image',
            url: './assets/images/tr.svg',
          }}
          text={formatMessage(m.noActiveIncomePlan)}
          headingColor="currentColor"
          heading={formatMessage(coreMessages.incomePlan)}
          backgroundColor="blue"
          borderColor="blue200"
          cta={{
            label: formatMessage(m.submitIncomePlan),
            url: `${document.location.origin}/${formatMessage(
              m.incomePlanModifyLink,
            )}`,
            variant: 'primary',
            size: 'medium',
            icon: 'open',
            centered: true,
          }}
        />
      )
  }
}
