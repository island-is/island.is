import { FC, useEffect } from 'react'
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
import { hasDuplicateApplicants } from '../../utils/utils'

export const SummaryEdit: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  ...props
}) => {
  const { application, field, goToScreen, setSubmitButtonDisabled } = props
  const { formatMessage } = useLocale()
  const { answers } = application

  const {
    landlords,
    landlordRepresentatives,
    tenants,
    tenantRepresentatives,
    smokeDetectors,
    fireExtinguisher,
    emergencyExits,
    conditionDescription,
    files,
    electricityCostPayee,
    heatingCostPayee,
    housingFundPayee,
  } = applicationAnswers(answers)

  const isFireProtectionsPresent =
    smokeDetectors && fireExtinguisher && emergencyExits
  const isConditionPresent = conditionDescription || (files && files.length > 0)
  const isOtherFeesPresent =
    electricityCostPayee && heatingCostPayee && housingFundPayee
  const hasRepeatedApplicants = hasDuplicateApplicants([
    ...landlords,
    ...tenants,
    ...landlordRepresentatives,
    ...tenantRepresentatives,
  ])

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
      isFilled: !hasRepeatedApplicants,
      route: Routes.LANDLORDINFORMATION,
      message: summary.uniqueApplicantsError,
    },
    {
      isFilled: !hasRepeatedApplicants,
      route: Routes.TENANTINFORMATION,
      message: summary.uniqueApplicantsError,
    },
  ]

  const unfilledConditions = AlertMessageConditions.filter(
    (condition) => !condition.isFilled,
  )

  useEffect(() => {
    if (unfilledConditions.length > 0) {
      setSubmitButtonDisabled?.(true)
    } else {
      setSubmitButtonDisabled?.(false)
    }
  }, [unfilledConditions, setSubmitButtonDisabled])

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
        categoryRoute={Routes.PROPERTYINFORMATION}
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
