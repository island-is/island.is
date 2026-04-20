import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { filesValidation } from '../../lib/constants'
import React from 'react'

export const FilesValidation: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  setBeforeSubmitCallback,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { watch, setError, clearErrors } = useFormContext()

  const certificateOfDeathAnnouncement = watch('certificateOfDeathAnnouncement')
  const authorizationForFuneralExpenses = watch(
    'authorizationForFuneralExpenses',
  )
  // Check if required fields have been filled with a valid recipient (not empty string)
  const isValidValue = (val: string | undefined) => {
    return val !== undefined && val !== null && val !== '' && val.length > 0
  }

  // financesDataCollectionPermission is optional, so only check the first two fields
  const allFieldsFilled =
    isValidValue(certificateOfDeathAnnouncement) &&
    isValidValue(authorizationForFuneralExpenses)

  // Set validation callback
  useEffect(() => {
    if (!setBeforeSubmitCallback) {
      return
    }

    setBeforeSubmitCallback(async () => {
      if (!allFieldsFilled) {
        setError(filesValidation, {
          type: 'custom',
        })
        return [false, 'files recipients not selected']
      }
      return [true, null]
    })
  }, [setBeforeSubmitCallback, allFieldsFilled, setError])

  // Clear errors when all fields are filled
  useEffect(() => {
    if (allFieldsFilled) {
      clearErrors(filesValidation)
    }
  }, [allFieldsFilled, clearErrors])

  // Check if any of the three fields have errors
  const hasErrors =
    !!errors?.[filesValidation] ||
    !!errors?.certificateOfDeathAnnouncement ||
    !!errors?.authorizationForFuneralExpenses

  return (
    <Box>
      {hasErrors && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(m.filesValidationError)}
          />
        </Box>
      )}
    </Box>
  )
}

export default FilesValidation
