import { ReviewGroup, Label } from '@island.is/application/ui-components'
import { GridColumn, GridRow, ProfileCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import {
  getChildPensionReasonOptions,
  getApplicationExternalData,
} from '../../../lib/childPensionUtils'
import { childPensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import format from 'date-fns/format'
import { formatText } from '@island.is/application/core'

export const Children = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ registeredChildren, selectedCustodyKids }] =
    useStatefulAnswers(application)

  const { formatMessage } = useLocale()
  const childPensionReasonOptions = getChildPensionReasonOptions()

  const { custodyInformation } = getApplicationExternalData(
    application.externalData,
  )

  console.log('=======> registeredChildren: ', registeredChildren)
  console.log('=======> selectedCustodyKids: ', selectedCustodyKids)
  console.log('=======> custodyInformation: ', custodyInformation)

  // TODO: Bæta selectedCustodyKids við Review síðu
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
        {registeredChildren?.map((child, index) => {
          const reasons = child.reason.map(
            (reason) =>
              childPensionReasonOptions.find(
                (option) => option.value === reason,
              )?.label,
          )
          return (
            <GridColumn
              span={['12/12', '12/12', '12/12', '12/12']}
              paddingBottom={2}
              key={index}
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
                    reasons[0] &&
                    formatText(reasons[0], application, formatMessage)
                  }`,
                  // reasonTwo,
                  child.reason[1] &&
                    `${formatMessage(
                      childPensionFormMessage.info
                        .registerChildRepeaterTableHeaderReasonTwo,
                    )}: ${
                      reasons[1] &&
                      formatText(reasons[1], application, formatMessage)
                    }`,
                ]}
              />
            </GridColumn>
          )
        })}
      </GridRow>
    </ReviewGroup>
  )
}
