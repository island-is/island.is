import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { additionalSupportForTheElderyFormMessage } from '../../../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/messages'
import { ReviewGroupProps } from './props'
import { getApplicationAnswers } from '../../../lib/additionalSupportForTheElderlyUtils'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/constants'
import { YES } from '@island.is/application/types'
import { getTaxLevelOption } from './utils'

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
    personalAllowance,
    personalAllowanceUsage,
    taxLevel,
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
              label={formatMessage(
                socialInsuranceAdministrationMessage.payment.bank,
              )}
              value={formatBankInfo(bank)}
            />
          </GridColumn>
        </GridRow>
      ) : (
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
              paddingBottom={[3, 3, 3, 0]}
            >
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.payment.bankName,
                )}
                value={bankName}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.payment.bankAddress,
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
              additionalSupportForTheElderyFormMessage.review.personalAllowance,
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
              label={formatMessage(
                additionalSupportForTheElderyFormMessage.review.ratio,
              )}
              value={`${personalAllowanceUsage}%`}
            />
          </GridColumn>
        )}
      </GridRow>

      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <DataValue
            label={formatMessage(
              additionalSupportForTheElderyFormMessage.review.taxLevel,
            )}
            value={formatMessage(getTaxLevelOption(taxLevel))}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
