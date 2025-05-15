import { EMAIL_REGEX, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState, useCallback, useEffect } from 'react'
import { UserInformation } from '../../shared'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { BuyerItem } from './BuyerItem'

export const Buyer: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { locale } = useLocale()
  const { application, field } = props
  const { id } = field

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [buyer, setBuyer] = useState<UserInformation>(
    getValueViaPath(application.answers, 'buyer', {
      name: '',
      nationalId: '',
      phone: '',
      email: '',
    }) as UserInformation,
  )

  const updateBuyer = useCallback(
    async (buyer: UserInformation) => {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              buyer: buyer,
            },
          },
          locale,
        },
      })
    },
    [application.id, locale, updateApplication],
  )

  useEffect(() => {
    if (
      buyer.name.length > 0 &&
      buyer.nationalId.length === 10 &&
      buyer.phone.length >= 7 &&
      EMAIL_REGEX.test(buyer.email)
    ) {
      updateBuyer(buyer)
    }
  }, [buyer, updateBuyer])

  return (
    <Box>
      <BuyerItem id={id} buyer={buyer} setBuyer={setBuyer} {...props} />
    </Box>
  )
}
