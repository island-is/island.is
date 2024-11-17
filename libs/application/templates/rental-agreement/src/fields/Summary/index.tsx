import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import { CopyLink } from '@island.is/application/ui-components'
import { summaryWrap } from './summaryStyles.css'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { LandlordInfoSummary } from './LandlordInfoSummary'
import { TenantInfoSummary } from './TenantInfoSummary'
import { PropertyInfoSummary } from './PropertyInfoSummary'
import { OtherFeesSummary } from './OtherFeesSummary'
import { RentalInfoSummary } from './RentalInfoSummary'

export const Summary: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const answers = application.answers as RentalAgreement

  return (
    <Box className={summaryWrap}>
      <Box>
        <Text variant="h2" as="h2" marginBottom={3}>
          {formatMessage(summary.pageTitle)}
        </Text>
        <Text marginBottom={5}>{formatMessage(summary.pageDescription)}</Text>
      </Box>

      <RentalInfoSummary answers={answers} />

      <OtherFeesSummary answers={answers} />

      <PropertyInfoSummary answers={answers} />

      <TenantInfoSummary answers={answers} />

      <LandlordInfoSummary answers={answers} />

      <Box marginTop={2}>
        <Text variant="h5" as="h3">
          {formatMessage(summary.shareLinkLabel)}{' '}
          <Tooltip text={formatMessage(summary.shareLinkTooltip)} />
        </Text>
        <CopyLink
          linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.RentalAgreement.slug}/${application.id}`}
          buttonTitle={formatMessage(summary.shareLinkbuttonLabel)}
        />
      </Box>
    </Box>
  )
}
