import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  VehiclePermnoWithInfoField,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  buildFieldRequired,
  coreErrorMessages,
  formatText,
  formatTextWithLocale,
  getErrorViaPath,
} from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { FC, useState } from 'react'
import { VehicleValidation } from './types'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { gql, useApolloClient, useLazyQuery } from '@apollo/client'
import { BasicVehicleInformation } from '@island.is/api/schema'
import { GET_VEHICLE_BASIC_INFO_BY_PERMNO } from './graphql/queries'
import debounce from 'lodash/debounce'

interface Props extends FieldBaseProps {
  field: VehiclePermnoWithInfoField
}

export const VehiclePermnoWithInfoFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field, errors }) => {
  const INPUT_MAX_LENGTH = 5
  const permnoField = `${field.id}.permno`
  const makeAndColorField = `${field.id}.makeAndColor`
  const hasErrorField = `${field.id}.hasError`

  const { setValue } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()
  const apolloClient = useApolloClient()

  const [isLoadingValidation, setIsLoadingValidation] = useState(false)
  const [vehicleValidation, setVehicleValidation] =
    useState<VehicleValidation | null>(null)
  const [permnoInput, setPermnoInput] = useState('')

  const [loadVehicleDetails, { data, loading: isLoadingDetails }] =
    useLazyQuery<
      {
        vehicleBasicInfoByPermno: BasicVehicleInformation
      },
      {
        permno: string
      }
    >(
      gql`
        ${GET_VEHICLE_BASIC_INFO_BY_PERMNO}
      `,
      {
        onCompleted: (data) => {
          const permno = data?.vehicleBasicInfoByPermno?.permno
          const make = data?.vehicleBasicInfoByPermno?.make || ''
          const color = data?.vehicleBasicInfoByPermno?.color || ''
          if (permno) {
            setValue(makeAndColorField, `${make} ${color}`)
          } else {
            setValue(makeAndColorField, '')
          }
        },
      },
    )

  const loadVehicleValidation = async (permno: string) => {
    setIsLoadingValidation(true)
    try {
      if (field.loadValidation) {
        const response = await field.loadValidation({
          application,
          apolloClient,
          permno: permno,
        })
        const validation = response as VehicleValidation

        setValue(hasErrorField, !!validation.errorMessages?.length)
        setVehicleValidation(validation)
      } else {
        setValue(hasErrorField, false)
        setVehicleValidation(null)
      }
    } catch (error) {
      console.error('error', error)
      setValue(hasErrorField, true)
      setVehicleValidation({
        errorMessages: [field.validationFailedErrorMessage || ''],
      })
    } finally {
      setIsLoadingValidation(false)
    }
  }

  const onChangePermno = (permnoVal: string) => {
    setPermnoInput(permnoVal)
    if (permnoVal.length !== INPUT_MAX_LENGTH) {
      setValue(makeAndColorField, '')
      setValue(hasErrorField, false)
      setVehicleValidation(null)
    } else {
      loadVehicleDetails({ variables: { permno: permnoVal } })
      loadVehicleValidation(permnoVal)
    }
  }

  return (
    <Box marginTop={field.marginTop} marginBottom={field.marginBottom}>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={permnoField}
            label={
              field.permnoLabel &&
              formatTextWithLocale(
                field.permnoLabel,
                application,
                locale as Locale,
                formatMessage,
              )
            }
            backgroundColor="blue"
            required={buildFieldRequired(application, field.required)}
            maxLength={INPUT_MAX_LENGTH}
            onChange={debounce(async (v) => {
              onChangePermno(v.target.value.replace(/\W/g, ''))
            })}
            loading={isLoadingDetails || isLoadingValidation}
            error={errors && getErrorViaPath(errors, permnoField)}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={makeAndColorField}
            label={
              field.makeAndColorLabel &&
              formatTextWithLocale(
                field.makeAndColorLabel,
                application,
                locale as Locale,
                formatMessage,
              )
            }
            error={
              permnoInput.length === INPUT_MAX_LENGTH &&
              data?.vehicleBasicInfoByPermno === null
                ? formatMessage(coreErrorMessages.vehicleNotFoundForPermno)
                : undefined
            }
            readOnly={true}
          />
        </GridColumn>
      </GridRow>

      {!!vehicleValidation?.errorMessages?.length && (
        <Box paddingTop={3}>
          <AlertMessage
            type="error"
            title={
              field.errorTitle &&
              formatTextWithLocale(
                field.errorTitle,
                application,
                locale as Locale,
                formatMessage,
              )
            }
            message={
              <Box>
                <BulletList>
                  {vehicleValidation.errorMessages?.map((errorMessage) => {
                    const message =
                      errorMessage &&
                      formatText(errorMessage, application, formatMessage)

                    const fallbackMessage =
                      field.fallbackErrorMessage &&
                      formatText(
                        field.fallbackErrorMessage,
                        application,
                        formatMessage,
                      )

                    return <Bullet>{message || fallbackMessage}</Bullet>
                  })}
                </BulletList>
              </Box>
            }
          />
        </Box>
      )}
    </Box>
  )
}
