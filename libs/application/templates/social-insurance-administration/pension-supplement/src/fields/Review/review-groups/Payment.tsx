import {
  DataValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { pensionSupplementFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/pensionSupplementUtils'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/constants'

export const Payment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const {
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
      {bankAccountType === BankAccountType.ICELANDIC ? (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(pensionSupplementFormMessage.payment.bank)}
              value={formatBankInfo(bank)}
            />
          </GridColumn>
        </GridRow>
      ) : (
        <>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
              <DataValue
                label={formatMessage(pensionSupplementFormMessage.payment.iban)}
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
                  pensionSupplementFormMessage.payment.swift,
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
                  pensionSupplementFormMessage.payment.currency,
                )}
                value={currency}
              />
            </GridColumn>
          </GridRow>

          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '5/12']}
              paddingBottom={[3, 3, 3, 0]}
            >
              <DataValue
                label={formatMessage(
                  pensionSupplementFormMessage.payment.bankName,
                )}
                value={bankName}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  pensionSupplementFormMessage.payment.bankAddress,
                )}
                value={bankAddress}
              />
            </GridColumn>
          </GridRow>
        </>
      )}
    </ReviewGroup>
  )
}
