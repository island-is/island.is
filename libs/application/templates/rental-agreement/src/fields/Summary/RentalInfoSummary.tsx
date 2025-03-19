import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { RentalAgreement } from '../../lib/dataSchema'
import {
  AnswerOptions,
  RentalPaymentMethodOptions,
  Routes,
  SecurityDepositTypeOptions,
  TRUE,
} from '../../lib/constants'
import {
  formatBankInfo,
  formatCurrency,
  formatDate,
  formatNationalId,
  getPaymentMethodOptions,
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
  getSecurityDepositTypeOptions,
} from '../../lib/utils'
import { SummaryCard } from './components/SummaryCard'
import { SummaryCardRow } from './components/SummaryCardRow'
import { KeyValue } from './components/KeyValue'
import { summary } from '../../lib/messages'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  rentalPeriodRoute?: Routes
  rentalAmountRoute?: Routes
  securityDepositRoute?: Routes
  hasChangeButton: boolean
}

export const RentalInfoSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const {
    application,
    goToScreen,
    rentalPeriodRoute,
    rentalAmountRoute,
    securityDepositRoute,
    hasChangeButton,
  } = props
  const answers = application.answers as RentalAgreement

  const isSecurityDepositRequired =
    answers.rentalAmount.isPaymentInsuranceRequired?.includes(AnswerOptions.YES)
  const isSecurityDepositType = answers.securityDeposit?.securityType

  const securityDepositType = (answer: string) => {
    const options = getSecurityDepositTypeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const paymentDate = (answer: string) => {
    const options = getRentalAmountPaymentDateOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const indexType = (answer: string) => {
    const options = getRentalAmountIndexTypes()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const paymentMethodType = (answer: string) => {
    const options = getPaymentMethodOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  return (
    <SummaryCard>
      {/* Property Address */}
      <SummaryCardRow hasChangeButton={false}>
        <GridColumn span={['12/12']}>
          {/* {answers.registerProperty.searchresults?.propertiesByStadfangNr && (
            // TODO: Add correct value */}
          <KeyValue
            // label={`${answers.registerProperty.searchresults.label}`}
            label={'Address'}
            value={'Krummahólar 2'}
            // value={
            //   `${formatMessage(summary.rentalPropertyIdPrefix)}${
            //     answers.registerProperty.searchresults
            //       .propertiesByStadfangNr[0]?.fasteign_nr
            //   }` || '-'
            // }
            labelVariant="h4"
            labelAs="h4"
            valueVariant="medium"
            valueAs="p"
          />
          {/* )} */}
        </GridColumn>
      </SummaryCardRow>

      {/* Rental period */}
      <SummaryCardRow
        editAction={goToScreen}
        route={rentalPeriodRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.rentalPeriodStartDateLabel}
            value={
              (answers.rentalPeriod.startDate &&
                formatDate(answers.rentalPeriod.startDate.toString())) ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={
              answers.rentalPeriod.isDefinite?.includes('true')
                ? summary.rentalPeriodEndDateLabel
                : summary.rentalPeriodDefiniteLabel
            }
            value={
              answers.rentalPeriod.isDefinite?.includes('true') &&
              answers.rentalPeriod.endDate
                ? formatDate(answers.rentalPeriod.endDate.toString())
                : summary.rentalPeriodDefiniteValue
            }
          />
        </GridColumn>
      </SummaryCardRow>

      {/* Rental amount */}
      <SummaryCardRow
        editAction={goToScreen}
        route={rentalAmountRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.rentalAmountLabel}
            value={
              (answers.rentalAmount.amount &&
                formatCurrency(answers.rentalAmount.amount)) ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.paymentDateOptionsLabel}
            value={
              paymentDate(answers.rentalAmount.paymentDateOptions as string) ||
              '-'
            }
          />
        </GridColumn>
        {answers.rentalAmount.isIndexConnected?.includes(TRUE) &&
          answers.rentalAmount.indexTypes && (
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.indexTypeLabel}
                value={indexType(answers.rentalAmount.indexTypes) || '-'}
              />
            </GridColumn>
          )}
      </SummaryCardRow>

      {/* Security deposit */}
      {isSecurityDepositRequired && (
        <SummaryCardRow
          editAction={goToScreen}
          route={securityDepositRoute}
          hasChangeButton={hasChangeButton}
        >
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityDepositLabel}
              value={answers.securityDeposit.securityAmountCalculated || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityTypeLabel}
              value={
                isSecurityDepositType
                  ? securityDepositType(
                      answers.securityDeposit.securityType as string,
                    )
                  : '-'
              }
            />
          </GridColumn>
          {answers.securityDeposit.securityType !==
            SecurityDepositTypeOptions.CAPITAL && (
            <GridColumn span={['12/12', '4/12']}>
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.BANK_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeInstitutionLabel}
                  value={answers.securityDeposit.bankGuaranteeInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeThirdPartyGuaranteeLabel}
                  value={answers.securityDeposit.thirdPartyGuaranteeInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.INSURANCE_COMPANY && (
                <KeyValue
                  label={summary.securityTypeInsuranceLabel}
                  value={answers.securityDeposit.insuranceCompanyInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND && (
                <KeyValue
                  label={summary.securityTypeMutualFundLabel}
                  value={answers.securityDeposit.mutualFundInfo || '-'}
                />
              )}
              {answers.securityDeposit.securityType ===
                SecurityDepositTypeOptions.OTHER && (
                <KeyValue
                  label={summary.securityTypeOtherLabel}
                  value={answers.securityDeposit.otherInfo || '-'}
                />
              )}
            </GridColumn>
          )}
        </SummaryCardRow>
      )}

      {/* Payment method */}
      <SummaryCardRow
        editAction={goToScreen}
        route={rentalAmountRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn
          span={
            answers.rentalAmount.paymentMethodOptions ===
            RentalPaymentMethodOptions.OTHER
              ? ['12/12']
              : ['12/12', '4/12']
          }
        >
          <KeyValue
            label={summary.paymentMethodTypeLabel}
            value={
              answers.rentalAmount.paymentMethodOptions ===
              RentalPaymentMethodOptions.OTHER
                ? answers.rentalAmount.paymentMethodOtherTextField || '-'
                : paymentMethodType(
                    answers.rentalAmount.paymentMethodOptions as string,
                  ) || '-'
            }
          />
        </GridColumn>
        {answers.rentalAmount.paymentMethodOptions ===
          RentalPaymentMethodOptions.BANK_TRANSFER && (
          <>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.paymentMethodNationalIdLabel}
                value={formatNationalId(
                  answers.rentalAmount.paymentMethodNationalId || '-',
                )}
              />
            </GridColumn>

            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.paymentMethodAccountLabel}
                value={formatBankInfo(
                  answers.rentalAmount.paymentMethodBankAccountNumber || '-',
                )}
              />
            </GridColumn>
          </>
        )}
      </SummaryCardRow>
    </SummaryCard>
  )
}
