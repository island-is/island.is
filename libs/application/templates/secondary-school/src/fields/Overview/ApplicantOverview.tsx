import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { formatKennitala, formatPhoneNumber } from '../../utils'

export const ApplicantOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <GridRow>
        <GridColumn span="1/2">
          <Text variant="h4">
            {formatMessage(overview.applicant.subtitle)}:
          </Text>
          <Text>{answers?.applicant?.name}</Text>
          <Text>{formatKennitala(answers?.applicant?.nationalId)}</Text>
          <Text>{answers?.applicant?.address}</Text>
          <Text>
            {answers?.applicant?.postalCode} {answers?.applicant?.city}
          </Text>
          <Text>
            {formatMessage(overview.applicant.phoneLabel)}:{' '}
            {formatPhoneNumber(answers?.applicant?.phoneNumber)}
          </Text>
          <Text>{answers?.applicant?.email}</Text>
        </GridColumn>
        <GridColumn span="1/2"></GridColumn>
      </GridRow>
    </Box>
  )
}
