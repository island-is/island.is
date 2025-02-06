import { SocialInsuranceIncomePlanStatus } from '@island.is/api/schema'
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
    status: Status,
    date: Date,
    formatMessage: FormatMessage,
  ) => {
    switch (status) {
      case 'accepted':
      case 'accepted_no_changes':
        return `${formatMessage(coreMessages.approved)}: ${formatDate(date)}`
      case 'rejected':
      case 'rejected_no_changes':
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
    case 'rejected_no_changes':
    case 'rejected':
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
              ? parseSubtext(status, new Date(registrationDate), formatMessage)
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
    case 'no_data':
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
