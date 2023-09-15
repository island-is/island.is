import React, { FC, useState, useEffect } from 'react'
import {
  Box,
  Columns,
  Column,
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
import { BankInfoTypes } from '../../types/form'
import { FormButton } from '../FormButton'
import * as styles from './ProfileForms.css'

interface Props {
  bankInfo?: BankInfoTypes
}

interface UseFormProps {
  bank: string
  l: string
  account: string
}

export const BankInfoForm: FC<React.PropsWithChildren<Props>> = ({
  bankInfo,
}) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UseFormProps>()
  const [inputPristine, setInputPristine] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>()

  const { updateOrCreateUserProfile, loading } = useUpdateOrCreateUserProfile()

  useEffect(() => {
    checkSetPristineInput()
  }, [bankInfo])

  const onInputChange = () => {
    setSubmitError(undefined)
    checkSetPristineInput()
  }

  const checkSetPristineInput = () => {
    const localForm = {
      bank: getValues().bank,
      l: getValues().l,
      account: getValues().account,
    }

    if (stringifyBankData(bankInfo) === stringifyBankData(localForm)) {
      setInputPristine(true)
    } else {
      setInputPristine(false)
    }
  }

  const submitFormData = async (data: BankInfoTypes) => {
    try {
      setSubmitError(undefined)

      const bankData = stringifyBankData(data)
      if (bankData) {
        await updateOrCreateUserProfile({
          bankInfo: bankData,
        }).then(() => setInputPristine(true))
      } else {
        setSubmitError(formatMessage(msg.errorBankInfoService))
      }
    } catch (err) {
      console.error(`updateOrCreateUserProfile error: ${err}`)
      setSubmitError(formatMessage(msg.errorBankInfoService))
    }
  }

  const bankInfoError =
    errors.account?.message ||
    errors.l?.message ||
    errors.bank?.message ||
    submitError

  return (
    <form onSubmit={handleSubmit(submitFormData)}>
      <Box display="flex" flexWrap="wrap" alignItems="center">
        <Box marginRight={3} className={styles.formContainer}>
          <Columns collapseBelow="sm" alignY="center">
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
                  disabled={loading}
                  size="xs"
                  error={errors.bank?.message || submitError ? '' : undefined}
                  onChange={onInputChange}
                  icon={inputPristine ? 'checkmark' : undefined}
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
                  disabled={loading}
                  icon={inputPristine ? 'checkmark' : undefined}
                  size="xs"
                  error={errors.l?.message || submitError ? '' : undefined}
                  onChange={onInputChange}
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
                  icon={inputPristine ? 'checkmark' : undefined}
                  defaultValue={bankInfo?.account || ''}
                  required={false}
                  disabled={loading}
                  size="xs"
                  error={
                    errors.account?.message || submitError ? '' : undefined
                  }
                  onChange={onInputChange}
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
          {bankInfoError ? (
            <Columns>
              <Column>
                <InputError id="bank-info-error" errorMessage={bankInfoError} />
              </Column>
            </Columns>
          ) : null}
        </Box>
        <Box
          display="flex"
          alignItems="flexStart"
          flexDirection="column"
          paddingTop={2}
        >
          {!loading && (
            <FormButton disabled={inputPristine} submit>
              {formatMessage(msg.buttonAccountSave)}
            </FormButton>
          )}
          {loading && <LoadingDots />}
        </Box>
      </Box>
    </form>
  )
}
