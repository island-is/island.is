import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { VmstApplicationsAvailableActions } from '@island.is/portals/my-pages/graphql'
import { LinkButton, useIsMobile } from '@island.is/portals/my-pages/core'

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
  const { isMobile } = useIsMobile()
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

  const contactButton = showContactButton && (
    <LinkButton
      key="contact"
      to={formatMessage(um.statusContactUsUrl)}
      text={formatMessage(um.statusContactUs)}
      icon="open"
      variant="utility"
      size="small"
    />
  )
  const submitDocumentsButton = showSubmitDocumentsButton && (
    <LinkButton
      key="submitDocuments"
      to={formatMessage(um.statusSubmitDocumentsUrl)}
      text={formatMessage(um.statusSubmitDocuments)}
      icon="documents"
      variant="utility"
      size="small"
    />
  )
  const reportIncomeButton = showReportIncomeButton && (
    <LinkButton
      key="reportIncome"
      to={formatMessage(um.statusReportIncomeUrl)}
      text={formatMessage(um.statusReportIncome)}
      icon="wallet"
      variant="utility"
      size="small"
    />
  )
  const reportTravelButton = showReportTravelButton && (
    <LinkButton
      key="reportTravel"
      to={formatMessage(um.statusReportTravelUrl)}
      text={formatMessage(um.statusReportTravel)}
      icon="airplane"
      variant="utility"
      size="small"
    />
  )
  const unsubscribeButton = showUnsubscribeButton && (
    <LinkButton
      key="unsubscribe"
      to={formatMessage(um.statusUnsubscribeUrl)}
      text={formatMessage(um.statusUnsubscribe)}
      icon="logOut"
      variant="utility"
      size="small"
    />
  )

  const orderedButtons = isMobile
    ? [
        contactButton,
        submitDocumentsButton,
        reportIncomeButton,
        unsubscribeButton,
        reportTravelButton,
      ]
    : [
        contactButton,
        submitDocumentsButton,
        reportIncomeButton,
        reportTravelButton,
        unsubscribeButton,
      ]

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      columnGap={2}
      rowGap={2}
      alignItems="center"
      marginBottom={4}
    >
      {orderedButtons}
    </Box>
  )
}
