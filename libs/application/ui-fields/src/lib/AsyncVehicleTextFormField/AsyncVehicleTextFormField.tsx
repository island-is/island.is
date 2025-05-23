import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
  Input,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  AsyncVehicleTextField,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  buildFieldRequired,
  coreErrorMessages,
  formatText,
  formatTextWithLocale,
  getValueViaPath,
} from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { FC, useEffect, useState } from 'react'
// import { extractDetails } from './utils'
import { VehicleDetails, VehicleValidation } from './types'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { gql, useApolloClient, useLazyQuery } from '@apollo/client'
import { BasicVehicleInformation } from '@island.is/api/schema'
import { GET_VEHICLE_BASIC_INFO_BY_PERMNO } from './graphql/queries'
import debounce from 'lodash/debounce'

interface Props extends FieldBaseProps {
  field: AsyncVehicleTextField
}

export const AsyncVehicleTextFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
}) => {
  const { loadValidation } = field
  const INPUT_MAX_LENGTH = 5
  const permnoField = `${field.id}.permno`
  const makeAndColorField = `${field.id}.makeAndColor`

  const { setValue } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()
  const apolloClient = useApolloClient()

  const [isLoadingValidation, setIsLoadingValidation] = useState(false)
  const [vehicleValidation, setVehicleValidation] =
    useState<VehicleValidation | null>(
      null, //TODOx initialize from answers
    )

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
          console.log('data', data)
          const permno = data?.vehicleBasicInfoByPermno?.permno
          const make = data?.vehicleBasicInfoByPermno?.make || ''
          const color = data?.vehicleBasicInfoByPermno?.color || ''
          if (permno) {
            setValue(permnoField, permno)
            setValue(makeAndColorField, `${make} ${color}`)
          } else {
            setValue(permnoField, '')
            setValue(makeAndColorField, '')
          }
        },
      },
    )

  const loadVehicleValidation = async (permno: string) => {
    setIsLoadingValidation(true)
    try {
      const response = await loadValidation({
        application,
        apolloClient,
        permno: permno,
      })
      setVehicleValidation(response as VehicleValidation)
    } catch (error) {
      console.error('error', error)
      setVehicleValidation(null)
    } finally {
      setIsLoadingValidation(false)
    }
  }

  // fetch and update vehicle info when user has entered a valid permno
  useEffect(() => {
    if (permnoInput.length !== INPUT_MAX_LENGTH) {
      return //TODO should clear otherwise?
    }
    loadVehicleDetails({ variables: { permno: permnoInput } })
    loadVehicleValidation(permnoInput)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permnoInput, loadVehicleDetails])

  const hasError = !!vehicleValidation?.errorMessages?.length

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
              setPermnoInput(v.target.value.replace(/\W/g, ''))
            })}
            loading={isLoadingDetails || isLoadingValidation}
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
              data?.vehicleBasicInfoByPermno === null
                ? formatMessage(coreErrorMessages.vehicleNotFoundForPermno)
                : undefined
            }
            readOnly={true}
          />
        </GridColumn>
      </GridRow>

      {hasError && (
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
