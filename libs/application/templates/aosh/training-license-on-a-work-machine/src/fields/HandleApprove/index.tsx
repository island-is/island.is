import { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useUserInfo } from '@island.is/react-spa/bff'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import {
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import { TrainingLicenseOnAWorkMachineAnswers } from '../../shared/types'
import { useLocale } from '@island.is/localization'

export const HandleApprove: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const { setValue, getValues } = useFormContext()
  const userInfo = useUserInfo()
  const approved =
    getValueViaPath<string[]>(application.answers, 'approved') ?? []
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  setBeforeSubmitCallback?.(async (event) => {
    console.log('hello from ')
    if (event === DefaultEvents.APPROVE || event === DefaultEvents.SUBMIT) {
      approved.push(userInfo?.profile.nationalId)
      console.log(approved, userInfo?.profile.nationalId)
      const companyAndAssignee =
        getValueViaPath<
          TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
        >(application.answers, 'assigneeInformation')?.companyAndAssignee ?? []
      const assigneeIndex = companyAndAssignee.findIndex(
        (item) => item.assignee.nationalId === userInfo?.profile.nationalId,
      )
      setValue(`approved`, approved)
      console.log(getValues())
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              approved,
            },
          },
          locale,
        },
      })
      if (res) {
        return [true, null]
      } else {
        console.log('error')
        return [false, '']
      }
      console.log(res)
    }
    return [true, null]
  })

  return null
}
