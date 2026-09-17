import { Application } from '@island.is/application/types'
import {
  DataValue,
  ReviewGroup,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { FC } from 'react'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getChangeBaseline,
  normalize,
} from '../../../lib/parentalLeaveUtils'
import { Languages } from '../../../constants'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const BaseInformation: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { applicantEmail, applicantPhoneNumber, language } =
    getApplicationAnswers(application.answers)

  const { applicantName } = getApplicationExternalData(application.externalData)
  const { formatMessage } = useLocale()

  const baseline = getChangeBaseline(application.externalData)

  const hasChanges =
    !!baseline &&
    (normalize(baseline.baseInformation.applicantEmail) !==
      normalize(applicantEmail) ||
      normalize(baseline.baseInformation.applicantPhoneNumber) !==
        normalize(applicantPhoneNumber) ||
      normalize(baseline.language) !== normalize(language))

  return (
    <ReviewGroup isEditable editAction={() => goToScreen?.('editInfoSection')}>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <Box display="flex" alignItems="center" columnGap={1}>
          <Text variant="h3">
            {formatMessage(parentalLeaveFormMessages.applicant.subSection)}
          </Text>
          <Tooltip
            text={formatMessage(parentalLeaveFormMessages.shared.infoTooltip)}
          />
          {hasChanges && (
            <Tag variant="purple">
              {formatMessage(
                parentalLeaveFormMessages.shared.changesMadeNoApprovalTag,
              )}
            </Tag>
          )}
        </Box>
      </Box>
      <Stack space={2}>
        {applicantName !== '' && (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.applicant.fullName,
                )}
                value={applicantName ?? ''}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.applicant.nationalId,
                )}
                value={formatKennitala(application.applicant) ?? ''}
              />
            </GridColumn>
          </GridRow>
        )}

        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(parentalLeaveFormMessages.applicant.email)}
              value={applicantEmail ?? ''}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.applicant.phoneNumber,
              )}
              value={formatPhoneNumber(applicantPhoneNumber) ?? ''}
            />
          </GridColumn>
        </GridRow>

        <GridRow rowGap={2}>
          <GridColumn span={'12/12'}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.reviewScreen.language,
              )}
              value={
                formatMessage(
                  language === Languages.EN
                    ? parentalLeaveFormMessages.applicant.english
                    : parentalLeaveFormMessages.applicant.icelandic,
                ) ?? ''
              }
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}

export default BaseInformation
