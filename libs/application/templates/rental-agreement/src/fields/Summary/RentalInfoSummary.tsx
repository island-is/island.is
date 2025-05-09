import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { YesOrNoEnum } from '@island.is/application/core'
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
import {
  Routes,
  RentalPaymentMethodOptions,
  SecurityDepositTypeOptions,
} from '../../utils/enums'
import { extractRentalInfoData, getOptionLabel } from '../../utils/summaryUtils'
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
    searchResultUnits,
    startDate,
    endDate,
    isDefinite,
    rentalAmount,
    paymentDateOptions,
    paymentMethodOptions,
    paymentMethodNationalId,
    paymentMethodAccountNumber,
    paymentMethodOtherTextField,
    indexConnected,
    indexTypes,
    securityAmountCalculated,
    securityAmountOther,
    securityType,
    bankGuaranteeInfo,
    thirdPartyGuaranteeInfo,
    insuranceCompanyInfo,
    mutualFundInfo,
    otherInfo,
  } = extractRentalInfoData(answers)

  const securityAmount = securityAmountOther
    ? securityAmountOther
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
                  ...new Set(
                    searchResultUnits?.map((unit) => `F${unit.propertyCode}`),
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
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.paymentDateOptionsLabel}
            value={getOptionLabel(
              paymentDateOptions || '',
              getRentalAmountPaymentDateOptions,
              '',
            )}
          />
        </GridColumn>
        {indexConnected?.includes(YesOrNoEnum.YES) && indexTypes && (
          <GridColumn span={['12/12', '4/12']}>
            <KeyValue
              label={summary.indexTypeLabel}
              value={getOptionLabel(
                indexTypes || '',
                getRentalAmountIndexTypes,
                '',
              )}
            />
          </GridColumn>
        )}
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
                securityType || '',
                getSecurityDepositTypeOptions,
                '',
              )}
            />
          </GridColumn>
          {securityType !== SecurityDepositTypeOptions.CAPITAL && (
            <GridColumn span={['12/12', '4/12']}>
              {securityType === SecurityDepositTypeOptions.BANK_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeInstitutionLabel}
                  value={bankGuaranteeInfo || '-'}
                />
              )}
              {securityType ===
                SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE && (
                <KeyValue
                  label={summary.securityTypeThirdPartyGuaranteeLabel}
                  value={thirdPartyGuaranteeInfo || '-'}
                />
              )}
              {securityType ===
                SecurityDepositTypeOptions.INSURANCE_COMPANY && (
                <KeyValue
                  label={summary.securityTypeInsuranceLabel}
                  value={insuranceCompanyInfo || '-'}
                />
              )}
              {securityType ===
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND && (
                <KeyValue
                  label={summary.securityTypeMutualFundLabel}
                  value={mutualFundInfo || '-'}
                />
              )}
              {securityType === SecurityDepositTypeOptions.OTHER && (
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
                : getOptionLabel(
                    paymentMethodOptions || '',
                    getPaymentMethodOptions,
                    '',
                  )
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
