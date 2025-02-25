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
        <ApplicantsSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          landlordsRoute={Routes.LANDLORDINFORMATION}
          tenantsRoute={Routes.TENANTINFORMATION}
          hasChangeButton={false}
        />
        <ApplicantsRepresentativesSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          landlordsRoute={Routes.LANDLORDINFORMATION}
          tenantsRoute={Routes.TENANTINFORMATION}
          hasChangeButton={false}
        />
        <RentalInfoSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          rentalPeriodRoute={Routes.RENTALPERIOD}
          rentalAmountRoute={Routes.RENTALAMOUNT}
          securityDepositRoute={Routes.SECURITYDEPOSIT}
          hasChangeButton={false}
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
          hasChangeButton={false}
        />
        <OtherFeesSummary
          application={application}
          field={field}
          goToScreen={goToScreen}
          route={Routes.OTHERFEES}
          hasChangeButton={false}
        />
        <SummaryCard
          cardLabel={formatMessage(summary.shareLinkLabel)}
          tooltipText={formatMessage(summary.shareLinkTooltip)}
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
