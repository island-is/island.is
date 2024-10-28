import { FieldBaseProps } from '@island.is/application/types'
import { Button } from '@island.is/island-ui/core'
import { FC } from 'react'
import { WorkAccidentNotification } from '../../lib/dataSchema'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { shared } from '../../lib/messages'

interface DeleteEmployeeProps {
  index: number
  allowDeleteFirst?: boolean
}

export const DeleteEmployee: FC<
  React.PropsWithChildren<DeleteEmployeeProps & FieldBaseProps>
> = (props) => {
  const { application, refetch, goToScreen, allowDeleteFirst } = props
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const answers = application.answers as WorkAccidentNotification
  const idx = props.index
  const { locale, formatMessage } = useLocale()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeAtIndex = (array: Array<any>): Array<any> => {
    if (idx >= 0 && idx < array.length) {
      return [...array.slice(0, idx), ...array.slice(idx + 1)]
    }
    return array
  }

  const onDelete = async () => {
    // Delete employee
    const updatedEmployees = removeAtIndex(answers.employee)

    const updatedAbsences = removeAtIndex(answers.absence)
    const updatedDeviations = removeAtIndex(answers.deviations)
    const updatedInjuredBodyParts = removeAtIndex(answers.injuredBodyParts)
    const updatedTypeOfInjury = removeAtIndex(answers.typeOfInjury)
    const updatedCircumstances = removeAtIndex(answers.circumstances)
    const updatedCauseOfInjury = removeAtIndex(answers.causeOfInjury)

    const updateAmountOfEmployees =
      answers.employeeAmount === 1 ? 1 : answers.employeeAmount - 1

    // Calculate the next index, staying within the bounds of the updated array
    //const nextIndex = Math.min(idx, updateAmountOfEmployees - 1)

    const res = await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            employee: updatedEmployees,
            deviations: updatedDeviations,
            absence: updatedAbsences,
            causeOfInjury: updatedCauseOfInjury,
            typeOfInjury: updatedTypeOfInjury,
            circumstances: updatedCircumstances,
            injuredBodyParts: updatedInjuredBodyParts,
            employeeAmount: updateAmountOfEmployees,
          },
        },
        locale,
      },
    })
    if (res.data && goToScreen && refetch) {
      refetch()
    }
  }

  return (
    <Button
      disabled={answers.employeeAmount === 1 && !allowDeleteFirst}
      onClick={onDelete}
      colorScheme="default"
      iconType="outline"
      icon="trash"
      preTextIconType="filled"
      size="small"
      variant="text"
    >
      {formatMessage(shared.buttons.deleteEmployee)}
    </Button>
  )
}
