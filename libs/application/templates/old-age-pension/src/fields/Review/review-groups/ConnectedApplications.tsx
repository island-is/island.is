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
import {
  ApplicationType,
  ConnectedApplications as Apps,
} from '../../../lib/constants'

export const ConnectedApplications = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { connectedApplications, applicationType } = getApplicationAnswers(
    application.answers,
  )

  return (
    <ReviewGroup
      isLast={true}
      isEditable={editable}
      editAction={() => goToScreen?.('connectedApplications')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Label>
            {formatMessage(
              oldAgePensionFormMessage.connectedApplications
                .connectedApplicationsSection,
            )}
          </Label>
          <BulletList type="ul">
            {connectedApplications.map((app, index) => {
              return (
                <Bullet key={index}>
                  <Text>
                    {app === Apps.HOUSEHOLDSUPPLEMENT
                      ? applicationType === ApplicationType.HALF_OLD_AGE_PENSION
                        ? formatMessage(
                            oldAgePensionFormMessage.connectedApplications
                              .halfHouseholdSupplement,
                          )
                        : formatMessage(
                            oldAgePensionFormMessage.connectedApplications
                              .householdSupplement,
                          )
                      : formatMessage(
                          oldAgePensionFormMessage.connectedApplications
                            .childPension,
                        )}
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
