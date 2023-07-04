import { Label, ReviewGroup } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  BulletList,
  Text,
  Bullet,
} from '@island.is/island-ui/core'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'

import { getAttachments } from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'

export const Attachments = ({ application }: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const attachments = getAttachments(application)
  console.log('ATTACH ', attachments)
  return (
    <>
      {attachments.length > 0 && (
        <ReviewGroup isLast={true}>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <Label>
                {formatMessage(oldAgePensionFormMessage.fileUpload.title)}
              </Label>
              <BulletList type="ul">
                {attachments.map((attch, index) => {
                  return (
                    <Bullet key={index}>
                      <Text>{attch}</Text>
                    </Bullet>
                  )
                })}
              </BulletList>
            </GridColumn>
          </GridRow>
        </ReviewGroup>
      )}
    </>
  )
}
