import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  downloadLink,
  IntroWrapper,
  LinkButton,
  SJUKRATRYGGINGAR_SLUG,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { useEffect, useState } from 'react'
import { messages } from '../../../lib/messages'
import { healthNavigation } from '../../../lib/navigation'
import { useGetInsuranceConfirmationLazyQuery } from '../Payments.generated'

type Props = {
  children: React.ReactNode
  pathname?: string
}

export const PaymentsWrapper = ({ children, pathname }: Props) => {
  const { formatMessage } = useLocale()
  const [displayConfirmationErrorAlert, setDisplayConfirmationErrorAlert] =
    useState(false)

  const [
    getInsuranceConfirmationLazyQuery,
    { loading: confirmationLoading, error: confirmationError },
  ] = useGetInsuranceConfirmationLazyQuery()

  const getInsuranceConfirmation = async () => {
    const { data: fetchedData } = await getInsuranceConfirmationLazyQuery()
    const downloadData = fetchedData?.rightsPortalInsuranceConfirmation

    if (downloadData?.data && downloadData.fileName) {
      downloadLink(downloadData.data, 'application/pdf', downloadData.fileName)
    }
  }

  useEffect(() => {
    if (confirmationError) {
      setDisplayConfirmationErrorAlert(true)
    }
  }, [confirmationError])

  return (
    <IntroWrapper
      marginBottom={5}
      title={formatMessage(messages.paymentsAndRights)}
      intro={formatMessage(messages.paymentsIntro)}
      serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
      serviceProviderTooltip={formatMessage(messages.healthTooltip)}
      buttonGroup={[
        <Button
          variant="utility"
          disabled={displayConfirmationErrorAlert}
          size="small"
          icon="fileTrayFull"
          loading={confirmationLoading}
          iconType="outline"
          onClick={() => getInsuranceConfirmation()}
        >
          {formatMessage(messages.healthInsuranceConfirmation)}
        </Button>,
      ]}
    >
      {displayConfirmationErrorAlert && (
        <Box marginBottom={4}>
          <AlertMessage
            type="error"
            title={formatMessage(messages.healthErrorTitle)}
            message={formatMessage(messages.healthInternalServiceErrorTitle)}
          />
        </Box>
      )}
      <TabNavigation
        label={formatMessage(messages.payments)}
        pathname={pathname}
        items={
          healthNavigation.children?.find(
            (itm) => itm.name === messages.paymentsAndRights,
          )?.children ?? []
        }
      />

      <Box paddingY={4} background="white">
        {children}
        <Box marginTop={4}>
          <LinkButton
            to={formatMessage(
              messages.readAboutPaymentParticipationSystemsLink,
            )}
            text={formatMessage(messages.readAboutPaymentParticipationSystems)}
            variant="text"
          />
        </Box>
      </Box>
    </IntroWrapper>
  )
}
