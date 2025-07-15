import { useQuery } from '@apollo/client'
import { coreErrorMessages } from '@island.is/application/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMemo } from 'react'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { FriggSchoolsByMunicipalityQuery } from '../../../types/schema'
import { ReviewGroupProps } from './props'

export const CurrentNursery = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const { currentNursery } = getApplicationAnswers(application.answers)

  const { data, loading, error } = useQuery<FriggSchoolsByMunicipalityQuery>(
    friggSchoolsByMunicipalityQuery,
  )
  const currentNurseryName = useMemo(() => {
    return data?.friggSchoolsByMunicipality
      ?.flatMap((municipality) => municipality.managing)
      .find((nursery) => nursery?.id === currentNursery)?.name
  }, [data, currentNursery])

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('currentNursery')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span="10/12">
            <Text variant="h3" as="h3">
              {formatMessage(
                newPrimarySchoolMessages.primarySchool
                  .currentNurserySubSectionTitle,
              )}
            </Text>
          </GridColumn>
        </GridRow>
        {loading ? (
          <SkeletonLoader height={40} width="100%" borderRadius="large" />
        ) : (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.overview.currentNursery,
                )}
                value={currentNurseryName}
                error={
                  error
                    ? formatMessage(coreErrorMessages.failedDataProvider)
                    : undefined
                }
              />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
