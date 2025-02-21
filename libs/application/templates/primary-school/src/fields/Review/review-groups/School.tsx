import { useQuery } from '@apollo/client'
import { coreErrorMessages, YES } from '@island.is/application/core'
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
import { ApplicationType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getNeighbourhoodSchoolName,
} from '../../../lib/primarySchoolUtils'
import { FriggSchoolsByMunicipalityQuery } from '../../../types/schema'
import { ReviewGroupProps } from './props'

export const School = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()
  const {
    applicationType,
    expectedStartDate,
    selectedSchool,
    applyForNeighbourhoodSchool,
  } = getApplicationAnswers(application.answers)

  const { data, loading, error } = useQuery<FriggSchoolsByMunicipalityQuery>(
    friggSchoolsByMunicipalityQuery,
  )
  const selectedSchoolName = useMemo(() => {
    return data?.friggSchoolsByMunicipality
      ?.flatMap((municipality) => municipality.children)
      .find((school) => school?.id === selectedSchool)?.name
  }, [data, selectedSchool])

  let label = primarySchoolMessages.overview.selectedSchool
  let screen = 'newSchool'
  let schoolName = selectedSchoolName

  if (applyForNeighbourhoodSchool === YES) {
    label = primarySchoolMessages.overview.neighbourhoodSchool
    screen = 'school'
    schoolName = getNeighbourhoodSchoolName(application)
  }

  return (
    <ReviewGroup isEditable={editable} editAction={() => goToScreen?.(screen)}>
      <Stack space={2}>
        <GridRow>
          <GridColumn span="12/12">
            <Text variant="h3" as="h3">
              {formatMessage(primarySchoolMessages.overview.schoolTitle)}
            </Text>
          </GridColumn>
        </GridRow>
        {loading ? (
          <SkeletonLoader height={40} width="100%" borderRadius="large" />
        ) : (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(label)}
                value={schoolName || ''}
                error={
                  error
                    ? formatMessage(coreErrorMessages.failedDataProvider)
                    : undefined
                }
              />
            </GridColumn>

            {applicationType === ApplicationType.PRIMARY_SCHOOL && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(primarySchoolMessages.shared.date)}
                  value={formatDate(expectedStartDate)}
                />
              </GridColumn>
            )}
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
