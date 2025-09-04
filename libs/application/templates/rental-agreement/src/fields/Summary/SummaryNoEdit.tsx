import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { Routes } from '../../utils/enums'
import { ApplicantsRepresentativesSummary } from './ApplicantsRepresentativesSummary'
import { ApplicantsSummary } from './ApplicantsSummary'
import { OtherFeesSummary } from './OtherFeesSummary'
import { PropertyInfoSummary } from './PropertyInfoSummary'
import { RentalInfoSummary } from './RentalInfoSummary'

import { summaryWrap, summaryWrapNoEdit } from './summaryStyles.css'

export const SummaryNoEdit: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, field, goToScreen } = props

  return (
    <Box className={`${summaryWrap} ${summaryWrapNoEdit}`}>
      <ApplicantsSummary
        application={application}
        field={field}
        goToScreen={goToScreen}
        partiesRoute={Routes.PARTIESINFORMATION}
        hasChangeButton={false}
      />
      <ApplicantsRepresentativesSummary
        application={application}
        field={field}
        goToScreen={goToScreen}
        partiesRoute={Routes.PARTIESINFORMATION}
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
        categoryRoute={Routes.PROPERTYINFORMATION}
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
    </Box>
  )
}
