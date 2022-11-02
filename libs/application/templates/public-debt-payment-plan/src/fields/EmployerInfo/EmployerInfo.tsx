import { PaymentScheduleEmployer } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { format as formatKennitala } from 'kennitala'
import React from 'react'

export const EmployerInfo = ({ application }: FieldBaseProps) => {
  const employerInfo = getValueViaPath(
    application.externalData,
    'paymentPlanPrerequisites.data.employer',
  ) as PaymentScheduleEmployer

  const correctedNationalId = getValueViaPath(
    application.answers,
    'correctedEmployer.nationalId',
    undefined,
  )
  const correctedName = getValueViaPath(
    application.answers,
    'correctedEmployer.label',
    undefined,
  )

  if (!employerInfo) {
    console.error(
      'Public Dept Payment Plan Application: Did not receive employer information from service.',
    )
    return null
  }

  return (
    <Box marginTop={5} marginBottom={3}>
      {<Text variant="h2">{correctedName || employerInfo.name}</Text>}
      <Text variant="eyebrow" color="blue400">
        {`kt. ${formatKennitala(
          correctedNationalId || employerInfo.nationalId,
        )}`}
      </Text>
    </Box>
  )
}
