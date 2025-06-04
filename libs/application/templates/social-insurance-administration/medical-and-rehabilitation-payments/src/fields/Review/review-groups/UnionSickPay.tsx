import { useQuery } from '@apollo/client'
import { coreErrorMessages } from '@island.is/application/core'
import { siaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/graphql/queries'
import { SiaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/types/schema'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMemo } from 'react'
import { NOT_APPLICABLE } from '../../../lib/constants'
import {
  getApplicationAnswers,
  getSickPayEndDateLabel,
  getYesNoNotApplicableTranslation,
} from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'

export const UnionSickPay = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()

  const {
    hasUtilizedUnionSickPayRights,
    unionSickPayEndDate,
    unionNationalId,
  } = getApplicationAnswers(application.answers)

  const { data, loading, error } = useQuery<SiaUnionsQuery>(siaUnionsQuery)
  const unionName = useMemo(() => {
    return data?.siaGetUnions.find(
      (union) => union?.nationalId === unionNationalId,
    )?.name
  }, [data, unionNationalId])

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('unionSickPay')}
    >
      <Stack space={3}>
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '12/12']}>
            <DataValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .unionSickPayTitle,
              )}
              value={formatMessage(
                getYesNoNotApplicableTranslation(hasUtilizedUnionSickPayRights),
              )}
            />
          </GridColumn>
        </GridRow>
        {hasUtilizedUnionSickPayRights !== NOT_APPLICABLE &&
          (loading ? (
            <SkeletonLoader height={40} width="100%" borderRadius="large" />
          ) : (
            <GridRow rowGap={3}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    medicalAndRehabilitationPaymentsFormMessage
                      .generalInformation.unionSickPayUnionSelectTitle,
                  )}
                  value={unionName}
                  error={
                    error
                      ? formatMessage(coreErrorMessages.failedDataProvider)
                      : undefined
                  }
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    getSickPayEndDateLabel(hasUtilizedUnionSickPayRights),
                  )}
                  value={formatDate(unionSickPayEndDate)}
                />
              </GridColumn>
            </GridRow>
          ))}
      </Stack>
    </ReviewGroup>
  )
}
