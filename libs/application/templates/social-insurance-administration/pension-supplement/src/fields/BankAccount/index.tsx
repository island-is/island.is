import { FC, useState } from 'react'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { RadioFormField } from '@island.is/application/ui-fields'
import { useFormContext } from 'react-hook-form'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import { pensionSupplementFormMessage } from '../../lib/messages'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../lib/pensionSupplementUtils'
import {
  friendlyFormatSWIFT,
  getBankIsk,
  friendlyFormatIBAN,
} from '@island.is/application/templates/social-insurance-administration-core/socialInsuranceAdministrationUtils'
import isEmpty from 'lodash/isEmpty'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/constants'

export const BankAccount: FC<FieldBaseProps> = ({ application, field }) => {
  const { id } = field
  const {
    formState: { errors },
    setValue,
  } = useFormContext()
  const { formatMessage } = useLocale()

  const { bankAccountType } = getApplicationAnswers(application.answers)
  const { bankInfo } = getApplicationExternalData(
    application.externalData,
  )
  const currenciesOptions = [{ label: 'EUR', value: 'EUR' }] //useCurrencies(currencies)

  const [selectedBankAccountType, setSelectedBankAccountType] =
    useState<BankAccountType>(
      bankAccountType
        ? bankAccountType
        : !isEmpty(bankInfo)
        ? bankInfo.bank && bankInfo.ledger && bankInfo.accountNumber
          ? BankAccountType.ICELANDIC
          : BankAccountType.FOREIGN
        : BankAccountType.ICELANDIC,
    )

  const accountTypeFieldId = `${id}.bankAccountType`
  const bankFieldId = `${id}.bank`
  const ibanFieldId = `${id}.iban`
  const swiftFieldId = `${id}.swift`
  const bankNameFieldId = `${id}.bankName`
  const bankAddressFieldId = `${id}.bankAddress`
  const currencyFieldId = `${id}.currency`

  return (
    <Box marginTop={7}>
      <Box marginBottom={5}>
        <AlertMessage
          type="info"
          title={formatMessage(pensionSupplementFormMessage.shared.alertTitle)}
          message={
            <Box>
              <Box component="span" display="block">
                <Text variant="small">
                  <Markdown>
                    {formatText(
                      selectedBankAccountType === BankAccountType.ICELANDIC
                        ? pensionSupplementFormMessage.payment.alertMessage
                        : pensionSupplementFormMessage.payment
                            .alertMessageForeign,
                      application,
                      formatMessage,
                    )}
                  </Markdown>
                </Text>
              </Box>
            </Box>
          }
        />
      </Box>
      <RadioFormField
        error={errors && getErrorViaPath(errors, accountTypeFieldId)}
        field={{
          id: accountTypeFieldId,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          title: '',
          largeButtons: false,
          children: undefined,
          options: [
            {
              label: pensionSupplementFormMessage.payment.icelandicBankAccount,
              value: BankAccountType.ICELANDIC,
            },
            {
              label: pensionSupplementFormMessage.payment.foreignBankAccount,
              value: BankAccountType.FOREIGN,
            },
          ],
          onSelect: (type: BankAccountType) => {
            setSelectedBankAccountType(type)
            setValue(accountTypeFieldId, type)
          },
          defaultValue: selectedBankAccountType,
        }}
        application={application}
      />
      {selectedBankAccountType === BankAccountType.ICELANDIC ? (
        <InputController
          id={bankFieldId}
          placeholder="0000-00-000000"
          label={formatText(
            pensionSupplementFormMessage.payment.bank,
            application,
            formatMessage,
          )}
          error={errors && getErrorViaPath(errors, bankFieldId)}
          format="####-##-######"
          backgroundColor="blue"
          defaultValue={getBankIsk(bankInfo)}
        />
      ) : (
        <>
          <GridRow marginBottom={2}>
            <GridColumn span="1/1">
              <InputController
                id={ibanFieldId}
                placeholder="AB00 XXXX XXXX XXXX XXXX XX"
                label={formatText(
                  pensionSupplementFormMessage.payment.iban,
                  application,
                  formatMessage,
                )}
                error={errors && getErrorViaPath(errors, ibanFieldId)}
                onChange={(e) => {
                  const formattedIBAN = friendlyFormatIBAN(e.target.value)
                  setValue(ibanFieldId as string, formattedIBAN)
                }}
                backgroundColor="blue"
                defaultValue={friendlyFormatIBAN(bankInfo.iban)}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={swiftFieldId}
                placeholder="AAAA BB CC XXX"
                label={formatText(
                  pensionSupplementFormMessage.payment.swift,
                  application,
                  formatMessage,
                )}
                error={errors && getErrorViaPath(errors, swiftFieldId)}
                onChange={(e) => {
                  const formattedSWIFT = friendlyFormatSWIFT(e.target.value)
                  setValue(swiftFieldId as string, formattedSWIFT)
                }}
                backgroundColor="blue"
                defaultValue={friendlyFormatSWIFT(bankInfo.swift)}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <SelectController
                key={currencyFieldId}
                id={currencyFieldId}
                name={currencyFieldId}
                label={formatText(
                  pensionSupplementFormMessage.payment.currency,
                  application,
                  formatMessage,
                )}
                placeholder={formatMessage(
                  pensionSupplementFormMessage.payment.selectCurrency,
                )}
                defaultValue={!isEmpty(bankInfo) ? bankInfo.currency : ''}
                options={currenciesOptions}
                backgroundColor="blue"
                error={errors && getErrorViaPath(errors, currencyFieldId)}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={bankNameFieldId}
                label={formatText(
                  pensionSupplementFormMessage.payment.bankName,
                  application,
                  formatMessage,
                )}
                error={errors && getErrorViaPath(errors, bankNameFieldId)}
                backgroundColor="blue"
                defaultValue={
                  !isEmpty(bankInfo) ? bankInfo.foreignBankName : ''
                }
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={bankAddressFieldId}
                label={formatText(
                  pensionSupplementFormMessage.payment.bankAddress,
                  application,
                  formatMessage,
                )}
                error={errors && getErrorViaPath(errors, bankAddressFieldId)}
                backgroundColor="blue"
                defaultValue={
                  !isEmpty(bankInfo) ? bankInfo.foreignBankAddress : ''
                }
              />
            </GridColumn>
          </GridRow>
        </>
      )}
    </Box>
  )
}

export default BankAccount
