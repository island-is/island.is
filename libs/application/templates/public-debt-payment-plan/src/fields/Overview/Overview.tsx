import {
  PaymentScheduleDebts,
  PaymentScheduleEmployer,
} from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import React from 'react'
import {
  PaymentPlanExternalData,
  PublicDebtPaymentPlan,
} from '../../lib/dataSchema'
import { YES } from '../../shared/constants'

export const Overview = ({ application }: FieldBaseProps) => {
  const externalData = application.externalData as PaymentPlanExternalData
  const paymentPrerequisites = externalData.paymentPlanPrerequisites?.data
  const debts = paymentPrerequisites?.debts as PaymentScheduleDebts[]
  const employerInfo = paymentPrerequisites?.employer as PaymentScheduleEmployer
  const nationalRegistry = externalData.nationalRegistry?.data
  const answers = application.answers as PublicDebtPaymentPlan
  const applicant = answers?.applicant
  const employer = answers?.employer

  const editAction = () => {
    // TODO: Write better function. What will happen on edit?
    console.log('this is edit action')
  }

  // TODO: Add text to messages.
  // TODO: Add edit functionality.
  return (
    <>
      <ReviewGroup isEditable editAction={editAction}>
        <GridRow>
          <GridColumn span={['6/12', '5/12']}>
            {nationalRegistry?.fullName && (
              <Box>
                <Label>Nafn</Label>
                <Text>{nationalRegistry?.fullName}</Text>
              </Box>
            )}
            {applicant?.phoneNumber && (
              <Box>
                <Label marginTop={2}>Sími</Label>
                <Text>{applicant?.phoneNumber}</Text>
              </Box>
            )}
          </GridColumn>
          <GridColumn span={['6/12', '5/12']}>
            {nationalRegistry?.address?.streetAddress &&
              nationalRegistry?.address?.postalCode &&
              nationalRegistry?.address?.city && (
                <Box>
                  <Label>Heimilisfang</Label>
                  <Text>{`${nationalRegistry?.address?.streetAddress}, ${nationalRegistry?.address?.postalCode} ${nationalRegistry?.address?.city}`}</Text>
                </Box>
              )}
            {applicant?.email && (
              <Box>
                <Label marginTop={2}>Netfang</Label>
                <Text>{applicant?.email}</Text>
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup isEditable editAction={editAction}>
        <GridRow>
          {employer?.isCorrectInfo === YES && (
            <GridColumn span={['6/12', '5/12']}>
              <Box>
                <Label>Vinnuveitandi</Label>
                <Text>{employerInfo.name}</Text>
              </Box>
            </GridColumn>
          )}
          {employerInfo?.nationalId && (
            <GridColumn span={['6/12', '5/12']}>
              <Box>
                <Label>Kennitala vinnuveitanda</Label>
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
      {debts?.map((payment, index) => {
        return (
          <ReviewGroup isEditable editAction={editAction}>
            <Box paddingBottom={[2, 4]}>
              <Label>{payment.paymentSchedule}</Label>
              <Text>Mánaðarlegar greiðslur</Text>
            </Box>
            {/* TODO: Add actual service
             (isLoading || paymentPlanResults) && (
              <PaymentPlanTable
                isLoading={isLoading}
                data={paymentPlanResults}
              />
            ) */}
          </ReviewGroup>
        )
      })}
    </>
  )
}
