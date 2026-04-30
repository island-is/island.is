import { Box, Button, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { GetUnemploymentApplicationOverviewQuery } from '../Status/Status.generated'

type AvailableActions =
  GetUnemploymentApplicationOverviewQuery['vmstApplicationsUnemploymentApplicationOverview']['availableActions']

interface ActionButtonsProps {
  availableActions?: AvailableActions
  loading?: boolean
}

export const ActionButtons = ({
  availableActions,
  loading,
}: ActionButtonsProps) => {
  const { formatMessage } = useLocale()

  const showContactButton = availableActions?.canContact === true
  const dropdownActions = [
    {
      title: formatMessage(um.statusSubmitDocuments),
      href: formatMessage(um.statusSubmitDocumentsUrl),
      visible: availableActions?.canSubmitDocuments === true,
    },
    {
      title: formatMessage(um.statusReportIncome),
      href: formatMessage(um.statusReportIncomeUrl),
      visible: availableActions?.canReportWork === true,
    },
    {
      title: formatMessage(um.statusReportTravel),
      href: formatMessage(um.statusReportTravelUrl),
      visible: availableActions?.canReportTravel === true,
    },
    {
      title: formatMessage(um.statusUnsubscribe),
      href: formatMessage(um.statusUnsubscribeUrl),
      visible: availableActions?.canUnregister === true,
    },
  ].filter((b) => b.visible)

  if (loading || (!showContactButton && dropdownActions.length === 0)) {
    return null
  }

  return (
    <Box display="flex" columnGap={2} alignItems="center" marginBottom={4}>
      {showContactButton && (
        <a
          href={formatMessage(um.statusContactUsUrl)}
          target="_blank"
          rel="noreferrer"
        >
          <Button
            as="span"
            unfocusable
            variant="utility"
            size="small"
            icon="open"
            iconType="outline"
          >
            {formatMessage(um.statusContactUs)}
          </Button>
        </a>
      )}
      {dropdownActions.length > 0 && (
        <DropdownMenu
          icon="ellipsisVertical"
          menuLabel={formatMessage(um.statusMoreActions)}
          title={formatMessage(um.statusMoreActions)}
          items={dropdownActions}
        />
      )}
    </Box>
  )
}
