import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
} from '@island.is/island-ui/core'
import { applicationAnswers } from '../../shared'
import { Routes } from '../../utils/enums'
import { ApplicantsRepresentativesSummary } from './ApplicantsRepresentativesSummary'
import { ApplicantsSummary } from './ApplicantsSummary'
import { OtherFeesSummary } from './OtherFeesSummary'
import { PropertyInfoSummary } from './PropertyInfoSummary'
import { RentalInfoSummary } from './RentalInfoSummary'
import { summaryWrap } from './summaryStyles.css'
import { summary } from '../../lib/messages'

export const SummaryEdit: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, field, goToScreen, setSubmitButtonDisabled } = props
  const { formatMessage } = useLocale()
  const { answers } = application

  const {
    landlords,
    tenants,
    smokeDetectors,
    fireExtinguisher,
    emergencyExits,
    conditionDescription,
    files,
    electricityCostPayee,
    heatingCostPayee,
    housingFundPayee,
  } = applicationAnswers(answers)

  const tenantIds = tenants.map(
    (tenant) => tenant.nationalIdWithName.nationalId,
  )

  const isFireProtectionsPresent =
    smokeDetectors && fireExtinguisher && emergencyExits
  const isConditionPresent = conditionDescription || (files && files.length > 0)
  const isOtherFeesPresent =
    electricityCostPayee && heatingCostPayee && housingFundPayee
  const isSameLandlordAndTenantRuleFulfilled = landlords.some((landlord) =>
    tenantIds.includes(landlord.nationalIdWithName.nationalId),
  )

  const AlertMessageConditions = [
    {
      isFilled: isFireProtectionsPresent,
      route: Routes.FIREPROTECTIONS,
      message: summary.alertMissingInfoFireProtections,
    },
    {
      isFilled: isConditionPresent,
      route: Routes.CONDITION,
      message: summary.alertMissingInfoCondition,
    },
    {
      isFilled: isOtherFeesPresent,
      route: Routes.OTHERFEES,
      message: summary.alertMissingInfoOtherFees,
    },
    {
      isFilled: !isSameLandlordAndTenantRuleFulfilled,
      route: Routes.LANDLORDINFORMATION,
      message: summary.alertSameTenantAndLandlordLandlord,
    },
    {
      isFilled: !isSameLandlordAndTenantRuleFulfilled,
      route: Routes.TENANTINFORMATION,
      message: summary.alertSameTenantAndLandlordTenant,
    },
  ]

  const unfilledConditions = AlertMessageConditions.filter(
    (condition) => !condition.isFilled,
  )

  return (
    <Box className={summaryWrap} id="email-summary-container">
      <ApplicantsSummary
        application={application}
        field={field}
        goToScreen={goToScreen}
        landlordsRoute={Routes.LANDLORDINFORMATION}
        tenantsRoute={Routes.TENANTINFORMATION}
        hasChangeButton={true}
      />
      <ApplicantsRepresentativesSummary
        application={application}
        field={field}
        goToScreen={goToScreen}
        landlordsRoute={Routes.LANDLORDINFORMATION}
        tenantsRoute={Routes.TENANTINFORMATION}
        hasChangeButton={true}
      />
      <RentalInfoSummary
        application={application}
        field={field}
        goToScreen={goToScreen}
        rentalPeriodRoute={Routes.RENTALPERIOD}
        rentalAmountRoute={Routes.RENTALAMOUNT}
        securityDepositRoute={Routes.SECURITYDEPOSIT}
        hasChangeButton={true}
      />
      <PropertyInfoSummary
        application={application}
        field={field}
        goToScreen={goToScreen}
        categoryRoute={Routes.PROPERTYCATEGORY}
        propertySearchRoute={Routes.PROPERTYSEARCH}
        propertyDescriptionRoute={Routes.SPECIALPROVISIONS}
        specialProvisionsRoute={Routes.SPECIALPROVISIONS}
        propertyConditionRoute={Routes.CONDITION}
        fileUploadRoute={Routes.CONDITION}
        fireProtectionsRoute={Routes.FIREPROTECTIONS}
        hasChangeButton={true}
      />
      <OtherFeesSummary
        application={application}
        field={field}
        goToScreen={goToScreen}
        route={Routes.OTHERFEES}
        hasChangeButton={true}
      />
      {unfilledConditions.length > 0 && (
        <Box marginTop={4} marginBottom={4}>
          <AlertMessage
            type="error"
            title={formatMessage(summary.alertMissingInfoTitle)}
            message={
              <BulletList>
                {unfilledConditions.map((condition, index) => (
                  <Bullet key={`${index}_${condition.route}`}>
                    <Button
                      onClick={() => {
                        setSubmitButtonDisabled?.(false)
                        goToScreen?.(condition.route)
                      }}
                      variant="text"
                      size="small"
                    >
                      {formatMessage(condition.message)}
                    </Button>
                  </Bullet>
                ))}
              </BulletList>
            }
          />
        </Box>
      )}
    </Box>
  )
}
