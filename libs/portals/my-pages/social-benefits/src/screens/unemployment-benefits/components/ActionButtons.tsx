import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { VmstApplicationsAvailableActions } from '@island.is/portals/my-pages/graphql'
import { LinkButton } from '@island.is/portals/my-pages/core'

interface ActionButtonsProps {
  availableActions?: VmstApplicationsAvailableActions
  loading?: boolean
}

export const ActionButtons = ({
  availableActions,
  loading,
}: ActionButtonsProps) => {
  const { formatMessage } = useLocale()
  useNamespaces('sp.social-benefits-unemployment')
  const showContactButton = availableActions?.canContact === true
  const showSubmitDocumentsButton =
    availableActions?.canSubmitDocuments === true
  const showReportIncomeButton = availableActions?.canReportWork === true
  const showReportTravelButton = availableActions?.canReportTravel === true
  const showUnsubscribeButton = availableActions?.canUnregister === true

  if (loading) {
    return null
  }

  if (
    !showContactButton &&
    !showSubmitDocumentsButton &&
    !showReportIncomeButton &&
    !showReportTravelButton &&
    !showUnsubscribeButton
  ) {
    return null
  }

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      columnGap={2}
      rowGap={2}
      alignItems="center"
      marginBottom={4}
    >
      {showContactButton && (
        <LinkButton
          to={formatMessage(um.statusContactUsUrl)}
          text={formatMessage(um.statusContactUs)}
          icon="open"
          variant="utility"
          size="small"
        />
      )}
      {showSubmitDocumentsButton && (
        <LinkButton
          to={formatMessage(um.statusSubmitDocumentsUrl)}
          text={formatMessage(um.statusSubmitDocuments)}
          icon="documents"
          variant="utility"
          size="small"
        />
      )}
      {showReportIncomeButton && (
        <LinkButton
          to={formatMessage(um.statusReportIncomeUrl)}
          text={formatMessage(um.statusReportIncome)}
          icon="wallet"
          variant="utility"
          size="small"
        />
      )}
      {showReportTravelButton && (
        <LinkButton
          to={formatMessage(um.statusReportTravelUrl)}
          text={formatMessage(um.statusReportTravel)}
          icon="airplane"
          variant="utility"
          size="small"
        />
      )}
      {showUnsubscribeButton && (
        <LinkButton
          to={formatMessage(um.statusUnsubscribeUrl)}
          text={formatMessage(um.statusUnsubscribe)}
          icon="logOut"
          variant="utility"
          size="small"
        />
      )}
    </Box>
  )
}
