import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import { Routes } from '../../lib/constants'
import { ApplicantsRepresentativesSummary } from './ApplicantsRepresentativesSummary'
import { ApplicantsSummary } from './ApplicantsSummary'
import { OtherFeesSummary } from './OtherFeesSummary'
import { PropertyInfoSummary } from './PropertyInfoSummary'
import { RentalInfoSummary } from './RentalInfoSummary'
import { SummaryCard } from './components/SummaryCard'

import { summaryWrap } from './summaryStyles.css'
import { summary } from '../../lib/messages'

export const Summary: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, field, goToScreen } = props
  const { formatMessage } = useLocale()

  return (
    <>
      <Box className={summaryWrap}>
        <Box>
          <Text variant="h2" as="h2" marginBottom={3}>
            {formatMessage(summary.pageTitle)}
          </Text>
          <Text marginBottom={5}>{formatMessage(summary.pageDescription)}</Text>
        </Box>
        <ApplicantsSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          landlordsRoute={Routes.LANDLORDINFORMATION}
          tenantsRoute={Routes.TENANTINFORMATION}
          isChangeButton={false}
        />
        <ApplicantsRepresentativesSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          landlordsRoute={Routes.LANDLORDINFORMATION}
          tenantsRoute={Routes.TENANTINFORMATION}
          isChangeButton={false}
        />
        <RentalInfoSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          rentalPeriodRoute={Routes.RENTALPERIOD}
          rentalAmountRoute={Routes.RENTALAMOUNT}
          securityDepositRoute={Routes.SECURITYDEPOSIT}
          isChangeButton={false}
        />
        <PropertyInfoSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          categoryRoute={Routes.PROPERTYCATEGORY}
          propertyInfoRoute={Routes.PROPERTYINFORMATION}
          propertyDescriptionRoute={Routes.SPECIALPROVISIONS}
          specialProvisionsRoute={Routes.SPECIALPROVISIONS}
          propertyConditionRoute={Routes.CONDITION}
          fileUploadRoute={Routes.CONDITION}
          fireProtectionsRoute={Routes.FIREPROTECTIONS}
          isChangeButton={false}
        />
        <OtherFeesSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          route={Routes.OTHERFEES}
          isChangeButton={false}
        />
        <SummaryCard
          cardLabel={formatMessage(summary.shareLinkLabel)}
          tooltipText={formatMessage(summary.shareLinkTooltip)}
          noBorder
        >
          <CopyLink
            linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.RentalAgreement.slug}/${application.id}`}
            buttonTitle={formatMessage(summary.shareLinkbuttonLabel)}
          />
        </SummaryCard>
      </Box>
    </>
  )
}
