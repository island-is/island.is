import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
  formatBankInfo,
  handleServerError,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ProblemType,
  findProblemInApolloError,
} from '@island.is/shared/problem'
import { ReviewGroupProps } from './props'
import { useFormContext } from 'react-hook-form'
import {
  NO_PRIVATE_PENSION_FUND,
  NO_UNION,
  PARENTAL_LEAVE,
  YES,
} from '../../../constants'
import { getApplicationAnswers, parentalLeaveFormMessages } from '../../..'
import { useUnion as useUnionOptions } from '../../../hooks/useUnion'
import { usePrivatePensionFund as usePrivatePensionFundOptions } from '../../../hooks/usePrivatePensionFund'
import { usePensionFund as usePensionFundOptions } from '../../../hooks/usePensionFund'
import { getSelectOptionLabel } from '../../../lib/parentalLeaveClientUtils'

export const Payments = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, locale } = useLocale()
  const { getValues } = useFormContext()

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

  const [updateApplication] = useMutation(UPDATE_APPLICATION, {
    onError: (e) => {
      // We handle validation problems separately.
      const problem = findProblemInApolloError(e)
      if (problem?.type === ProblemType.VALIDATION_FAILED) {
        return
      }

      return handleServerError(e, formatMessage)
    },
  })

  const pensionFundOptions = usePensionFundOptions()
  const privatePensionFundOptions = usePrivatePensionFundOptions().filter(
    ({ value }) => value !== NO_PRIVATE_PENSION_FUND,
  )
  const unionOptions = useUnionOptions().filter(
    ({ value }) => value !== NO_UNION,
  )

  const saveApplication = async () => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            ...getValues(),
          },
        },
        locale,
      },
    })
  }

  return (
    <ReviewGroup
      saveAction={saveApplication}
      isEditable={editable}
      editAction={() => goToScreen?.('payments')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.shared.paymentInformationBank,
              )}
              value={formatBankInfo(bank)}
            />
          </GridColumn>
        </GridRow>
        {applicationType === PARENTAL_LEAVE && (
          <>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.salaryLabelPensionFund,
                  )}
                  value={getSelectOptionLabel(pensionFundOptions, pensionFund)}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.unionName,
                  )}
                  value={useUnion}
                />
              </GridColumn>
            </GridRow>

            {useUnion === YES && (
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.union,
                    )}
                    value={getSelectOptionLabel(unionOptions, union)}
                  />
                </GridColumn>
              </GridRow>
            )}

            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <RadioValue
                  label={formatMessage(
                    parentalLeaveFormMessages.shared.privatePensionFundName,
                  )}
                  value={usePrivatePensionFund}
                />
              </GridColumn>
            </GridRow>

            {usePrivatePensionFund === YES && (
              <GridRow>
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.privatePensionFund,
                    )}
                    value={getSelectOptionLabel(
                      privatePensionFundOptions,
                      privatePensionFund,
                    )}
                  />
                </GridColumn>

                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      parentalLeaveFormMessages.shared.privatePensionFundRatio,
                    )}
                    value={privatePensionFundPercentage}
                  />
                </GridColumn>
              </GridRow>
            )}
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
