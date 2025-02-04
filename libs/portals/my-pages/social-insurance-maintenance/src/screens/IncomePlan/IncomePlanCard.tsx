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
  applicationStatus: Status
  incomePlanStatus?: SocialInsuranceIncomePlanStatus
  incomePlanRegistrationDate?: string
  incomePlanEligibleForChange?: boolean
}

export const IncomePlanCard = ({
  applicationStatus,
  incomePlanStatus,
  incomePlanRegistrationDate,
  incomePlanEligibleForChange,
}: Props) => {
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

  switch (applicationStatus) {
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
    case 'accepted': {
      if (incomePlanEligibleForChange) {
        return (
          <ActionCard
            image={{
              type: 'image',
              url: './assets/images/tr.svg',
            }}
            text={
              incomePlanStatus && incomePlanRegistrationDate
                ? parseSubtext(
                    incomePlanStatus,
                    new Date(incomePlanRegistrationDate),
                    formatMessage,
                  )
                : undefined
            }
            heading={formatMessage(coreMessages.incomePlan)}
            cta={{
              label: formatMessage(m.viewIncomePlan),
              url:
                incomePlanStatus === SocialInsuranceIncomePlanStatus.IN_PROGRESS
                  ? `${document.location.origin}/${formatMessage(
                      m.incomePlanModifyLink,
                    )}`
                  : SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
              variant: 'text',
            }}
          />
        )
      }

      return (
        <ActionCard
          image={{
            type: 'image',
            url: './assets/images/tr.svg',
          }}
          text={formatMessage(m.applicationAccepted)}
          headingColor="currentColor"
          heading={formatMessage(coreMessages.incomePlan)}
          backgroundColor="blue"
          borderColor="blue200"
          cta={{
            label: formatMessage(m.continueApplication),
            url: `${document.location.origin}/${formatMessage(
              m.incomePlanModifyLink,
            )}`,
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
    case 'rejected': {
      return (
        <ActionCard
          image={{
            type: 'image',
            url: './assets/images/tr.svg',
          }}
          text={formatMessage(m.applicationRejected)}
          headingColor="currentColor"
          heading={formatMessage(coreMessages.incomePlan)}
          backgroundColor="blue"
          borderColor="blue200"
          cta={{
            label: formatMessage(m.modifyIncomePlan),
            url: `${document.location.origin}/${formatMessage(
              m.incomePlanModifyLink,
            )}`,
            disabled: true,
            variant: 'primary',
            size: 'medium',
            icon: 'open',
            centered: true,
          }}
        />
      )
    }
    default: {
      ;<p>be</p>
    }
  }

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
