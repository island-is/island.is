import {
  PaymentScheduleDebts,
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
import { AMOUNT, MONTHS, YES } from '../../shared/constants'
import {
  PaymentPlanBuildIndex,
  PaymentPlanExternalData,
  paymentPlanIndexKeyMapper,
  PaymentPlanKeys,
  PublicDebtPaymentPlan,
} from '../../types'
import { DistributionTable } from './DistributionTabel'

export const Overview = ({ application, goToScreen }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const externalData = application.externalData as PaymentPlanExternalData
  const paymentPrerequisites = externalData.paymentPlanPrerequisites?.data
  const answers = application.answers as PublicDebtPaymentPlan
  const [claimsToTheEmployer, setClaimsToTheEmployer] = useState<
    Array<PaymentSchedulePayment>
  >([])
  console.log(answers)

  // Debts & payment plans
  const debts = paymentPrerequisites?.debts as PaymentScheduleDebts[]
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
    Object.entries(paymentPlans).map(([key, value]) => {
      console.log(value.distribution)
      const distribution = JSON.parse(
        value.distribution || '',
      ) as Array<PaymentSchedulePayment>
      console.log(distribution)
      if (claimsToTheEmployer.length === 0) {
        setClaimsToTheEmployer(distribution)
      } else {
        distribution.map(({ dueDate, payment, accumulated }) => {
          console.log(dueDate, payment, accumulated)
          return null
        })
      }
      /* if (distribution typeof Array) {
          distribution.map((dist) => {
            console.log(dist)
            setClaimsToTheEmployer([])
            return null
          })
        } */
    })
  }, [paymentPlans, claimsToTheEmployer.length])

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
          visibleContent="Heildarupphæð: 600.000 kr"
        >
          {debts?.map((payment, index) => {
            const paymentIndex = paymentPlanIndexKeyMapper[
              index as PaymentPlanBuildIndex
            ] as PaymentPlanKeys
            const currentPaymentPlan = paymentPlans[paymentIndex]
            if (!currentPaymentPlan) return null
            const monthAmount =
              currentPaymentPlan.paymentMode === AMOUNT
                ? currentPaymentPlan.amountPerMonth === undefined
                  ? null
                  : currentPaymentPlan.amountPerMonth
                : null
            const monthCount =
              currentPaymentPlan.paymentMode === MONTHS
                ? currentPaymentPlan.numberOfMonths === undefined
                  ? null
                  : currentPaymentPlan.numberOfMonths
                : null
            return (
              <Box paddingY={2} key={index}>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="flexStart"
                >
                  <Box paddingBottom={[2, 4]}>
                    <Label>{payment.paymentSchedule}</Label>
                    <Text>{formatMessage(overview.monthlyPayments)}</Text>
                  </Box>
                  <Button
                    variant="utility"
                    icon="pencil"
                    onClick={() => editAction(`paymentPlans.${paymentIndex}`)}
                  >
                    {formatMessage(coreMessages.buttonEdit)}
                  </Button>
                </Box>
                <DistributionTable
                  monthAmount={monthAmount}
                  monthCount={monthCount}
                  totalAmount={payment.totalAmount}
                  scheduleType={payment.type}
                />
              </Box>
            )
          })}
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
