import {
  Box,
  Stack,
  Text,
  RadioButton,
  Button,
  AlertMessage,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { BankAccountInput, ForeignBankAccountInput } from '../../components'
import type {
  DomesticBankAccountData,
  ForeignBankAccountData,
} from '../../components'
import { useState, useMemo, useEffect } from 'react'
import type { UpdateBankInformationMutationVariables } from './BankAccount.generated'
import {
  useGetBankInformationQuery,
  useUpdateBankInformationMutation,
} from './BankAccount.generated'
import { Problem } from '@island.is/react-spa/shared'
import {
  validIBAN,
  validSWIFT,
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
} from '@island.is/shared/utils'

const BankAccount = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const [accountType, setAccountType] = useState<'domestic' | 'foreign'>(
    'domestic',
  )

  const [bankAccountData, setBankAccountData] =
    useState<DomesticBankAccountData>({
      bankNumber: '',
      ledger: '',
      accountNumber: '',
    })

  const [foreignAccountData, setForeignAccountData] =
    useState<ForeignBankAccountData>({
      iban: '',
      swift: '',
      bankName: '',
      bankAddress: '',
      currency: '',
    })

  const [foreignInitial, setForeignInitial] = useState({
    iban: '',
    swift: '',
    bankName: '',
    bankAddress: '',
    currency: '',
  })

  const {
    data: bankInfoData,
    loading: bankInfoLoading,
    error: bankInfoError,
  } = useGetBankInformationQuery()

  const [updateBankInfo, { loading: isSaving }] =
    useUpdateBankInformationMutation()

  const currencyOptions = useMemo(
    () =>
      (bankInfoData?.socialInsuranceBankInformation?.currencies ?? []).map(
        (currency) => ({ label: currency, value: currency }),
      ),
    [bankInfoData],
  )

  useEffect(() => {
    if (!bankInfoData?.socialInsuranceBankInformation) return

    const bankInfo = bankInfoData.socialInsuranceBankInformation

    if (bankInfo.__typename === 'SocialInsuranceDomesticBankInformation') {
      setAccountType('domestic')
      setBankAccountData({
        bankNumber: bankInfo.bank || '',
        ledger: bankInfo.ledger || '',
        accountNumber: bankInfo.accountNumber || '',
      })
    } else if (
      bankInfo.__typename === 'SocialInsuranceForeignBankInformation'
    ) {
      setAccountType('foreign')
      setForeignInitial({
        iban: friendlyFormatIBAN(bankInfo.iban) || '',
        swift: friendlyFormatSWIFT(bankInfo.swift) || '',
        bankName: bankInfo.foreignBankName || '',
        bankAddress: bankInfo.foreignBankAddress || '',
        currency: bankInfo.foreignCurrency || '',
      })
      setForeignAccountData({
        iban: bankInfo.iban || '',
        swift: bankInfo.swift || '',
        bankName: bankInfo.foreignBankName || '',
        bankAddress: bankInfo.foreignBankAddress || '',
        currency: bankInfo.foreignCurrency || '',
      })
    }
  }, [bankInfoData])

  const isFormValid = useMemo(() => {
    if (accountType === 'domestic') {
      return (
        bankAccountData.bankNumber.length === 4 &&
        bankAccountData.ledger.length === 2 &&
        bankAccountData.accountNumber.length === 6
      )
    }

    return (
      !!foreignAccountData.iban &&
      validIBAN(foreignAccountData.iban) &&
      !!foreignAccountData.swift &&
      validSWIFT(foreignAccountData.swift) &&
      !!foreignAccountData.currency &&
      !!foreignAccountData.bankName.trim() &&
      !!foreignAccountData.bankAddress.trim()
    )
  }, [accountType, bankAccountData, foreignAccountData])

  const buildSaveInput =
    (): UpdateBankInformationMutationVariables['input'] => {
      if (accountType === 'domestic') {
        return {
          bank: bankAccountData.bankNumber,
          ledger: bankAccountData.ledger,
          accountNumber: bankAccountData.accountNumber,
        }
      }

      return {
        iban: foreignAccountData.iban,
        swift: foreignAccountData.swift,
        foreignBankName: foreignAccountData.bankName,
        foreignBankAddress: foreignAccountData.bankAddress,
        foreignCurrency: foreignAccountData.currency,
      }
    }

  const handleSave = async () => {
    try {
      const result = await updateBankInfo({
        variables: { input: buildSaveInput() },
      })

      if (result.data?.updateSocialInsuranceBankInformation) {
        toast.success(formatMessage(m.bankAccountSavedSuccess))
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to save bank account:', error)
      }
      toast.error(formatMessage(m.bankAccountSaveError))
    }
  }

  const introProps = {
    title: formatMessage(m.bankAccount),
    intro: formatMessage(m.bankAccountDescription),
    serviceProviderSlug: 'tryggingastofnun' as const,
    serviceProviderTooltip: formatMessage(coreMessages.socialInsuranceTooltip),
  }

  if (bankInfoLoading) {
    return (
      <Box>
        <IntroWrapper {...introProps}>
          <CardLoader />
        </IntroWrapper>
      </Box>
    )
  }

  if (bankInfoError) {
    return (
      <Box>
        <IntroWrapper {...introProps}>
          <Problem error={bankInfoError} noBorder={false} />
        </IntroWrapper>
      </Box>
    )
  }

  return (
    <Box>
      <IntroWrapper {...introProps}>
        <Stack space={4}>
          <Box role="radiogroup" aria-labelledby="account-type-title">
            <Text variant="h5" marginBottom={2} id="account-type-title">
              {formatMessage(m.accountTypeTitle)}
            </Text>
            <Stack space={2}>
              <RadioButton
                id="account-type-domestic"
                label={formatMessage(m.icelandicAccount)}
                name="accountType"
                value="icelandic"
                checked={accountType === 'domestic'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAccountType('domestic')
                  }
                }}
              />
              <RadioButton
                id="account-type-foreign"
                label={formatMessage(m.foreignAccount)}
                name="accountType"
                value="foreign"
                checked={accountType === 'foreign'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAccountType('foreign')
                  }
                }}
              />
            </Stack>
          </Box>

          {accountType === 'domestic' && (
            <Box>
              <Text marginBottom={2}>
                {formatMessage(m.icelandicAccountDescription)}
              </Text>

              <BankAccountInput
                title={formatMessage(m.accountInformationTitle)}
                bankNumber={bankAccountData.bankNumber}
                ledger={bankAccountData.ledger}
                accountNumber={bankAccountData.accountNumber}
                bankLabel={formatMessage(m.bankLabel)}
                ledgerLabel={formatMessage(m.ledgerLabel)}
                accountNumberLabel={formatMessage(m.accountNumberLabel)}
                errorMessage={formatMessage(m.invalidAccountNumber)}
                required
                onChange={setBankAccountData}
              />
            </Box>
          )}

          {accountType === 'foreign' && (
            <Box>
              <Text marginBottom={2}>
                {formatMessage(m.foreignAccountDescription)}
              </Text>

              <ForeignBankAccountInput
                title={formatMessage(m.accountInformationTitle)}
                iban={foreignInitial.iban}
                swift={foreignInitial.swift}
                bankName={foreignInitial.bankName}
                bankAddress={foreignInitial.bankAddress}
                currency={foreignInitial.currency}
                currencyOptions={currencyOptions}
                currencyLoading={false}
                onChange={setForeignAccountData}
              />
            </Box>
          )}

          <Box>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              loading={isSaving}
              size="small"
            >
              {formatMessage(coreMessages.save)}
            </Button>
          </Box>

          <AlertMessage
            type="info"
            message={
              <Text as="span" variant="small" whiteSpace="preLine">
                {formatMessage(
                  accountType === 'domestic'
                    ? m.accountChangeInfo
                    : m.foreignAccountChangeInfo,
                )}
              </Text>
            }
          />
        </Stack>
      </IntroWrapper>
    </Box>
  )
}

export default BankAccount
