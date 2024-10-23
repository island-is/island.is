import { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'

export const AddEmployee: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage, locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const { setValue } = useFormContext()
  const employeeAmount = getValueViaPath(
    application.answers,
    'employeeAmount',
  ) as number | undefined

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
        // Go to screen
        goToScreen && goToScreen(`employeeInformation[${employeeAmount}]`)
      } else {
        // Error message
      }
    } else {
      // Error because employee amount is undefined
    }
  }

  return (
    <Box>
      <Text variant="h5" marginBottom={2}>
        {formatMessage(overview.labels.addEmployeeDescription)}
      </Text>
      <Button
        variant="ghost"
        icon="add"
        fluid
        onClick={addEmployeeAndGoToScreen}
      >
        {formatMessage(overview.labels.addEmployeeButton)}
      </Button>
    </Box>
  )
}
