import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  downloadLink,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  m,
  SJUKRATRYGGINGAR_SLUG,
} from '@island.is/portals/my-pages/core'
import React, { useEffect, useState } from 'react'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetInsuranceConfirmationLazyQuery } from './HealthInsurance.generated'

const HealthInsurance: React.FC = () => {
  const { formatMessage } = useLocale()

  // TODO FIX SCREEN
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
      title={formatMessage(messages.hasHealthInsurance)}
      intro={formatMessage(messages.hasHealthInsuranceIntro)}
      serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
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
      <InfoLineStack space={1} label={formatMessage(m.baseInfo)}>
        <InfoLine
          label={formatMessage(messages.healthCenter)}
          content={'DATA'}
          loading={false}
          button={{
            to: HealthPaths.HealthCenter,
            label: formatMessage(messages.seeMore),
            type: 'link',
            icon: 'arrowForward',
          }}
        />
        <InfoLine
          label={formatMessage(messages.healthInsuranceStatus)}
          content={'DATA 2'}
          loading={false}
        />
      </InfoLineStack>
    </IntroWrapper>
  )
}

export default HealthInsurance
