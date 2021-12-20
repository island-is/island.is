import React, { FC, useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'

export interface BankInfoFormData {
  bankInfo: string
}

interface Props {
  bankInfo: string
  renderBackButton?: () => JSX.Element
  renderSubmitButton?: () => JSX.Element
  onSubmit: (data: BankInfoFormData) => void
}

export const BankInfoForm: FC<Props> = ({
  bankInfo,
  renderBackButton,
  renderSubmitButton,
  onSubmit,
}) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors, reset } = useForm()

  useEffect(() => {
    if (bankInfo.length > 0)
      reset({
        bankInfo,
      })
  }, [bankInfo])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <InputController
          control={control}
          id="bankInfo"
          name="bankInfo"
          format="####-##-######"
          placeholder="0000-00-000000"
          defaultValue={bankInfo}
          label="Reikningsupplýsingar"
          error={errors.bankInfo?.message}
          required={true}
          rules={{
            required: {
              value: true,
              message: formatMessage({
                id: 'sp.settings:bankInfo-required-msg',
                defaultMessage: 'Reikningsupplýsingar geta ekki verið tómar',
              }),
            },
            minLength: {
              value: 12,
              message: formatMessage({
                id: 'sp.settings:bankInfo-required-length-msg',
                defaultMessage: `Reikningsupplýsingar eru 12 tölustafir á lengd.
                  Banki 4 stafir, höfuðbók 2 stafir, reikningsnúmer 6 stafir.`,
              }),
            },
            pattern: {
              value: /^\d+$/,
              message: formatMessage({
                id: 'sp.settings:only-numbers-allowed',
                defaultMessage: 'Eingöngu tölustafir eru leyfðir',
              }),
            },
          }}
        />
      </Box>
      {(renderBackButton || renderSubmitButton) && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          flexDirection={['columnReverse', 'row']}
          marginTop={4}
        >
          {renderBackButton && (
            <Box marginTop={[1, 0]}>{renderBackButton()}</Box>
          )}
          {renderSubmitButton && renderSubmitButton()}
        </Box>
      )}
    </form>
  )
}
