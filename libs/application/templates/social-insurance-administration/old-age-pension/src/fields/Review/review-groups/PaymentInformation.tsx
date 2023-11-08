import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getApplicationExternalData,
  friendlyFormatSWIFT,
} from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { getTaxLevelOption } from './utils'
import { YES, BankAccountType } from '../../../lib/constants'
import * as ibantools from 'ibantools'

export const PaymentInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const [
    {
      taxLevel,
      personalAllowance,
      spouseAllowance,
      personalAllowanceUsage,
      spouseAllowanceUsage,
      bank,
      bankAccountType,
      iban,
      swift,
      bankName,
      bankAddress,
      currency,
    },
  ] = useStatefulAnswers(application)

  const { hasSpouse } = getApplicationExternalData(application.externalData)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('paymentInfo')}
    >
      {bankAccountType === BankAccountType.ICELANDIC ? (
        <GridRow marginBottom={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.bank)}
              value={formatBankInfo(bank)}
            />
          </GridColumn>
        </GridRow>
      ) : (
        <>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(oldAgePensionFormMessage.payment.iban)}
                value={ibantools.friendlyFormatIBAN(iban)}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(oldAgePensionFormMessage.payment.swift)}
                value={friendlyFormatSWIFT(swift)}
              />
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(oldAgePensionFormMessage.payment.currency)}
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
                label={formatMessage(oldAgePensionFormMessage.payment.bankName)}
                value={bankName}
              />
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(
                  oldAgePensionFormMessage.payment.bankAddress,
                )}
                value={bankAddress}
              />
            </GridColumn>
          </GridRow>
        </>
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

      {hasSpouse && (
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '5/12']}
            paddingBottom={3}
          >
            <RadioValue
              label={formatMessage(
                oldAgePensionFormMessage.review.spouseAllowance,
              )}
              value={spouseAllowance}
            />
          </GridColumn>

          {spouseAllowance === YES && (
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={3}
            >
              <DataValue
                label={formatMessage(oldAgePensionFormMessage.review.ratio)}
                value={`${spouseAllowanceUsage}%`}
              />
            </GridColumn>
          )}
        </GridRow>
      )}

      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.taxLevel)}
            value={formatMessage(getTaxLevelOption(taxLevel))}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
