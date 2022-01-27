import React, { FC } from 'react'
import {
  Box,
  Button,
  Columns,
  Column,
  // Icon,
  // Text,
  // LoadingDots,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale, useNamespaces } from '@island.is/localization'
import { HookFormType } from '../Forms/ProfileForm/types/form'

interface Props {
  bankInfo: string
  hookFormData: HookFormType
  onSave: (val: string) => void
}

export const BankInfoForm: FC<Props> = ({ hookFormData, onSave }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, errors, trigger, getValues } = hookFormData

  const saveBankInfo = (isValid: boolean) => {
    if (!isValid) {
      return
    }
    const bankInfoValue = getValues()?.bankInfo ?? ''
    onSave(bankInfoValue)
  }

  return (
    <Columns alignY="center">
      <Column width="8/12">
        <InputController
          control={control}
          id="bankInfo"
          name="bankInfo"
          format="####-##-######"
          placeholder="0000-00-000000"
          label="Reikningsupplýsingar"
          error={errors.bankInfo?.message}
          required={false}
          size="xs"
          rules={{
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
      </Column>
      <Column width="4/12">
        <Box
          display="flex"
          alignItems="flexEnd"
          flexDirection="column"
          paddingTop={2}
        >
          <Button
            variant="text"
            size="small"
            onClick={() => {
              trigger('bankInfo').then((valid) => saveBankInfo(valid))
            }}
          >
            Vista reikningsnúmer
          </Button>
          {/* {createLoading && <LoadingDots />} */}
        </Box>
      </Column>
    </Columns>
  )
}
