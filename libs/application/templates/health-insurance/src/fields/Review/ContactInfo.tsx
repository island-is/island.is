import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { m } from '../../forms/messages'
import { ExternalDataNationalRegistry, ReviewFieldProps } from '../../types'

const ContactInfo: FC<ReviewFieldProps> = ({ application }) => {
  const { register, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const { data: nationalRegistry } = getValueViaPath(
    application.externalData,
    'nationalRegistry',
  ) as ExternalDataNationalRegistry

  useEffect(() => {
    setValue(
      'applicant.phoneNumber',
      getValueViaPath(application.answers, 'applicant.phoneNumber'),
    )
    setValue(
      'applicant.email',
      getValueViaPath(application.answers, 'applicant.email'),
    )
  }, [application.answers, setValue])

  return (
    <Box marginTop={[0, 0, 1]} marginBottom={[1, 1, 3]}>
      <Stack space={[3, 5]}>
        <Box>
          <Stack space={2}>
            <GridRow>
              <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 2, 0]}>
                <Input
                  id="applicant.name"
                  {...register('applicant.name')}
                  label={formatText(m.name, application, formatMessage)}
                  disabled
                  defaultValue={nationalRegistry?.fullName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  id="applicant.nationalId"
                  {...register('applicant.nationalId')}
                  label={formatText(m.nationalId, application, formatMessage)}
                  disabled
                  defaultValue={nationalRegistry?.nationalId}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 2, 0]}>
                <Input
                  id="applicant.address"
                  {...register('applicant.address')}
                  label={formatText(m.address, application, formatMessage)}
                  disabled
                  defaultValue={
                    nationalRegistry?.address?.streetAddress as string
                  }
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  id="applicant.postalCode"
                  {...register('applicant.postalCode')}
                  label={formatText(m.postalCode, application, formatMessage)}
                  disabled
                  defaultValue={nationalRegistry?.address?.postalCode as string}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  id="applicant.city"
                  {...register('applicant.city')}
                  label={formatText(m.city, application, formatMessage)}
                  disabled
                  defaultValue={nationalRegistry?.address?.city as string}
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
            <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 2, 0]}>
              <Input
                id="applicant.email"
                {...register('applicant.email')}
                label={formatText(m.email, application, formatMessage)}
                disabled
                defaultValue={getValueViaPath(
                  application.answers,
                  'applicant.email',
                )}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Input
                id="applicant.phoneNumber"
                {...register('applicant.phoneNumber')}
                label={formatText(m.phoneNumber, application, formatMessage)}
                disabled
                defaultValue={getValueViaPath(
                  application.answers,
                  'applicant.phoneNumber',
                )}
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
