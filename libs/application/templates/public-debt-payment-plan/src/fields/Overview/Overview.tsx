import {
  PaymentScheduleEmployer,
  PaymentSchedulePayment,
} from '@island.is/api/schema'
import { coreMessages, FieldBaseProps } from '@island.is/application/core'
import { Label, ReviewGroup } from '@island.is/application/ui-components'
import {
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { useEffect, useState } from 'react'
import { overview } from '../../lib/messages'
import { formatIsk } from '../../lib/paymentPlanUtils'
import { YES } from '../../shared/constants'
import { PaymentPlanExternalData, PublicDebtPaymentPlan } from '../../types'
import { DistributionTable } from './DistributionTabel'
import * as styles from './Overview.treat'

export const Overview = ({ application, goToScreen }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const externalData = application.externalData as PaymentPlanExternalData
  const paymentPrerequisites = externalData.paymentPlanPrerequisites?.data
  const answers = application.answers as PublicDebtPaymentPlan
  const [bankClaims, setBankClaims] = useState<{
    paymentPlan: string
    distribution: Array<PaymentSchedulePayment>
  }>({ paymentPlan: 'one', distribution: [] })
  const [wageDeduction, setWageDeduction] = useState<{
    paymentPlan: string
    distribution: Array<PaymentSchedulePayment>
  }>({ paymentPlan: 'one', distribution: [] })
  const [bankClaimsTotalAmount, setBankClaimsTotlaAmount] = useState<number>(0)
  const [
    wageDeductionTotalAmount,
    setWageDeductionTotalAmount,
  ] = useState<number>(0)

  // Debts & payment plans
  const paymentPlans = answers?.paymentPlans

  // Applicant
  const nationalRegistry = externalData.nationalRegistry?.data
  const applicant = answers?.applicant

  // Employer
  const employerInfo = paymentPrerequisites?.employer as PaymentScheduleEmployer
  const employer = answers?.employer

  const editAction = (screen: string) => {
    if (goToScreen) {
      goToScreen(screen)
    }
  }

  useEffect(() => {
    let totalAmount = 0
    let paymentPlan = ''
    const distributions = Object.entries(paymentPlans)
      .map(([key, value]) => {
        const distribution = JSON.parse(
          value.distribution || '',
        ) as Array<PaymentSchedulePayment>
        if (value.id === 'Wagedection') {
          setWageDeduction({ paymentPlan: key, distribution })
          setWageDeductionTotalAmount(parseInt(value.totalAmount, 10))
          return []
        }
        if (paymentPlan.length === 0) {
          paymentPlan = key
        }
        totalAmount = totalAmount + parseInt(value.totalAmount, 10)
        return distribution
      })
      .sort((x, y) => y.length - x.length)
    setBankClaimsTotlaAmount(totalAmount)
    if (distributions) {
      let claimsToTheEmployerDistribution = distributions[0]
      for (const [index, distribution] of distributions.entries()) {
        if (index !== 0) {
          let lastAccumulatedNumber = 0
          claimsToTheEmployerDistribution = claimsToTheEmployerDistribution.map(
            ({ dueDate, payment, accumulated }, index) => {
              if (distribution[index]) {
                lastAccumulatedNumber = distribution[index].accumulated
                const newPayment = distribution[index].payment + payment
                const newAccumulated =
                  distribution[index].accumulated + accumulated
                return {
                  dueDate,
                  payment: newPayment,
                  accumulated: newAccumulated,
                }
              }
              const newAccumulated = lastAccumulatedNumber + accumulated
              return { dueDate, payment, accumulated: newAccumulated }
            },
          )
        }
      }
      setBankClaims({
        paymentPlan,
        distribution: claimsToTheEmployerDistribution,
      })
    }
  }, [paymentPlans])

  return (
    <>
      <ReviewGroup isEditable editAction={() => editAction('applicantSection')}>
        <GridRow>
          <GridColumn span={['6/12', '5/12']}>
            {nationalRegistry?.fullName && (
              <Box>
                <Label>{formatMessage(overview.name)}</Label>
                <Text>{nationalRegistry?.fullName}</Text>
              </Box>
            )}
            {applicant?.phoneNumber && (
              <Box>
                <Label marginTop={2}>
                  {formatMessage(overview.phoneNumber)}
                </Label>
                <Text>{applicant?.phoneNumber}</Text>
              </Box>
            )}
          </GridColumn>
          <GridColumn span={['6/12', '5/12']}>
            {nationalRegistry?.address?.streetAddress &&
              nationalRegistry?.address?.postalCode &&
              nationalRegistry?.address?.city && (
                <Box>
                  <Label>{formatMessage(overview.address)}</Label>
                  <Text>{`${nationalRegistry?.address?.streetAddress}, ${nationalRegistry?.address?.postalCode} ${nationalRegistry?.address?.city}`}</Text>
                </Box>
              )}
            {applicant?.email && (
              <Box>
                <Label marginTop={2}>{formatMessage(overview.email)}</Label>
                <Text>{applicant?.email}</Text>
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      {employer?.isCorrectInfo === YES && employerInfo?.nationalId && (
        <ReviewGroup
          isEditable
          editAction={() => editAction('employerMultiField')}
        >
          <GridRow>
            {employer?.isCorrectInfo === YES && (
              <GridColumn span={['6/12', '5/12']}>
                <Box>
                  <Label>{formatMessage(overview.employer)}</Label>
                  <Text>{employerInfo.name}</Text>
                </Box>
              </GridColumn>
            )}
            {employerInfo?.nationalId && (
              <GridColumn span={['6/12', '5/12']}>
                <Box>
                  <Label>{formatMessage(overview.employerSsn)}</Label>
                  <Text>
                    {employer?.isCorrectInfo === YES
                      ? employerInfo?.nationalId
                      : employer?.correctedNationalId}
                  </Text>
                </Box>
              </GridColumn>
            )}
          </GridRow>
        </ReviewGroup>
      )}
      <Box
        border="standard"
        padding={4}
        marginTop={5}
        marginBottom={3}
        borderRadius="large"
      >
        <AccordionItem
          id="payment-plan-overview-table"
          labelVariant="h3"
          label="Samtals skuldir"
          visibleContent={
            <>
              <span className={styles.fontWeight}>
                {formatMessage(overview.totalAmount)}
              </span>{' '}
              {formatIsk(wageDeductionTotalAmount + bankClaimsTotalAmount)}
            </>
          }
        >
          {wageDeduction.distribution.length > 0 && (
            <Box paddingY={2}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexStart"
              >
                <Box paddingBottom={[2, 4]}>
                  <Label>{formatMessage(overview.wageDeduction)}</Label>
                  <Text>{formatMessage(overview.monthlyPayments)}</Text>
                </Box>
                <Button
                  variant="utility"
                  icon="pencil"
                  onClick={() =>
                    editAction(`paymentPlans.${wageDeduction.paymentPlan}`)
                  }
                >
                  {formatMessage(coreMessages.buttonEdit)}
                </Button>
              </Box>
              <DistributionTable
                distribution={wageDeduction.distribution}
                totalAmount={wageDeductionTotalAmount}
                isWageDeduction
              />
            </Box>
          )}
          {bankClaims.distribution.length > 0 && (
            <Box paddingY={2}>
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="flexStart"
              >
                <Box paddingBottom={[2, 4]}>
                  <Label>{formatMessage(overview.bankClaims)}</Label>
                  <Text>{formatMessage(overview.monthlyPayments)}</Text>
                </Box>
                <Button
                  variant="utility"
                  icon="pencil"
                  onClick={() =>
                    editAction(`paymentPlans.${bankClaims.paymentPlan}`)
                  }
                >
                  {formatMessage(coreMessages.buttonEdit)}
                </Button>
              </Box>
              <DistributionTable
                distribution={bankClaims.distribution}
                totalAmount={bankClaimsTotalAmount}
              />
            </Box>
          )}
        </AccordionItem>
      </Box>

      <Box marginTop={1}>
        <AlertMessage
          type="info"
          title={formatMessage(overview.infoBoxTitle)}
          message={formatMessage(overview.infoBoxSummary)}
        />
      </Box>
    </>
  )
}
