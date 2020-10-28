import React, { FC } from 'react'
import { toast } from '@island.is/island-ui/core'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PhoneForm, PhoneFormData } from '../../Forms/PhoneForm'
import { useVerifySms } from '@island.is/service-portal/graphql'

interface Props {
  tel: string
  natReg: string
  onBack: () => void
  onSubmit: (data: PhoneFormData) => void
}

export const PhoneStep: FC<Props> = ({ onBack, onSubmit, tel, natReg }) => {
  const { formatMessage } = useLocale()
  const { createSmsVerification, createLoading } = useVerifySms(natReg)

  const sendSmsVerificationCode = async (data: PhoneFormData) => {
    try {
      const response = await createSmsVerification({
        mobilePhoneNumber: data.tel,
      })
      if (response.data?.createSmsVerification?.created) {
        onSubmit(data)
      } else {
        toast.error(
          'Eitthvað fór úrskeiðis, ekki tókst að senda SMS í þetta símanúmer',
        )
      }
    } catch (err) {
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:tel-number',
              defaultMessage: 'Símanúmer',
            })}
          </Text>
          <Text marginBottom={7}>
            {formatMessage({
              id: 'sp.settings:profile-info-form-message',
              defaultMessage: `
                Vinsamlegast gerðu breytingar á þessum upplýsingum
                ef þörf krefur.
              `,
            })}
          </Text>
        </GridColumn>
      </GridRow>
      <PhoneForm
        tel={tel}
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage({
              id: 'service.portal:go-back',
              defaultMessage: 'Til baka',
            })}
          </Button>
        )}
        renderSubmitButton={() => (
          <Button disabled={createLoading} variant="primary" type="submit">
            {formatMessage({
              id: 'service.portal:next-step',
              defaultMessage: 'Senda staðfestingakóða',
            })}
          </Button>
        )}
        onSubmit={sendSmsVerificationCode}
      />
    </>
  )
}
