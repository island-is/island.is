import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getTaxLevelOption } from './utils'
import { getApplicationAnswers } from '../../../lib/oldAgePensionUtils'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/constants'
import { YES } from '@island.is/application/types'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/messages'

export const PaymentInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const {
    taxLevel,
    personalAllowance,
    personalAllowanceUsage,
    bank,
    bankAccountType,
    iban,
    swift,
    bankName,
    bankAddress,
    currency,
  } = getApplicationAnswers(application.answers)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('paymentInfo')}
    >
      {bankAccountType === BankAccountType.FOREIGN ? (
        <>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.payment.iban,
                )}
                value={iban}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.payment.swift,
                )}
                value={swift}
              />
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.payment.currency,
                )}
                value={currency}
              />
            </GridColumn>
          </GridRow>

          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.payment.bankName,
                )}
                value={bankName}
              />
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.payment.bankAddress,
                )}
                value={bankAddress}
              />
            </GridColumn>
          </GridRow>
        </>
      ) : (
        <GridRow marginBottom={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                socialInsuranceAdministrationMessage.payment.bank,
              )}
              value={formatBankInfo(bank)}
            />
          </GridColumn>
        </GridRow>
      )}

      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          paddingBottom={3}
        >
          <RadioValue
            label={formatMessage(
              oldAgePensionFormMessage.review.personalAllowance,
            )}
            value={personalAllowance}
          />
        </GridColumn>

        {personalAllowance === YES && (
          <GridColumn
            span={['12/12', '12/12', '12/12', '5/12']}
            paddingBottom={3}
          >
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.ratio)}
              value={`${personalAllowanceUsage}%`}
            />
          </GridColumn>
        )}
      </GridRow>

      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.payment.taxLevel)}
            value={formatMessage(getTaxLevelOption(taxLevel))}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
