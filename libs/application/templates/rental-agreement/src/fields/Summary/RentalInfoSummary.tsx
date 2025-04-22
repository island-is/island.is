import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, FormValue } from '@island.is/application/types'
import {
  AnswerOptions,
  RentalPaymentMethodOptions,
  Routes,
  SecurityDepositTypeOptions,
  TRUE,
} from '../../utils/constants'
import {
  formatBankInfo,
  formatCurrency,
  formatDate,
  formatNationalId,
  getPaymentMethodOptions,
  getRentalAmountIndexTypes,
  getRentalAmountPaymentDateOptions,
  getSecurityDepositTypeOptions,
} from '../../utils/utils'
import { SummaryCard } from './components/SummaryCard'
import { SummaryCardRow } from './components/SummaryCardRow'
import { KeyValue } from './components/KeyValue'
import { summary } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { AddressProps } from '../PropertySearch'

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
  const { answers } = application

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

  const paymentInsuranceRequired = getValueViaPath<AnswerOptions>(
    answers,
    'rentalAmount.isPaymentInsuranceRequired',
  )
  const isSecurityDepositType = getValueViaPath<SecurityDepositTypeOptions>(
    answers,
    'securityDeposit.securityType',
  )
  const searchResults = getValueViaPath<AddressProps>(
    answers,
    'registerProperty.searchresults',
  )
  const searchResultUnits = getValueViaPath<FormValue[]>(
    answers,
    'registerProperty.searchresults.units',
  )
  const startDate = getValueViaPath<string>(answers, 'rentalPeriod.startDate')
  const endDate = getValueViaPath<string>(answers, 'rentalPeriod.endDate')
  const isDefinite = getValueViaPath<string>(answers, 'rentalPeriod.isDefinite')
  const rentalAmount = getValueViaPath<string>(answers, 'rentalAmount.amount')
  const paymentDateOptions = getValueViaPath<string>(
    answers,
    'rentalAmount.paymentDateOptions',
  )
  const paymentMethodOptions = getValueViaPath<RentalPaymentMethodOptions>(
    answers,
    'rentalAmount.paymentMethodOptions',
  )
  const paymentMethodNationalId = getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodNationalId',
  )
  const paymentMethodAccountNumber = getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodBankAccountNumber',
  )
  const paymentMethodOtherTextField = getValueViaPath<string>(
    answers,
    'rentalAmount.paymentMethodOtherTextField',
  )
  const indexConnected = getValueViaPath<AnswerOptions>(
    answers,
    'rentalAmount.isIndexConnected',
  )
  const indexTypes = getValueViaPath<string>(answers, 'rentalAmount.indexTypes')
  const securityAmountCalculated = getValueViaPath<string>(
    answers,
    'securityDeposit.securityAmountCalculated',
  )
  const securityType = getValueViaPath<SecurityDepositTypeOptions>(
    answers,
    'securityDeposit.securityType',
  )

  return (
    <SummaryCard>
      {/* Property Address */}
      <SummaryCardRow hasChangeButton={false}>
        <GridColumn span={['12/12']}>
          {searchResults?.label && (
            <KeyValue
              label={`${searchResults.label}`}
              value={
                `${formatMessage(summary.rentalPropertyIdPrefix)}${[
                  ...new Set(
                    searchResultUnits?.map((unit) => 'F' + unit.propertyCode),
                  ),
                ].join(', ')}` || '-'
              }
              labelVariant="h4"
              labelAs="h4"
              valueVariant="medium"
              valueAs="p"
            />
          )}
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
            value={(startDate && formatDate(startDate.toString())) || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={
              isDefinite?.includes(TRUE)
                ? summary.rentalPeriodEndDateLabel
                : summary.rentalPeriodDefiniteLabel
            }
            value={
              isDefinite?.includes(TRUE) && endDate
                ? formatDate(endDate.toString())
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
            value={(rentalAmount && formatCurrency(rentalAmount)) || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.paymentDateOptionsLabel}
            value={paymentDate(paymentDateOptions || '') || '-'}
          />
        </GridColumn>
        {indexConnected?.includes(TRUE) && indexTypes && (
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.indexTypeLabel}
              value={indexType(indexTypes) || '-'}
            />
          </GridColumn>
        )}
      </SummaryCardRow>
      {/* Security deposit */}
      {paymentInsuranceRequired?.includes(AnswerOptions.YES) && (
        <SummaryCardRow
          editAction={goToScreen}
          route={securityDepositRoute}
          hasChangeButton={hasChangeButton}
        >
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityDepositLabel}
              value={formatCurrency(securityAmountCalculated || '') || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityTypeLabel}
              value={
                isSecurityDepositType
                  ? securityDepositType(securityType || '')
                  : '-'
              }
            />
          </GridColumn>
          {securityType !== SecurityDepositTypeOptions.CAPITAL && (
            <GridColumn span={['12/12', '4/12']}>
              {securityType === SecurityDepositTypeOptions.BANK_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeInstitutionLabel}
                  value={
                    getValueViaPath(
                      answers,
                      'securityDeposit.bankGuaranteeInfo',
                      '',
                    ) || '-'
                  }
                />
              )}
              {securityType ===
                SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeThirdPartyGuaranteeLabel}
                  value={
                    getValueViaPath(
                      answers,
                      'securityDeposit.thirdPartyGuaranteeInfo',
                      '',
                    ) || '-'
                  }
                />
              )}
              {securityType ===
                SecurityDepositTypeOptions.INSURANCE_COMPANY && (
                <KeyValue
                  label={summary.securityTypeInsuranceLabel}
                  value={
                    getValueViaPath(
                      answers,
                      'securityDeposit.insuranceCompanyInfo',
                      '',
                    ) || '-'
                  }
                />
              )}
              {securityType ===
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND && (
                <KeyValue
                  label={summary.securityTypeMutualFundLabel}
                  value={
                    getValueViaPath(
                      answers,
                      'securityDeposit.mutualFundInfo',
                      '',
                    ) || '-'
                  }
                />
              )}
              {securityType === SecurityDepositTypeOptions.OTHER && (
                <KeyValue
                  label={summary.securityTypeOtherLabel}
                  value={
                    getValueViaPath(answers, 'securityDeposit.otherInfo', '') ||
                    '-'
                  }
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
            paymentMethodOptions === RentalPaymentMethodOptions.OTHER
              ? ['12/12']
              : ['12/12', '4/12']
          }
        >
          <KeyValue
            label={summary.paymentMethodTypeLabel}
            value={
              paymentMethodOptions === RentalPaymentMethodOptions.OTHER
                ? paymentMethodOtherTextField || '-'
                : paymentMethodType(paymentMethodOptions || '') || '-'
            }
          />
        </GridColumn>
        {paymentMethodOptions === RentalPaymentMethodOptions.BANK_TRANSFER && (
          <>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.paymentMethodNationalIdLabel}
                value={formatNationalId(paymentMethodNationalId || '-')}
              />
            </GridColumn>

            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.paymentMethodAccountLabel}
                value={formatBankInfo(paymentMethodAccountNumber || '-')}
              />
            </GridColumn>
          </>
        )}
      </SummaryCardRow>
    </SummaryCard>
  )
}
