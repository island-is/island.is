import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { formatKennitala, formatPhoneNumber } from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { Routes } from '../../lib/constants'

export const ApplicantOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as SecondarySchoolAnswers

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.PERSONAL)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(overview.applicant.subtitle)}
      isFirst
    >
      <Box>
        <GridRow>
          <GridColumn>
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
        </GridRow>
      </Box>
    </ReviewGroup>
  )
}
