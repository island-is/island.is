import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { ReviewGroupProps } from './props'
import { useLocale } from '@island.is/localization'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/deathBenefitsUtils'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { deathBenefitsFormMessage } from '../../../lib/messages'
import { format as formatKennitala } from 'kennitala'

export const DeceasedSpouse = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()
  const externalDataDeceasedSpouse = getApplicationExternalData(
    application.externalData,
  ).deceasedSpouseNationalId
  const {
    deceasedSpouseName,
    deceasedSpouseNationalId,
    deceasedSpouseDateOfDeath,
  } = getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isLast
      isEditable={editable && !externalDataDeceasedSpouse}
      editAction={() => goToScreen?.('deceasedSpouseNoInfo')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={'10/12'}>
            <Text variant="h3" as="h3">
              {formatMessage(deathBenefitsFormMessage.info.deceasedSpouseTitle)}
            </Text>
          </GridColumn>
        </GridRow>
        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                deathBenefitsFormMessage.info.deceasedSpouseName,
              )}
              value={deceasedSpouseName}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                deathBenefitsFormMessage.info.deceasedSpouseNationalId,
              )}
              value={formatKennitala(deceasedSpouseNationalId)}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                deathBenefitsFormMessage.info.deceasedSpouseDate,
              )}
              value={formatDate(deceasedSpouseDateOfDeath)}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
