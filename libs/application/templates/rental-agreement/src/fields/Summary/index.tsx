import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
} from '@island.is/island-ui/core'
import { CopyLink } from '@island.is/application/ui-components'
import { RentalAgreement } from '../../lib/dataSchema'
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
  const { application, field, goToScreen, setSubmitButtonDisabled } = props
  const { formatMessage } = useLocale()

  const answers = application.answers as RentalAgreement

  const isFireProtectionsPresent =
    answers.fireProtections.smokeDetectors &&
    answers.fireProtections.fireExtinguisher &&
    answers.fireProtections.emergencyExits

  const isConditionPresent = answers.condition.resultsDescription

  const isOtherFeesPresent =
    answers.otherFees.electricityCost &&
    answers.otherFees.heatingCost &&
    answers.otherFees.housingFund

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
  ]

  const unfilledConditions = AlertMessageConditions.filter(
    (condition) => !condition.isFilled,
  )

  return (
    <Box className={summaryWrap}>
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
        propertyInfoRoute={Routes.PROPERTYINFORMATION}
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
      <SummaryCard
        cardLabel={formatMessage(summary.shareLinkLabel)}
        tooltipText={formatMessage(summary.shareLinkTooltip)}
      >
        <CopyLink
          linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.RentalAgreement.slug}/${application.id}`}
          buttonTitle={formatMessage(summary.shareLinkbuttonLabel)}
        />
      </SummaryCard>

      {!isFireProtectionsPresent ||
      !isConditionPresent ||
      !isOtherFeesPresent ? (
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
                        setSubmitButtonDisabled &&
                          setSubmitButtonDisabled(false)
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
      ) : (
        ''
      )}
    </Box>
  )
}
