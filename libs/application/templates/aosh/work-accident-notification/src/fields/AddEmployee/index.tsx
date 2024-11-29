import { FC, useState } from 'react'
import { Box, Button, ErrorMessage, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { MAX_EMPLOYEES } from '../../shared/constants'

export const AddEmployee: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage, locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const { setValue } = useFormContext()
  const [couldNotAddEmployee, setCouldNotAddEmployee] = useState<boolean>(false)
  const [undefinedEmployeeAmount, setUndefinedEmployeeAmount] =
    useState<boolean>(false)
  const employeeAmount = getValueViaPath<number>(
    application.answers,
    'employeeAmount',
  )

  const addEmployeeAndGoToScreen = async () => {
    if (employeeAmount !== undefined) {
      setValue('employeeAmount', employeeAmount + 1)
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              employeeAmount: employeeAmount + 1,
            },
          },
          locale,
        },
      })

      if (res.data) {
        setUndefinedEmployeeAmount(false)
        setCouldNotAddEmployee(false)
        // Go to screen
        goToScreen && goToScreen(`employeeInformation[${employeeAmount}]`)
      } else {
        setCouldNotAddEmployee(true)
      }
    } else {
      setUndefinedEmployeeAmount(true)
    }
  }

  return (
    <Box>
      <Text variant="h5" marginBottom={2}>
        {formatMessage(overview.labels.addEmployeeDescription)}
      </Text>
      <Button
        disabled={
          employeeAmount && employeeAmount > MAX_EMPLOYEES ? true : false
        }
        variant="ghost"
        icon="add"
        fluid
        onClick={addEmployeeAndGoToScreen}
      >
        {formatMessage(overview.labels.addEmployeeButton)}
      </Button>
      {couldNotAddEmployee ? (
        <ErrorMessage id="could-not-add-employee">
          {formatMessage(overview.labels.couldNotAddEmployee)}
        </ErrorMessage>
      ) : undefinedEmployeeAmount ? (
        <ErrorMessage id="undefined-employee-amount">
          {formatMessage(overview.labels.undefinedEmployeeAmount)}
        </ErrorMessage>
      ) : null}
    </Box>
  )
}
