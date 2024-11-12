import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box, ErrorMessage } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { employee } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { WorkAccidentNotification } from '../../lib/dataSchema'
import { dateIsWithin36Hours } from '../../utils'

interface EmployeeStartTimeErrorProps {
  field: {
    props: {
      index: number
    }
  }
}

export const EmployeeStartTimeError: FC<
  React.PropsWithChildren<FieldBaseProps & EmployeeStartTimeErrorProps>
> = (props) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { index } = field.props
  const { getValues } = useFormContext<WorkAccidentNotification>()
  const { formatMessage } = useLocale()
  const [inputError, setInputError] = useState<boolean>(false)

  setBeforeSubmitCallback?.(async () => {
    const values = getValues('employee')
    if (
      values?.[index] &&
      values[index].startOfWorkdayDate &&
      values[index].startTime &&
      dateIsWithin36Hours(
        application,
        values[index].startOfWorkdayDate,
        values[index].startTime,
      )
    ) {
      setInputError(false)
      return [true, null]
    }
    setInputError(true)
    return [false, '']
  })

  return (
    <div>
      {inputError && (
        <Box>
          <ErrorMessage id={field.id}>
            {formatMessage(employee.employee.errorMessage)}
          </ErrorMessage>
        </Box>
      )}
    </div>
  )
}
