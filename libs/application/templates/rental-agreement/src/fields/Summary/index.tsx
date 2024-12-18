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
import { Routes } from '../../lib/constants'

export const Summary: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, field, goToScreen } = props
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
      <ApplicantsSummary
        answers={answers}
        goToScreen={goToScreen || (() => {})}
        landlordsRoute={Routes.LANDLORDINFORMATION}
        tenantsRoute={Routes.TENANTINFORMATION}
      />
      <ApplicantsRepresentativesSummary
        application={application}
        field={field}
        goToScreen={goToScreen || (() => {})}
        landlordsRoute={Routes.LANDLORDINFORMATION}
        tenantsRoute={Routes.TENANTINFORMATION}
      />
      <RentalInfoSummary
        answers={answers}
        goToScreen={goToScreen}
        rentalPeriodRoute={Routes.RENTALPERIOD}
        rentalAmountRoute={Routes.RENTALAMOUNT}
        securityDepositRoute={Routes.SECURITYDEPOSIT}
      />
      <PropertyInfoSummary
        answers={answers}
        goToScreen={goToScreen}
        categoryRoute={Routes.PROPERTYCATEGORY}
        propertyInfoRoute={Routes.PROPERTYINFORMATION}
        propertyDescriptionRoute={Routes.SPECIALPROVISIONS}
        specialProvisionsRoute={Routes.SPECIALPROVISIONS}
        propertyConditionRoute={Routes.CONDITION}
        fileUploadRoute={Routes.CONDITION}
        fireProtectionsRoute={Routes.FIREPROTECTIONS}
      />
      <OtherFeesSummary
        answers={answers}
        goToScreen={goToScreen}
        route={Routes.OTHERFEES}
      />
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
