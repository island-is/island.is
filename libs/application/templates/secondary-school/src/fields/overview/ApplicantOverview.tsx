import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { SecondarySchoolAnswers } from '../..'
import { overview } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { formatKennitala, formatPhoneNumber, States, Routes } from '../../utils'
import { ReviewGroup } from '../../components/ReviewGroup'
import { getValueViaPath } from '@island.is/application/core'

export const ApplicantOverview: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const applicant = getValueViaPath<SecondarySchoolAnswers['applicant']>(
    application.answers,
    'applicant',
  )

  const onClick = (page: string) => {
    if (goToScreen) goToScreen(page)
  }

  return (
    <ReviewGroup
      handleClick={() => onClick(Routes.PERSONAL)}
      editMessage={formatMessage(overview.general.editMessage)}
      title={formatMessage(overview.applicant.subtitle)}
      isEditable={application.state === States.DRAFT}
      hideTopDivider={application.state !== States.DRAFT}
    >
      <Box>
        <GridRow>
          <GridColumn>
            <Text>{applicant?.name}</Text>
            <Text>{formatKennitala(applicant?.nationalId)}</Text>
            <Text>{applicant?.address}</Text>
            <Text>
              {applicant?.postalCode} {applicant?.city}
            </Text>
            <Text>
              {formatMessage(overview.applicant.phoneLabel)}:{' '}
              {formatPhoneNumber(applicant?.phoneNumber)}
            </Text>
            <Text>{applicant?.email}</Text>
          </GridColumn>
        </GridRow>
      </Box>
    </ReviewGroup>
  )
}
