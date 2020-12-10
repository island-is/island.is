import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../forms/messages'
import { FieldDescription } from 'libs/shared/form-fields/src'

const ContactInfo: FC<FieldBaseProps> = ({ application }) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={2}>
      <Stack space={5}>
        <Box>
          <Stack space={2}>
            <GridRow>
              <GridColumn span="6/12">
                <Input
                  id={'applicant.name'}
                  name={'applicant.name'}
                  label={formatText(m.name, application, formatMessage)}
                  ref={register}
                  disabled
                />
              </GridColumn>
              <GridColumn span="6/12">
                <Input
                  id={'applicant.nationalId'}
                  name={'applicant.nationalId'}
                  label={formatText(m.nationalId, application, formatMessage)}
                  ref={register}
                  disabled
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="6/12">
                <Input
                  id={'applicant.address'}
                  name={'applicant.address'}
                  label={formatText(m.address, application, formatMessage)}
                  ref={register}
                  disabled
                />
              </GridColumn>
              <GridColumn span="6/12">
                <Input
                  id={'applicant.postalCode'}
                  name={'applicant.postalCode'}
                  label={formatText(m.postalCode, application, formatMessage)}
                  ref={register}
                  disabled
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="6/12">
                <Input
                  id={'applicant.city'}
                  name={'applicant.city'}
                  label={formatText(m.city, application, formatMessage)}
                  ref={register}
                  disabled
                />
              </GridColumn>
              <GridColumn span="6/12">
                <Input
                  id={'applicant.nationality'}
                  name={'applicant.nationality'}
                  label={formatText(m.nationality, application, formatMessage)}
                  ref={register}
                  disabled
                />
              </GridColumn>
            </GridRow>
          </Stack>
          <FieldDescription
            description={formatText(
              m.editNationalRegistryData,
              application,
              formatMessage,
            )}
          />
        </Box>

        <Box>
          <GridRow>
            <GridColumn span="6/12">
              <Input
                id={'applicant.email'}
                name={'applicant.email'}
                label={formatText(m.email, application, formatMessage)}
                ref={register}
              />
            </GridColumn>
            <GridColumn span="6/12">
              <Input
                id={'applicant.phoneNumber'}
                name={'applicant.phoneNumber'}
                label={formatText(m.phoneNumber, application, formatMessage)}
                ref={register}
              />
            </GridColumn>
          </GridRow>
          <FieldDescription
            description={formatText(
              m.editDigitalIslandData,
              application,
              formatMessage,
            )}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default ContactInfo
