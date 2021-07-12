import { PaymentScheduleDebts } from '@island.is/api/schema'
import { FieldBaseProps } from '@island.is/application/core'
import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import React from 'react'
import { PaymentPlanExternalData } from '../../lib/dataSchema'

export const Overview = ({ application }: FieldBaseProps) => {
  const externalData = application.externalData as PaymentPlanExternalData
  const debts = externalData.paymentPlanPrerequisites?.data
    ?.debts as PaymentScheduleDebts[]

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
            <Box>
              <Label>Nafn</Label>
              <Text>Fjármundur Skuldason</Text>
            </Box>
            <Box>
              <Label marginTop={2}>Sími</Label>
              <Text>8486525</Text>
            </Box>
          </GridColumn>
          <GridColumn span={['6/12', '5/12']}>
            <Box>
              <Label>Heimilisfang</Label>
              <Text>Skuldagötu 2, 110 Reykjavík</Text>
            </Box>
            <Box>
              <Label marginTop={2}>Netfang</Label>
              <Text>Fjarmundurskuldason@simnet.is</Text>
            </Box>
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup isEditable editAction={editAction}>
        <GridRow>
          <GridColumn span={['6/12', '5/12']}>
            <Box>
              <Label>Vinnuveitandi</Label>
              <Text>Krónan ehf.</Text>
            </Box>
          </GridColumn>
          <GridColumn span={['6/12', '5/12']}>
            <Box>
              <Label>Kennitala vinnuveitanda</Label>
              <Text>711298-2239</Text>
            </Box>
          </GridColumn>
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
