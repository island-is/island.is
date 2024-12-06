import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import { CopyLink } from '@island.is/application/ui-components'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { PropertyInfoSummary } from './PropertyInfoSummary'
import { OtherFeesSummary } from './OtherFeesSummary'
import { RentalInfoSummary } from './RentalInfoSummary'
import { ApplicantsRepresentativesSummary } from './ApplicantsRepresentativesSummary'
import { SummarySection } from './SummarySection'
import { ApplicantsSummary } from './ApplicantsSummary'
import { summaryWrap } from './summaryStyles.css'

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
      <ApplicantsSummary answers={answers} />
      <ApplicantsRepresentativesSummary answers={answers} />
      <RentalInfoSummary answers={answers} />
      <PropertyInfoSummary answers={answers} />
      <OtherFeesSummary answers={answers} />
      <SummarySection
        sectionLabel={formatMessage(summary.shareLinkLabel)}
        tooltipText={formatMessage(summary.shareLinkTooltip)}
        noBorder
      >
        <CopyLink
          linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.RentalAgreement.slug}/${application.id}`}
          buttonTitle={formatMessage(summary.shareLinkbuttonLabel)}
        />
      </SummarySection>
    </Box>
  )
}
