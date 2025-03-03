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

  const baseActionCard = (text: string) => {
    return (
      <ActionCard
        image={{
          type: 'image',
          url: './assets/images/tr.svg',
        }}
        text={text}
        headingColor="currentColor"
        heading={formatMessage(coreMessages.incomePlan)}
        backgroundColor="blue"
        borderColor="blue200"
        cta={{
          label: '',
        }}
      />
    )
  }
  const parseSubtext = (
    status: Status,
    date: Date,
    formatMessage: FormatMessage,
  ) => {
    switch (status) {
      case 'modify_accepted':
      case 'accepted':
      case 'accepted_no_changes':
        return `${formatMessage(coreMessages.approved)}: ${formatDate(date)}`
      default:
        return
    }
  }

  switch (status) {
    case 'modify_accepted':
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
    case 'in_progress': {
      return baseActionCard(formatMessage(m.applicationInProgress))
    }
    case 'in_review': {
      return baseActionCard(formatMessage(m.applicationInReview))
    }
    case 'no_data': {
      return baseActionCard(formatMessage(m.noActiveIncomePlan))
    }
  }
}
