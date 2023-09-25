import { ReviewGroup, Label } from '@island.is/application/ui-components'
import { GridColumn, GridRow, ProfileCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getApplicationExternalData,
  getApplicationAnswers,
  getChildPensionReasonOptions,
} from '../../../lib/childPensionUtils'
import { childPensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { format as formatKennitala } from 'kennitala'
import format from 'date-fns/format'
import { formatText } from '@island.is/application/core'
import { YES } from '../../../lib/constants'

export const Children = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const {
    registeredChildren,
    selectedChildrenInCustody,
    childPensionAddChild,
  } = getApplicationAnswers(application.answers)

  const { formatMessage } = useLocale()

  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )

  const allChildren = [
    ...selectedChildrenInCustody,
    ...(childPensionAddChild === YES ? registeredChildren : []),
  ]

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() =>
        goToScreen?.(
          custodyInformation.length !== 0
            ? 'chooseChildren'
            : 'registerChildRepeater',
        )
      }
    >
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '7/12']}
          paddingBottom={4}
        >
          <Label>
            {formatMessage(childPensionFormMessage.confirm.children)}
          </Label>
        </GridColumn>
        {allChildren?.map((child, index) => {
          const childPensionReasonOptions = getChildPensionReasonOptions()
          const reasons = child.reason?.map(
            (reason) =>
              childPensionReasonOptions.find(
                (option) => option.value === reason,
              )?.label,
          )

          const hasTwoReasons = Boolean(child.reason && child.reason[1])
          return (
            <GridColumn
              key={index}
              span={['12/12', '12/12', '12/12', '12/12']}
              paddingBottom={2}
            >
              <ProfileCard
                title={child.name}
                description={[
                  // nationalIdOrBirthDate
                  child.childDoesNotHaveNationalId
                    ? `${formatMessage(
                        childPensionFormMessage.info.registerChildBirthDate,
                      )}: ${format(
                        new Date(child.nationalIdOrBirthDate),
                        'dd.MM.yyyy',
                      )}`
                    : `${formatMessage(
                        childPensionFormMessage.info.registerChildNationalId,
                      )}: ${formatKennitala(child.nationalIdOrBirthDate)}`,
                  // reasonOne
                  `${formatMessage(
                    childPensionFormMessage.info
                      .registerChildRepeaterTableHeaderReasonOne,
                  )}: ${
                    reasons &&
                    reasons[0] &&
                    formatText(reasons[0], application, formatMessage)
                  }`,
                  // reasonTwo
                  hasTwoReasons
                    ? `${formatMessage(
                        childPensionFormMessage.info
                          .registerChildRepeaterTableHeaderReasonTwo,
                      )}: ${
                        reasons &&
                        reasons[1] &&
                        formatText(reasons[1], application, formatMessage)
                      }`
                    : '',
                ]}
              />
            </GridColumn>
          )
        })}
      </GridRow>
    </ReviewGroup>
  )
}
