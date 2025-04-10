import { FC } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useUserInfo } from '@island.is/react-spa/bff'
import { getValueViaPath } from '@island.is/application/core'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

export const HandleApprove: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { locale } = useLocale()
  const userInfo = useUserInfo()
  const approved =
    getValueViaPath<string[]>(application.answers, 'approved') ?? []
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  setBeforeSubmitCallback?.(async (event) => {
    if (event === DefaultEvents.APPROVE || event === DefaultEvents.SUBMIT) {
      approved.push(userInfo?.profile.nationalId)
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              approved,
            },
          },
          locale,
        },
      })
      if (res) {
        return [true, null]
      } else {
        return [false, '']
      }
    }
    return [true, null]
  })

  return null
}
