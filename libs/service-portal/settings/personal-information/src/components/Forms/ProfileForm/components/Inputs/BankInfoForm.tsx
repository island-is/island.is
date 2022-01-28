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
import { stringifyBankData } from '../../../../../utils/bankInfoHelper'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { useLocale, useNamespaces } from '@island.is/localization'
import { BankInfoTypes } from '../../../ProfileForm/types/form'
import * as styles from './BankInfo.css'

interface Props {
  bankInfo?: BankInfoTypes
}

export const BankInfoForm: FC<Props> = ({ bankInfo }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, handleSubmit, errors } = useForm()
  const [inputSuccess, setInputSuccess] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>()

  const { updateOrCreateUserProfile, loading } = useUpdateOrCreateUserProfile()

  const submitFormData = async (data: BankInfoTypes) => {
    try {
      setSubmitError(undefined)

      const bankData = stringifyBankData(data)
      if (bankData) {
        await updateOrCreateUserProfile({
          bankInfo: bankData,
        }).then(() => setInputSuccess(true))
      } else {
        setSubmitError(formatMessage(m.somethingWrong))
      }
    } catch (err) {
      setSubmitError(formatMessage(m.somethingWrong))
    }
  }

  return (
    <form onSubmit={handleSubmit(submitFormData)}>
      <Columns collapseBelow="sm" alignY="center">
        <Column width="9/12">
          <Columns alignY="center">
            <Column width="content">
              <Box className={styles.bank}>
                <InputController
                  control={control}
                  id="bank"
                  name="bank"
                  maxLength={4}
                  placeholder="0000"
                  label="Banki"
                  defaultValue={bankInfo?.bank || ''}
                  error={errors.bank?.message || submitError}
                  required={false}
                  disabled={inputSuccess}
                  size="xs"
                  rules={{
                    maxLength: {
                      value: 4,
                      message: formatMessage({
                        id: 'sp.settings:bankInfo-required-length-msg',
                        defaultMessage: `Númer banka er í mesta lagi 4 stafir`,
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
            </Column>
            <Column width="content">
              <Box className={styles.hb}>
                <InputController
                  control={control}
                  id="l"
                  name="l"
                  maxLength={2}
                  placeholder="00"
                  label="Hb."
                  defaultValue={bankInfo?.l || ''}
                  error={errors.l?.message || submitError}
                  required={false}
                  disabled={inputSuccess}
                  size="xs"
                  rules={{
                    maxLength: {
                      value: 2,
                      message: formatMessage({
                        id: 'sp.settings:bankInfo-hb-required-length-msg',
                        defaultMessage: `Höfuðbók er í mesta lagi 2 stafir`,
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
            </Column>
            <Column>
              <Box className={styles.account}>
                <InputController
                  control={control}
                  id="account"
                  name="account"
                  maxLength={6}
                  placeholder="000000"
                  label="Reikningsnúmer"
                  defaultValue={bankInfo?.account || ''}
                  error={errors.account?.message || submitError}
                  required={false}
                  disabled={inputSuccess}
                  size="xs"
                  rules={{
                    maxLength: {
                      value: 6,
                      message: formatMessage({
                        id: 'sp.settings:bankInfo-account-required-length-msg',
                        defaultMessage: `Reikningsnúmer er í mesta lagi 6 stafir.`,
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
            </Column>
          </Columns>
        </Column>
        <Column width="3/12">
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
