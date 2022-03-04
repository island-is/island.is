import React, { FC, useState } from 'react'
import {
  Box,
  Button,
  Columns,
  Column,
  Icon,
  LoadingDots,
  InputError,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useUpdateOrCreateUserProfile } from '@island.is/service-portal/graphql'
import { stringifyBankData } from '../../../../../utils/bankInfoHelper'
import { msg } from '../../../../../lib/messages'
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
      console.error(`updateOrCreateUserProfile error: ${err}`)
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
                  backgroundColor="blue"
                  id="bank"
                  name="bank"
                  format="####"
                  placeholder="0000"
                  label={formatMessage(msg.inputBankLabel)}
                  defaultValue={bankInfo?.bank || ''}
                  required={false}
                  disabled={inputSuccess}
                  size="xs"
                  rules={{
                    maxLength: {
                      value: 4,
                      message: formatMessage(msg.errorBankInputMaxLength),
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: formatMessage(msg.errorOnlyNumbers),
                    },
                    required: {
                      value: true,
                      message: formatMessage(m.bankInfoRequired),
                    },
                  }}
                />
              </Box>
            </Column>
            <Column width="content">
              <Box className={styles.hb}>
                <InputController
                  control={control}
                  backgroundColor="blue"
                  id="l"
                  name="l"
                  format="##"
                  placeholder="00"
                  label={formatMessage(msg.inputLedgerLabel)}
                  defaultValue={bankInfo?.l || ''}
                  required={false}
                  disabled={inputSuccess}
                  size="xs"
                  rules={{
                    maxLength: {
                      value: 2,
                      message: formatMessage(msg.errorLedgerInputMaxLength),
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: formatMessage(msg.errorOnlyNumbers),
                    },
                    required: {
                      value: true,
                      message: formatMessage(m.bankInfoRequired),
                    },
                  }}
                />
              </Box>
            </Column>
            <Column>
              <Box className={styles.account}>
                <InputController
                  control={control}
                  backgroundColor="blue"
                  id="account"
                  name="account"
                  format="######"
                  placeholder="000000"
                  label={formatMessage(msg.inputAccountNrLabel)}
                  defaultValue={bankInfo?.account || ''}
                  required={false}
                  disabled={inputSuccess}
                  size="xs"
                  rules={{
                    maxLength: {
                      value: 6,
                      message: formatMessage(msg.errorAccountInputMaxLength),
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: formatMessage(msg.errorOnlyNumbers),
                    },
                    required: {
                      value: true,
                      message: formatMessage(m.bankInfoRequired),
                    },
                  }}
                />
              </Box>
            </Column>
          </Columns>
          {submitError ||
          errors.account?.message ||
          errors.l?.message ||
          errors.bank?.message ? (
            <Columns>
              <Column>
                <InputError
                  id="bank-info-error"
                  errorMessage={
                    submitError ||
                    errors.account?.message ||
                    errors.l?.message ||
                    errors.bank?.message
                  }
                />
              </Column>
            </Columns>
          ) : null}
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
                  {formatMessage(msg.buttonAccountSave)}
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
                {formatMessage(msg.buttonChange)}
              </Button>
            </Box>
          </Column>
        </Columns>
      )}
    </form>
  )
}
