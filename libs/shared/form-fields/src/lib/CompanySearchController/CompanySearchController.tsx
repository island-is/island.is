import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  AlertMessage,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreErrorMessages } from '@island.is/application/core'

interface Props {
  invalidNationalIdError?: boolean
  noResultsFound?: boolean
  id: string
  defaultValue?: unknown
  name?: string
  label: string
  loading?: boolean
  options?: AsyncSearchOption[]
  placeholder?: string
  initialInputValue?: string
  inputValue?: string
  colored?: boolean
  onInputChange: (inputValue: string) => void
  setLabelToDataSchema?: boolean
}

export const CompanySearchController: FC<Props> = ({
  invalidNationalIdError,
  noResultsFound,
  defaultValue,
  id,
  name = id,
  label,
  loading = false,
  options = [],
  placeholder,
  initialInputValue = '',
  inputValue = '',
  colored = true,
  onInputChange,
  setLabelToDataSchema = true,
}) => {
  const { clearErrors, setValue } = useFormContext()
  const { formatMessage } = useLocale()
  return (
    <>
      <Controller
        name={name}
        defaultValue={defaultValue}
        render={() => {
          return (
            <AsyncSearch
              label={label}
              loading={loading}
              options={options}
              size="large"
              placeholder={placeholder}
              initialInputValue={initialInputValue}
              inputValue={inputValue}
              onInputValueChange={(query) => {
                setValue(
                  id,
                  setLabelToDataSchema
                    ? { nationalId: '', label: '' }
                    : { nationalId: '' },
                )
                clearErrors(id)
                const inputValue = query?.trim() || ''
                onInputChange(inputValue)
              }}
              colored={colored}
              onChange={(selection) => {
                const { value, label } = selection || {}
                if (value && label) {
                  setValue(
                    id,
                    setLabelToDataSchema
                      ? { nationalId: value, label }
                      : { nationalId: value },
                  )
                }
              }}
            />
          )
        }}
      />
      {invalidNationalIdError && (
        <InputError
          errorMessage={formatMessage(coreErrorMessages.invalidNationalId)}
        />
      )}
      {noResultsFound && (
        <Box marginTop={[2, 2]}>
          <AlertMessage
            type="error"
            title={formatMessage(
              coreErrorMessages.noCompanySearchResultsFoundTitle,
            )}
            message={formatMessage(
              coreErrorMessages.noCompanySearchResultsFoundMessage,
            )}
          />
        </Box>
      )}
    </>
  )
}

export default CompanySearchController
