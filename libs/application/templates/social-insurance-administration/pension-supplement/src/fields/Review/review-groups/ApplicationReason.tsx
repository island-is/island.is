import { ReviewGroup, Label } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  BulletList,
  Text,
  Bullet,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'

import { pensionSupplementFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { getApplicationReasonOptions } from '../../../lib/pensionSupplementUtils'

export const ApplicationReason = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [{ applicationReason }] = useStatefulAnswers(application)

  const { formatMessage } = useLocale()

  const applicationReasonOptions = getApplicationReasonOptions()

  const reasons = applicationReason.map((reason) => {
    return applicationReasonOptions.find((option) => option.value === reason)
      ?.label
  })

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('applicationReason')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Label>
            {formatMessage(
              pensionSupplementFormMessage.applicationReason.title,
            )}
          </Label>
          <BulletList type="ul">
            {reasons.map((reason, index) => {
              return (
                <Bullet key={index}>
                  <Text>
                    {reason && formatText(reason, application, formatMessage)}
                  </Text>
                </Bullet>
              )
            })}
          </BulletList>
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
