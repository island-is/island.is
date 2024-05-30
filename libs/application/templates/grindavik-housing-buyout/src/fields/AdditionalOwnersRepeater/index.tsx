import { FieldBaseProps } from '@island.is/application/types'
import { GrindavikHousingBuyout } from '../../lib/dataSchema'
import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { getPropertyOwners } from '../../utils'
import { useFormContext } from 'react-hook-form'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import { useLocale } from '@island.is/localization'
import * as m from '../../lib/messages'

type FieldError =
  | {
      additionalOwners?: {
        name?: string
        nationalId?: string
        email?: string
        phone?: string
        bankInfo?: string
      }[]
    }
  | undefined

export const AdditionalOwnersRepeater = ({
  application,
  field,
  errors,
}: FieldBaseProps<GrindavikHousingBuyout>) => {
  const { control } = useFormContext()
  const { formatMessage } = useLocale()
  const owners = getPropertyOwners(application.externalData)
  const additionalOwners = owners.filter(
    (owner) => owner.kennitala !== application.applicant,
  )

  const fieldError = errors as FieldError

  return (
    <Box>
      <Stack space={6}>
        {additionalOwners.map((owner, index) => (
          <Box key={`${field.id}-${index}`}>
            <Text variant="h3" marginBottom={2}>
              {formatMessage(m.application.additionalOwners.owner)}
            </Text>
            <GridRow rowGap={2}>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={`${field.id}[${index}].name`}
                  control={control}
                  label={formatMessage(
                    applicantInformationMessages.labels.name,
                  )}
                  disabled
                  defaultValue={owner.nafn ?? ''}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={`${field.id}[${index}].nationalId`}
                  control={control}
                  label={formatMessage(
                    applicantInformationMessages.labels.nationalId,
                  )}
                  disabled
                  defaultValue={owner.kennitala ?? ''}
                  format="######-####"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={`${field.id}[${index}].email`}
                  type="email"
                  control={control}
                  backgroundColor="blue"
                  label={formatMessage(
                    applicantInformationMessages.labels.email,
                  )}
                  error={fieldError?.additionalOwners?.[index]?.email}
                  required
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <PhoneInputController
                  id={`${field.id}[${index}].phone`}
                  control={control}
                  backgroundColor="blue"
                  disableDropdown
                  label={formatMessage(applicantInformationMessages.labels.tel)}
                  error={fieldError?.additionalOwners?.[index]?.phone}
                  required
                />
              </GridColumn>
              <GridColumn span="1/1">
                <InputController
                  id={`${field.id}[${index}].bankInfo`}
                  control={control}
                  backgroundColor="blue"
                  placeholder="0000-00-000000"
                  format="####-##-######"
                  label={formatMessage(m.application.applicant.bankInfo)}
                  error={fieldError?.additionalOwners?.[index]?.bankInfo}
                  required
                />
              </GridColumn>
            </GridRow>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
