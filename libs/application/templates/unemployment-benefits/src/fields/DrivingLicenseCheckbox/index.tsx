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
  Checkbox,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { FC, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { employmentSearch } from '../../lib/messages'
import {
  A,
  A1,
  A2,
  AM,
  B,
  BE,
  C1E,
  CE,
  D,
  D1,
  D1E,
  DE,
} from '../../assets/drivingLicenses'

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
      application.externalData,
      'unemploymentApplication.data.supportData.drivingLicenses',
    ) ?? []

  return (
    <Box paddingTop={2}>
      <Box
        background="blue100"
        borderRadius="large"
        border="standard"
        position="relative"
        paddingY={[2, 3, 4]}
        paddingX={[4, 6, 8]}
      >
        <Controller
          name={id}
          render={({ field: { onChange, value } }) => (
            <GridRow>
              <Text variant="h5" marginBottom={2}>
                {formatMessage(
                  employmentSearch.drivingLicense
                    .markCorrectDrivingLicenseLabel,
                )}
              </Text>
              {drivingLicenses.map((option, index) => {
                return (
                  option.name && (
                    <GridColumn key={option.id} paddingBottom={2} span="1/1">
                      <Box
                        display="flex"
                        justifyContent="spaceBetween"
                        alignItems="center"
                      >
                        <Checkbox
                          id={`${id}[${index}]`}
                          name={id}
                          label={formatMessage(
                            employmentSearch.drivingLicense.drivingLicenseLabel,
                            {
                              value: option.name,
                            },
                          )}
                          onChange={(e) => {
                            console.log(value)
                            // TODO: Make it work!
                            // if (e.target.checked) {
                            //   onChange([...value, e.target.value])
                            // } else {
                            //   onChange(
                            //     value.filter(
                            //       (v: string) => v !== e.target.value,
                            //     ),
                            //   )
                            // }
                          }}
                          checked={value && value.includes(option.name)}
                          value={option.name}
                        />
                        {(() => {
                          switch (option.name) {
                            case 'A':
                              return <A />
                            case 'A1':
                              return <A1 />
                            case 'A2':
                              return <A2 />
                            case 'AM':
                              return <AM />
                            case 'B':
                              return <B />
                            case 'BE':
                              return <BE />
                            case 'C1E':
                              return <C1E />
                            case 'CE':
                              return <CE />
                            case 'D':
                              return <D />
                            case 'D1':
                              return <D1 />
                            case 'D1E':
                              return <D1E />
                            case 'DE':
                              return <DE />
                            default:
                              return null
                          }
                        })()}
                      </Box>
                    </GridColumn>
                  )
                )
              })}
            </GridRow>
          )}
        />
      </Box>
    </Box>
  )
}
