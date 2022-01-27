import React, { FC, useState } from 'react'
import {
  Box,
  Button,
  Columns,
  Column,
  Icon,
  LoadingDots,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useUpdateOrCreateUserProfile } from '@island.is/service-portal/graphql'
import { formatBankInfo } from '../../utils/bankInfoHelper'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { useLocale, useNamespaces } from '@island.is/localization'

interface Props {
  bankInfo?: string
}

export const BankInfoForm: FC<Props> = ({ bankInfo }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, handleSubmit, errors } = useForm()
  const [inputSuccess, setInputSuccess] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>()

  const { updateOrCreateUserProfile, loading } = useUpdateOrCreateUserProfile()

  const submitFormData = async (data: { bankInfo: string }) => {
    try {
      setSubmitError(undefined)
      await updateOrCreateUserProfile({
        bankInfo: formatBankInfo(data.bankInfo),
      }).then(() => setInputSuccess(true))
    } catch (err) {
      setSubmitError(formatMessage(m.somethingWrong))
    }
  }

  return (
    <form onSubmit={handleSubmit(submitFormData)}>
      <Columns alignY="center">
        <Column width="8/12">
          <InputController
            control={control}
            id="bankInfo"
            name="bankInfo"
            format="####-##-######"
            placeholder="0000-00-000000"
            label="Reikningsupplýsingar"
            defaultValue={bankInfo}
            error={errors.bankInfo?.message || submitError}
            required={false}
            disabled={inputSuccess}
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
            {!loading && !inputSuccess && (
              <button type="submit">
                <Button variant="text" size="small">
                  Vista reikningsnúmer
                </Button>
              </button>
            )}
            {loading && <LoadingDots />}
            {inputSuccess && (
              <Icon icon="checkmarkCircle" color="mint600" type="filled" />
            )}
          </Box>
        </Column>
      </Columns>
      {inputSuccess && (
        <Columns alignY="center">
          <Column>
            <Box paddingTop={1}>
              <Button
                onClick={() => setInputSuccess(false)}
                variant="text"
                size="small"
              >
                Breyta
              </Button>
            </Box>
          </Column>
        </Columns>
      )}
    </form>
  )
}
