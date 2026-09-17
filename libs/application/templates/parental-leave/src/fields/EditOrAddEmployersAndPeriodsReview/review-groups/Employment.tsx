import {
  Application,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  DataValue,
  Label,
  RadioValue,
  ReviewGroup,
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { NO, YES } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { PARENTAL_LEAVE } from '../../../constants'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getChangeBaseline,
  normalize,
} from '../../../lib/parentalLeaveUtils'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Employment: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const {
    isSelfEmployed,
    isReceivingUnemploymentBenefits,
    unemploymentBenefits,
    employers,
    employerLastSixMonths,
    applicationType,
  } = getApplicationAnswers(application.answers)

  const previous = getChangeBaseline(application.externalData)?.employment

  const hasChanges =
    !!previous &&
    (normalize(previous.isSelfEmployed) !== normalize(isSelfEmployed) ||
      normalize(previous.isReceivingUnemploymentBenefits) !==
        normalize(isReceivingUnemploymentBenefits) ||
      (isSelfEmployed !== YES &&
        previous.isSelfEmployed !== YES &&
        JSON.stringify(previous.employers) !==
          JSON.stringify(
            employers.map((e) => ({ email: e.email, ratio: e.ratio })),
          )))

  const rows = employers.map((e) => {
    return [
      e.email,
      formatPhoneNumber(removeCountryCode(e.phoneNumber ?? '')),
      `${e.ratio}%`,
    ]
  })

  return (
    <ReviewGroup
      isEditable
      editAction={() => goToScreen?.('editEmployersFields')}
    >
      <Box display="flex" alignItems="center" columnGap={1} marginBottom={3}>
        <Text variant="h3">
          {formatMessage(parentalLeaveFormMessages.employer.subSection)}
        </Text>
        <Tooltip
          text={formatMessage(parentalLeaveFormMessages.employer.subSection)}
        />
        {hasChanges && (
          <Tag variant="purple">
            {formatMessage(parentalLeaveFormMessages.shared.changesMadeTag)}
          </Tag>
        )}
      </Box>
      {applicationType === PARENTAL_LEAVE &&
        (isSelfEmployed === YES ? (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.selfEmployed.title,
                )}
                value={isSelfEmployed}
              />
            </GridColumn>
          </GridRow>
        ) : (
          isReceivingUnemploymentBenefits === YES && (
            <GridRow>
              <GridColumn span={['7/12', '7/12', '7/12', '12/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.reviewScreen.benefits,
                  )}
                  value={unemploymentBenefits ?? ''}
                />
              </GridColumn>
            </GridRow>
          )
        ))}
      {((isSelfEmployed === NO && isReceivingUnemploymentBenefits === NO) ||
        employerLastSixMonths === YES) && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Label>
              {formatMessage(parentalLeaveFormMessages.employer.title)}
            </Label>
            {employers?.length > 0 && (
              <Box paddingTop={3}>
                <StaticTableFormField
                  application={application}
                  field={{
                    type: FieldTypes.STATIC_TABLE,
                    component: FieldComponents.STATIC_TABLE,
                    children: undefined,
                    id: 'employersTable',
                    title: '',
                    header: [
                      parentalLeaveFormMessages.employer.emailHeader,
                      parentalLeaveFormMessages.employer.phoneNumberHeader,
                      parentalLeaveFormMessages.employer.ratioHeader,
                    ],
                    rows,
                  }}
                />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}

export default Employment
