import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getCountryByCode } from '@island.is/shared/utils'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getReasonForApplicationOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const ReasonForApplication = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, lang } = useLocale()
  const { reasonForApplication, reasonForApplicationCountry } =
    getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('reasonForApplication')}
      isLast
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <DataValue
              label={formatMessage(
                newPrimarySchoolMessages.primarySchool
                  .reasonForApplicationSubSectionTitle,
              )}
              value={formatMessage(
                getReasonForApplicationOptionLabel(reasonForApplication),
              )}
            />
          </GridColumn>
        </GridRow>
        {reasonForApplication === ReasonForApplicationOptions.MOVING_ABROAD && (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.primarySchool.country,
                )}
                value={
                  lang === 'is'
                    ? getCountryByCode(reasonForApplicationCountry)?.name_is
                    : getCountryByCode(reasonForApplicationCountry)?.name
                }
              />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
