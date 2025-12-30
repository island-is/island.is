import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_FOR_PROPERTY_QUERY } from '../../graphql'
import { Query, SearchForPropertyInput } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { isValidRealEstate } from '../../lib/utils/helpers'
import { FieldComponentProps } from './types'

export const RealEstateLookup = ({
  fieldIndex,
  fieldName,
  error,
  setLoadingFieldName,
  ...props
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()
  const { setValue, clearErrors, setError } = useFormContext()
  const descriptionFieldName = `${fieldIndex}.description`
  const propertyNumberInput = useWatch({
    name: fieldName,
    defaultValue: '',
  })

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: SearchForPropertyInput }>(
      SEARCH_FOR_PROPERTY_QUERY,
      {
        onCompleted: (data) => {
          if (isValidRealEstate(propertyNumberInput)) {
            clearErrors(descriptionFieldName)
            setValue(
              descriptionFieldName,
              data.searchForProperty?.defaultAddress?.display ?? '',
            )
          } else {
            setError(fieldName, {
              message: formatMessage(m.errorPropertyNumber),
              type: 'validate',
            })
          }
        },
        fetchPolicy: 'network-only',
      },
    )

  useEffect(() => {
    setLoadingFieldName?.(queryLoading ? descriptionFieldName : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryLoading])

  useEffect(() => {
    if (!props.isInitial) {
      const propertyNumber = propertyNumberInput
        .trim()
        .toUpperCase()
        .replace('-', '')

      setValue(descriptionFieldName, '')

      if (isValidRealEstate(propertyNumber)) {
        clearErrors(fieldName)

        getProperty({
          variables: {
            input: {
              propertyNumber,
            },
          },
        })
      } else {
        if (propertyNumber.length !== 0) {
          setError(fieldName, {
            message: formatMessage(m.errorPropertyNumber),
            type: 'validate',
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyNumberInput])

  return (
    <InputController
      id={fieldName}
      name={fieldName}
      label={formatMessage(m.propertyNumber)}
      defaultValue={propertyNumberInput}
      error={error ? formatMessage(m.errorPropertyNumber) : undefined}
      placeholder={propertyNumberInput > 0 ? '' : props.field.placeholder}
      {...props}
    />
  )
}
