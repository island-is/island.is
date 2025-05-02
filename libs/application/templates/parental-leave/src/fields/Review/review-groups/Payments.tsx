import {
  DataValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  PARENTAL_LEAVE,
} from '../../../constants'
import { usePensionFund as usePensionFundOptions } from '../../../hooks/usePensionFund'
import { usePrivatePensionFund as usePrivatePensionFundOptions } from '../../../hooks/usePrivatePensionFund'
import { useUnion as useUnionOptions } from '../../../hooks/useUnion'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectOptionLabel,
} from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'
import { YES } from '@island.is/application/core'

export const Payments = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const {
    applicationType,
    pensionFund,
    useUnion,
    union,
    usePrivatePensionFund,
    privatePensionFund,
    privatePensionFundPercentage,
    bank,
  } = getApplicationAnswers(application.answers)

  const pensionFundOptions = usePensionFundOptions()
  const privatePensionFundOptions = usePrivatePensionFundOptions().filter(
    ({ value }) => value !== NO_PRIVATE_PENSION_FUND,
  )
  const unionOptions = useUnionOptions().filter(
    ({ value }) => value !== NO_UNION,
  )

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('payments')}
    >
      {applicationType === PARENTAL_LEAVE ? (
        <Stack space={2}>
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.paymentInformationBank,
                )}
                value={formatBankInfo(bank) ?? ''}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.shared.salaryLabelPensionFund,
                )}
                value={
                  getSelectOptionLabel(pensionFundOptions, pensionFund) ?? ''
                }
              />
            </GridColumn>
          </GridRow>
          {(useUnion === YES || usePrivatePensionFund === YES) && (
            <GridRow rowGap={2}>
              {useUnion === YES && (
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.union,
                    )}
                    value={getSelectOptionLabel(unionOptions, union) ?? ''}
                  />
                </GridColumn>
              )}
              {usePrivatePensionFund === YES && (
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.privatePensionFund,
                    )}
                    value={`${getSelectOptionLabel(
                      privatePensionFundOptions,
                      privatePensionFund,
                    )} ${privatePensionFundPercentage}%`}
                  />
                </GridColumn>
              )}
            </GridRow>
          )}
        </Stack>
      ) : (
        <DataValue
          label={formatMessage(
            parentalLeaveFormMessages.shared.paymentInformationBank,
          )}
          value={formatBankInfo(bank) ?? ''}
        />
      )}
    </ReviewGroup>
  )
}
