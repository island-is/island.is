import { gql, useLazyQuery } from '@apollo/client'
import { VehiclesCurrentOwnerInfo } from '@island.is/api/schema'
import { getValueViaPath, getErrorViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO } from '@island.is/clients/vmst-unemployment'
import {
  AlertMessage,
  Box,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { FC, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export const DrivingLicenseCheckbox: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, field, setFieldLoadingState, errors }) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { setValue } = useFormContext()
  const drivingLicenses =
    getValueViaPath<
      GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO[]
    >(
      application.answers,
      'unemploymentApplication.data.supportData.drivingLicenses',
    ) ?? []

  return (
    <Box background="blue100">
      <Controller
        name="bla"
        render={({ field: { onChange, value } }) => (
          <GridRow>
            {drivingLicenses.map(({ id: licenseId, name }) => (
              <GridColumn key={licenseId}>{/* <Checkbox */}</GridColumn>
            ))}
          </GridRow>
        )}
      />
    </Box>
  )
}
