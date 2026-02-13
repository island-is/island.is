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
import {
  BankAccountInput,
  ForeignBankAccountInput,
} from '../../components'
import type {
  DomesticBankAccountData,
  ForeignBankAccountData,
} from '../../components'
import { useState, useMemo, useEffect, useRef } from 'react'
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

  const [accountType, setAccountType] = useState<'icelandic' | 'foreign'>(
    'icelandic',
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

  const foreignDataRef = useRef(foreignAccountData)
  const handleForeignChange = (data: ForeignBankAccountData) => {
    setForeignAccountData(data)
    foreignDataRef.current = data
  }

  const {
    data: bankInfoData,
    loading: bankInfoLoading,
    error: bankInfoError,
  } = useGetBankInformationQuery()

  const [updateBankInfo, { loading: isSaving }] =
    useUpdateBankInformationMutation()

  const currencyOptions = useMemo(
    () =>
      (
        bankInfoData?.socialInsuranceBankInformation?.currencies ?? []
      ).map((currency) => ({ label: currency, value: currency })),
    [bankInfoData],
  )

  const [foreignInitial, setForeignInitial] = useState({
    iban: '',
    swift: '',
    bankName: '',
    bankAddress: '',
    currency: '',
  })

  useEffect(() => {
    if (!bankInfoData?.socialInsuranceBankInformation) return

    const bankInfo = bankInfoData.socialInsuranceBankInformation

    if (bankInfo.__typename === 'SocialInsuranceDomesticBankInformation') {
      setAccountType('icelandic')
      setBankAccountData({
        bankNumber: bankInfo.bank || '',
        ledger: bankInfo.ledger || '',
        accountNumber: bankInfo.accountNumber || '',
      })
    } else if (
      bankInfo.__typename === 'SocialInsuranceForeignBankInformation'
    ) {
      setAccountType('foreign')
      const initial = {
        iban: friendlyFormatIBAN(bankInfo.iban) || '',
        swift: friendlyFormatSWIFT(bankInfo.swift) || '',
        bankName: bankInfo.foreignBankName || '',
        bankAddress: bankInfo.foreignBankAddress || '',
        currency: bankInfo.foreignCurrency || '',
      }
      setForeignInitial(initial)
      setForeignAccountData({
        iban: bankInfo.iban || '',
        swift: bankInfo.swift || '',
        bankName: bankInfo.foreignBankName || '',
        bankAddress: bankInfo.foreignBankAddress || '',
        currency: bankInfo.foreignCurrency || '',
      })
      foreignDataRef.current = {
        iban: bankInfo.iban || '',
        swift: bankInfo.swift || '',
        bankName: bankInfo.foreignBankName || '',
        bankAddress: bankInfo.foreignBankAddress || '',
        currency: bankInfo.foreignCurrency || '',
      }
    }
  }, [bankInfoData])

  const isFormValid = useMemo(() => {
    if (accountType === 'icelandic') {
      return (
        bankAccountData.bankNumber.length === 4 &&
        bankAccountData.ledger.length === 2 &&
        bankAccountData.accountNumber.length === 6
      )
    } else {
      const fd = foreignAccountData
      return (
        !!fd.iban &&
        validIBAN(fd.iban) &&
        !!fd.swift &&
        validSWIFT(fd.swift) &&
        !!fd.currency &&
        !!fd.bankName.trim() &&
        !!fd.bankAddress.trim()
      )
    }
  }, [accountType, bankAccountData, foreignAccountData])

  const handleSave = async () => {
    try {
      const input: UpdateBankInformationMutationVariables['input'] =
        accountType === 'icelandic'
          ? {
              bank: bankAccountData.bankNumber,
              ledger: bankAccountData.ledger,
              accountNumber: bankAccountData.accountNumber,
            }
          : (() => {
              const fd = foreignDataRef.current
              return {
                iban: fd.iban,
                swift: fd.swift,
                foreignBankName: fd.bankName,
                foreignBankAddress: fd.bankAddress,
                foreignCurrency: fd.currency,
              }
            })()

      const result = await updateBankInfo({
        variables: { input },
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
          <Box>
            <Text variant="h5" marginBottom={2}>
              {formatMessage(m.accountTypeTitle)}
            </Text>
            <Stack space={2}>
              <RadioButton
                id="account-type-icelandic"
                label={formatMessage(m.icelandicAccount)}
                name="accountType"
                value="icelandic"
                checked={accountType === 'icelandic'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAccountType('icelandic')
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

          {accountType === 'icelandic' && (
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
                onChange={handleForeignChange}
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
                  accountType === 'icelandic'
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
