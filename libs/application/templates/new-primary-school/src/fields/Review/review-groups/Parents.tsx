import {
  DataValue,
  Label,
  ReviewGroup,
} from '@island.is/application/ui-components'

import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Parents = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { parent1, parent2 } = getApplicationAnswers(application.answers)

  const parents = [parent1, parent2]

  return (
    <>
      {parents.map((parent, index) => {
        const parentIndex = index + 1

        console.log('XXXXparentsInfo' + parentIndex)

        return (
          <ReviewGroup
            isEditable={editable}
            editAction={() => goToScreen?.('parents')}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                <Label>
                  {formatMessage(newPrimarySchoolMessages.confirm.parents)}{' '}
                  {+parentIndex}
                </Label>
              </GridColumn>
            </GridRow>
            <GridRow marginTop={3}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.confirm.name)}
                  value={parent.fullName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.confirm.nationalId,
                  )}
                  value={formatKennitala(parent.nationalId)}
                />
              </GridColumn>
            </GridRow>
            <GridRow marginTop={3}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.confirm.address,
                  )}
                  value={parent.address.streetAddress}
                />
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.confirm.municipality,
                  )}
                  value={parent.address.city}
                />
              </GridColumn>
            </GridRow>
            <GridRow marginTop={3}>
              <GridColumn
                span={['12/12', '12/12', '12/12', '5/12']}
                paddingBottom={3}
              >
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.confirm.email)}
                  value={parent.email}
                />
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.confirm.phoneNumber,
                  )}
                  value={parent.phoneNumber}
                />
              </GridColumn>
            </GridRow>
          </ReviewGroup>
        )
      })}
    </>
  )
}
