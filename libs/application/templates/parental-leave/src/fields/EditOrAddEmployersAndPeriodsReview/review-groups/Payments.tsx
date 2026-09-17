import { Application } from '@island.is/application/types'
import {
  DataValue,
  ReviewGroup,
  formatBankInfo,
} from '@island.is/application/ui-components'
import { YES } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
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
  getChangeBaseline,
  getSelectOptionLabel,
  normalize,
} from '../../../lib/parentalLeaveUtils'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Payments: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
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

  const previous = getChangeBaseline(application.externalData)?.payments

  const hasChanges =
    !!previous &&
    (normalize(previous.bank) !== normalize(bank) ||
      normalize(previous.pensionFund) !== normalize(pensionFund) ||
      normalize(previous.useUnion) !== normalize(useUnion) ||
      normalize(previous.union) !== normalize(union) ||
      normalize(previous.usePrivatePensionFund) !==
        normalize(usePrivatePensionFund) ||
      normalize(previous.privatePensionFund) !==
        normalize(privatePensionFund) ||
      normalize(previous.privatePensionFundPercentage) !==
        normalize(privatePensionFundPercentage))

  const pensionFundOptions = usePensionFundOptions()
  const privatePensionFundOptions = usePrivatePensionFundOptions().filter(
    ({ value }) => value !== NO_PRIVATE_PENSION_FUND,
  )
  const unionOptions = useUnionOptions().filter(
    ({ value }) => value !== NO_UNION,
  )

  return (
    <ReviewGroup isEditable editAction={() => goToScreen?.('editPayments')}>
      <Box display="flex" alignItems="center" columnGap={1} marginBottom={3}>
        <Text variant="h3">
          {formatMessage(
            parentalLeaveFormMessages.shared.paymentInformationSubSection,
          )}
        </Text>
        <Tooltip
          text={formatMessage(
            parentalLeaveFormMessages.shared.paymentInformationName,
          )}
        />
        {hasChanges && (
          <Tag variant="purple">
            {formatMessage(
              parentalLeaveFormMessages.shared.changesMadeNoApprovalTag,
            )}
          </Tag>
        )}
      </Box>
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

export default Payments
