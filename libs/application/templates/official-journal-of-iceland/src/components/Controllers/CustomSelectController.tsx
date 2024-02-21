import { useMutation } from '@apollo/client'
import {
  APPLICATION_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import { Select } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { OJOIApplication } from '../../lib/types'
import { dotToObj, getLocalError, keyMapper } from '../../lib/utils'
import { INITIAL_ANSWERS } from '../../lib/constants'
import { SelectFormField } from '@island.is/application/ui-fields'
import {
  Application,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'

type Props = {
  application: OJOIApplication
  name: string
  defaultValue?: string
  options: { label: string; value: string }[]
  label?: string
  placeholder?: string
  errorMessage?: string
  textarea?: boolean
  required?: boolean
  isOptional?: boolean
  disabled?: boolean
  onSelect?: (value: string) => void
  shouldRefetch?: boolean
}

export const CustomSelectController = ({
  application,
  name,
  options,
  defaultValue = '',
  label,
  placeholder,
  onSelect,
  required = false,
  isOptional = false,
  disabled = false,
  shouldRefetch = false,
}: Props) => {
  const { locale, formatMessage: f } = useLocale()

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [localValue, setLocalValue] = useState<string | undefined>(defaultValue)

  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const error = getLocalError(errors, name)

  const handleUpdate = useCallback(
    async (value: string) => {
      const key = keyMapper(name.split('.')[0])

      if (!key) {
        return
      }

      const defaultValue = {
        [key]: {
          ...INITIAL_ANSWERS[key],
          ...application.answers[key],
        },
      }

      const answers = dotToObj(name, { ...defaultValue }, value)

      setValue(name, value)

      await updateApplication({
        refetchQueries: shouldRefetch ? [APPLICATION_APPLICATION] : undefined,

        variables: {
          locale,
          input: {
            id: application.id,
            skipValidation: true,
            answers: {
              ...answers,
            },
          },
        },
      })
    },
    [
      application.answers,
      application.id,
      locale,
      name,
      setValue,
      shouldRefetch,
      updateApplication,
    ],
  )

  useEffect(() => {
    const handler = () => {
      if (typeof localValue === 'string') {
        handleUpdate(localValue)
      }
    }
    handler()
  }, [handleUpdate, localValue])

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={() => {
        return (
          <Select
            isDisabled={disabled}
            required={required}
            id={name}
            name={name}
            label={label}
            placeholder={placeholder}
            backgroundColor="blue"
            size="sm"
            options={options}
            value={options.find((option) => option.value === localValue)}
            hasError={Boolean(error)}
            errorMessage={typeof error === 'string' ? error : error?.message}
            onChange={(opt) => {
              if (opt) {
                setLocalValue(opt.value)

                if (onSelect) {
                  onSelect(opt.value)
                }
              }
            }}
          />
        )
      }}
    />
  )
}
