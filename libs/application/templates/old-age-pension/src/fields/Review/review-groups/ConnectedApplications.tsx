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

import { getApplicationAnswers } from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ConnectedApplications as Apps } from '../../../lib/constants'

export const ConnectedApplications = ({ application }: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { connectedApplications } = getApplicationAnswers(application.answers)

  return (
    <>
      {connectedApplications.length > 0 && (
        <ReviewGroup isLast={true}>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <Label>
                {formatMessage(
                  oldAgePensionFormMessage.connectedApplications
                    .relatedApplicationsSection,
                )}
              </Label>
              <BulletList type="ul">
                {connectedApplications.map((app, index) => {
                  let showText = formatMessage(
                    oldAgePensionFormMessage.connectedApplications.childSupport,
                  )
                  if (app === Apps.HOMEALLOWANCE) {
                    showText = formatMessage(
                      oldAgePensionFormMessage.shared.homeAllowance,
                    )
                  }
                  return (
                    <Bullet key={index}>
                      <Text>{showText}</Text>
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
