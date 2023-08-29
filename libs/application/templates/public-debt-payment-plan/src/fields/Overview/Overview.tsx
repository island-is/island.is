import {
  PaymentScheduleEmployer,
  PaymentSchedulePayment,
} from '@island.is/api/schema'
import { coreMessages, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
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
import {
  PaymentPlan,
  Applicant,
  CorrectedEmployer,
  IdentityResult,
} from '../../types'
import { DistributionTable } from './DistributionTabel'
import * as styles from './Overview.css'
import * as kennitala from 'kennitala'

export const Overview = ({ application, goToScreen }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const isCompany = kennitala.isCompany(application.applicant)

  const [bankClaims, setBankClaims] = useState<{
    paymentPlan: string
    distribution: Array<PaymentSchedulePayment>
  }>({ paymentPlan: 'one', distribution: [] })

  const [wageDeduction, setWageDeduction] = useState<{
    paymentPlan: string
    distribution: Array<PaymentSchedulePayment>
  }>({ paymentPlan: 'one', distribution: [] })

  const [bankClaimsTotalAmount, setBankClaimsTotalAmount] = useState<number>(0)

  const [wageDeductionTotalAmount, setWageDeductionTotalAmount] =
    useState<number>(0)

  // Debts & payment plans
  const paymentPlans = getValueViaPath(
    application.answers,
    'paymentPlans',
  ) as PaymentPlan[]

  const identityRegistry = getValueViaPath(
    application.externalData,
    'identity',
  ) as IdentityResult

  // Applicant
  const applicant = getValueViaPath(
    application.answers,
    'applicant',
  ) as Applicant

  // Employer
  const employerInfo = getValueViaPath(
    application.externalData,
    'paymentPlanPrerequisites.data.employer',
  ) as PaymentScheduleEmployer

  // Corrected employer
  const correctedEmployer = getValueViaPath(
    application.answers,
    'correctedEmployer',
  ) as CorrectedEmployer

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
        if (value === undefined) return []
        const distribution = value.distribution as Array<PaymentSchedulePayment>
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
    setBankClaimsTotalAmount(totalAmount)
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
            {identityRegistry?.data?.name && (
              <Box>
                <Label>
                  {formatMessage(
                    isCompany ? overview.companyName : overview.name,
                  )}
                </Label>
                <Text>{identityRegistry.data.name}</Text>
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
            {identityRegistry?.data?.address?.streetAddress &&
              identityRegistry?.data?.address?.postalCode &&
              identityRegistry?.data?.address?.city && (
                <Box>
                  <Label>{formatMessage(overview.address)}</Label>
                  <Text>{`${identityRegistry?.data?.address?.streetAddress}, ${identityRegistry?.data?.address?.postalCode} ${identityRegistry?.data?.address?.city}`}</Text>
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
      {employerInfo?.nationalId && (
        <ReviewGroup
          isEditable
          editAction={() => editAction('employerMultiField')}
        >
          <GridRow>
            <GridColumn span={['6/12', '5/12']}>
              <Box>
                <Label>{formatMessage(overview.employer)}</Label>
                <Text>{correctedEmployer?.label || employerInfo.name}</Text>
              </Box>
            </GridColumn>
            <GridColumn span={['6/12', '5/12']}>
              <Box>
                <Label>{formatMessage(overview.employerSsn)}</Label>
                <Text>
                  {correctedEmployer?.nationalId || employerInfo?.nationalId}
                </Text>
              </Box>
            </GridColumn>
          </GridRow>
        </ReviewGroup>
      )}
      {isCompany && (
        <ReviewGroup isEditable editAction={() => editAction('info')}>
          <GridRow>
            <GridColumn span={['6/12', '5/12']}>
              <Box>
                <Label>{formatMessage(overview.companyNationalId)}</Label>
                <Text>{kennitala.format(application.applicant)}</Text>
              </Box>
            </GridColumn>
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
          label={formatMessage(overview.accordionItemLabel)}
          visibleContent={
            <>
              <span className={styles.fontWeight}>
                {formatMessage(overview.accordionTotalAmount)}
              </span>
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
