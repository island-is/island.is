import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { YesOrNoEnum } from '@island.is/application/core'
import { applicationAnswers } from '../../shared'
import {
  formatBankInfo,
  formatCurrency,
  formatDate,
  formatNationalId,
  getPaymentMethodOptions,
  getRentalAmountPaymentDateOptions,
  getSecurityDepositTypeOptions,
} from '../../utils/utils'
import {
  Routes,
  RentalPaymentMethodOptions,
  SecurityDepositTypeOptions,
} from '../../utils/enums'
import { getOptionLabel } from '../../utils/summaryUtils'
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
  const { answers } = application

  const {
    securityDepositRequired,
    searchResults,
    units,
    startDate,
    endDate,
    isDefinite,
    rentalAmount,
    paymentDay,
    paymentMethod,
    nationalIdOfAccountOwner,
    bankAccountNumber,
    paymentMethodOther,
    isIndexConnected,
    indexRate,
    securityAmountCalculated,
    securityDepositAmountOther,
    securityDepositType,
    bankGuaranteeInfo,
    thirdPartyGuaranteeInfo,
    insuranceCompanyInfo,
    landlordsMutualFundInfo,
    otherInfo,
  } = applicationAnswers(answers)

  const securityAmount = securityDepositAmountOther
    ? securityDepositAmountOther
    : securityAmountCalculated

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
                  ...new Set(units?.map((unit) => `F${unit.propertyCode}`)),
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
              isDefinite?.includes(YesOrNoEnum.YES)
                ? summary.rentalPeriodEndDateLabel
                : summary.rentalPeriodDefiniteLabel
            }
            value={
              isDefinite?.includes(YesOrNoEnum.YES) && endDate
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
        {isIndexConnected?.includes(YesOrNoEnum.YES) &&
          indexRate !== undefined &&
          indexRate !== null && (
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.indexRateLabel}
                value={indexRate.toString()}
              />
            </GridColumn>
          )}
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.paymentDateOptionsLabel}
            value={getOptionLabel(
              paymentDay || '',
              getRentalAmountPaymentDateOptions,
              '',
            )}
          />
        </GridColumn>
      </SummaryCardRow>
      {/* Security deposit */}
      {securityDepositRequired?.includes(YesOrNoEnum.YES) && (
        <SummaryCardRow
          editAction={goToScreen}
          route={securityDepositRoute}
          hasChangeButton={hasChangeButton}
        >
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityDepositLabel}
              value={formatCurrency(securityAmount || '') || '-'}
            />
          </GridColumn>
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.securityTypeLabel}
              value={getOptionLabel(
                securityDepositType || '',
                getSecurityDepositTypeOptions,
                '',
              )}
            />
          </GridColumn>
          {securityDepositType !== SecurityDepositTypeOptions.CAPITAL && (
            <GridColumn span={['12/12', '4/12']}>
              {securityDepositType ===
                SecurityDepositTypeOptions.BANK_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeInstitutionLabel}
                  value={bankGuaranteeInfo || '-'}
                />
              )}
              {securityDepositType ===
                SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeThirdPartyGuaranteeLabel}
                  value={thirdPartyGuaranteeInfo || '-'}
                />
              )}
              {securityDepositType ===
                SecurityDepositTypeOptions.INSURANCE_COMPANY && (
                <KeyValue
                  label={summary.securityTypeInsuranceLabel}
                  value={insuranceCompanyInfo || '-'}
                />
              )}
              {securityDepositType ===
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND && (
                <KeyValue
                  label={summary.securityTypeMutualFundLabel}
                  value={landlordsMutualFundInfo || '-'}
                />
              )}
              {securityDepositType === SecurityDepositTypeOptions.OTHER && (
                <KeyValue
                  label={summary.securityTypeOtherLabel}
                  value={otherInfo || '-'}
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
            paymentMethod === RentalPaymentMethodOptions.OTHER
              ? ['12/12']
              : ['12/12', '4/12']
          }
        >
          <KeyValue
            label={summary.paymentMethodTypeLabel}
            value={
              paymentMethod === RentalPaymentMethodOptions.OTHER
                ? paymentMethodOther || '-'
                : getOptionLabel(
                    paymentMethod || '',
                    getPaymentMethodOptions,
                    '',
                  )
            }
          />
        </GridColumn>
        {paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER && (
          <>
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.paymentMethodNationalIdLabel}
                value={formatNationalId(nationalIdOfAccountOwner || '-')}
              />
            </GridColumn>

            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.paymentMethodAccountLabel}
                value={formatBankInfo(bankAccountNumber || '-')}
              />
            </GridColumn>
          </>
        )}
      </SummaryCardRow>
    </SummaryCard>
  )
}
