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
  FieldTypes,
  FieldComponents,
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
import { GET_EXEMPTION_VALIDATION_BY_PERMNO } from './graphql/queries'
import { HiddenInputFormField } from '../HiddenInputFormField/HiddenInputFormField'
import type { ExemptionValidation } from '@island.is/api/schema'

interface Props extends FieldBaseProps {
  field: VehiclePermnoWithInfoField
}

/*
 * This field was initially designed to be used as a base vehicle input field but due to requirements in
 * ExemptionForTransportation application the field now uses a graphQL query and SGS endpoint specifically designed for
 * that application.
 *
 * This is a temporary change to allow us to go live with that application. A more permanent implementation is due.
 */
export const VehiclePermnoWithInfoFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field, errors }) => {
  const INPUT_MAX_LENGTH = 5
  const permnoField = `${field.id}.permno`
  const makeAndColorField = `${field.id}.makeAndColor`
  const numberOfAxlesField = `${field.id}.numberOfAxles`
  const hasErrorField = `${field.id}.hasError`
  const isTrailer = field.isTrailer

  const { setValue, getValues } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()
  const apolloClient = useApolloClient()

  const [isLoadingValidation, setIsLoadingValidation] = useState(false)
  const [vehicleValidation, setVehicleValidation] =
    useState<VehicleValidation | null>(null)
  const [permnoInput, setPermnoInput] = useState('')

  const [loadVehicleDetails, { data, loading: isLoadingDetails }] =
    useLazyQuery<
      {
        vehicleExemptionValidation: ExemptionValidation
      },
      {
        permno: string
        isTrailer: boolean
      }
    >(
      gql`
        ${GET_EXEMPTION_VALIDATION_BY_PERMNO}
      `,
      {
        onCompleted: (data) => {
          const permno = data?.vehicleExemptionValidation?.permno
          const make = data?.vehicleExemptionValidation?.make || ''
          const color = data?.vehicleExemptionValidation?.color || ''
          const numberOfAxles =
            data?.vehicleExemptionValidation?.numberOfAxles || 0
          if (permno) {
            setValue(makeAndColorField, `${make} ${color}`)
            setValue(numberOfAxlesField, numberOfAxles)
          } else {
            setValue(makeAndColorField, '')
            setValue(numberOfAxlesField, 0)
          }
        },
      },
    )

  const loadVehicleValidation = async (permno: string) => {
    setIsLoadingValidation(true)
    try {
      if (field.loadValidation) {
        const response = await field.loadValidation({
          application: { ...application, answers: getValues() },
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

  const onChangePermno = (rawValue: string) => {
    // Clean input: only letters/numbers + uppercase
    const permnoVal = rawValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    setPermnoInput(permnoVal)
    setValue(permnoField, permnoVal)

    if (permnoVal.length !== INPUT_MAX_LENGTH) {
      setValue(makeAndColorField, '')
      setValue(numberOfAxlesField, 0)
      setValue(hasErrorField, false)
      setVehicleValidation(null)
    } else {
      loadVehicleDetails({
        variables: { permno: permnoVal, isTrailer: isTrailer },
      })
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
            onChange={(v) => {
              onChangePermno(v.target.value)
            }}
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
              data?.vehicleExemptionValidation === null
                ? formatMessage(coreErrorMessages.vehicleNotFoundForPermno)
                : errors && getErrorViaPath(errors, makeAndColorField)
            }
            readOnly={true}
          />
        </GridColumn>
      </GridRow>

      <HiddenInputFormField
        application={application}
        field={{
          id: numberOfAxlesField,
          type: FieldTypes.HIDDEN_INPUT,
          component: FieldComponents.HIDDEN_INPUT,
          children: undefined,
          dontDefaultToEmptyString: true,
        }}
      />
      <HiddenInputFormField
        application={application}
        field={{
          id: hasErrorField,
          type: FieldTypes.HIDDEN_INPUT,
          component: FieldComponents.HIDDEN_INPUT,
          children: undefined,
          dontDefaultToEmptyString: true,
        }}
      />

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
                  {vehicleValidation.errorMessages?.map((errorMessage, idx) => {
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

                    return (
                      <Bullet key={idx}>{message || fallbackMessage}</Bullet>
                    )
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
