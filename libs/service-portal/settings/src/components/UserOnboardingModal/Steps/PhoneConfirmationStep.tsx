import React, { FC } from 'react'
import { toast } from '@island.is/island-ui/core'
import { Button, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PhoneConfirmForm,
  PhoneConfirmFormData,
} from '../../Forms/PhoneConfirmationForm'
import { useVerifySms } from '@island.is/service-portal/graphql'

interface Props {
  tel: string
  natReg: string
  onBack: () => void
  onSubmit: () => void
}

export const PhoneConfirmationStep: FC<Props> = ({
  onBack,
  onSubmit,
  tel,
  natReg,
}) => {
  const { formatMessage } = useLocale()
  const { confirmSmsVerification, confirmLoading } = useVerifySms(natReg)

  const confirmSms = async (data: PhoneConfirmFormData) => {
    try {
      const response = await confirmSmsVerification({
        code: data.code,
      })
      if (response.data?.confirmSmsVerification?.confirmed) {
        onSubmit()
      } else {
        toast.error('Rangur kóði')
      }
    } catch (err) {
      toast.error('Rangur kóði')
    }
  }

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '4/7']}>
          <Text variant="h1" marginBottom={3}>
            {formatMessage({
              id: 'service.portal:tel-confirm-code',
              defaultMessage: 'Staðfestingakóði',
            })}
          </Text>
          <Text marginBottom={7}>
            {formatMessage({
              id: 'sp.settings:tel-confirm-form-message',
              defaultMessage: `
                Staðfestingarkóði hefur verið sendur á símanúmerið þitt: ${tel}. 
                Skrifaðu kóðann inn hér að neðan.
              `,
            })}
          </Text>
        </GridColumn>
      </GridRow>
      <PhoneConfirmForm
        renderBackButton={() => (
          <Button variant="ghost" onClick={onBack}>
            {formatMessage({
              id: 'service.portal:go-back',
              defaultMessage: 'Til baka',
            })}
          </Button>
        )}
        renderSubmitButton={() => (
          <Button
            disabled={confirmLoading}
            variant="primary"
            type="submit"
            icon="arrowForward"
          >
            {formatMessage({
              id: 'service.portal:next-step',
              defaultMessage: 'Næsta skref',
            })}
          </Button>
        )}
        onSubmit={confirmSms}
      />
    </>
  )
}
