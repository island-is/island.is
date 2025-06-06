import { coreErrorMessages } from '@island.is/application/core'
import { FieldComponents, FieldTypes } from '@island.is/application/types'
import {
  Label,
  ReviewGroup,
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import {
  Box,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { useFriggOptions } from '../../../hooks/useFriggOptions'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectedOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Relatives = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { relatives } = getApplicationAnswers(application.answers)

  const {
    options: relationFriggOptions,
    loading,
    error,
  } = useFriggOptions(OptionsType.RELATION)

  const rows = relatives.map((r) => {
    return [
      r.fullName,
      formatPhoneNumber(removeCountryCode(r.phoneNumber ?? '')),
      formatKennitala(r.nationalId),
      getSelectedOptionLabel(relationFriggOptions, r.relation) ?? '',
    ]
  })

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('relatives')}
    >
      {loading ? (
        <SkeletonLoader height={40} width="80%" borderRadius="large" />
      ) : (
        <GridRow>
          <GridColumn span="12/12">
            <Label>
              {formatMessage(
                newPrimarySchoolMessages.childrenNGuardians
                  .relativesSubSectionTitle,
              )}
            </Label>
            {relatives?.length > 0 && (
              <Box paddingTop={3}>
                <StaticTableFormField
                  application={application}
                  field={{
                    type: FieldTypes.STATIC_TABLE,
                    component: FieldComponents.STATIC_TABLE,
                    children: undefined,
                    id: 'relativesTable',
                    header: [
                      newPrimarySchoolMessages.shared.fullName,
                      newPrimarySchoolMessages.shared.phoneNumber,
                      newPrimarySchoolMessages.shared.nationalId,
                      newPrimarySchoolMessages.shared.relation,
                    ],
                    rows,
                  }}
                />
              </Box>
            )}
            {error && (
              <Text marginTop={1} variant="eyebrow" color="red600">
                {formatMessage(coreErrorMessages.failedDataProvider)}
              </Text>
            )}
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
