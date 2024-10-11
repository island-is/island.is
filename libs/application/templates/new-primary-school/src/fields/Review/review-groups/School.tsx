import { useQuery } from '@apollo/client'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { friggSchoolsByMunicipalityQuery } from '../../../graphql/queries'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentSchoolName,
} from '../../../lib/newPrimarySchoolUtils'
import { FriggSchoolsByMunicipalityQuery } from '../../../types/schema'
import { ReviewGroupProps } from './props'
import { useMemo } from 'react'

export const School = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate, lang } = useLocale()
  const { startDate, selectedSchool } = getApplicationAnswers(
    application.answers,
  )
  const { childGradeLevel } = getApplicationExternalData(
    application.externalData,
  )

  const { data, loading } = useQuery<FriggSchoolsByMunicipalityQuery>(
    friggSchoolsByMunicipalityQuery,
  )
  const selectedSchoolName = useMemo(() => {
    return data?.friggSchoolsByMunicipality
      ?.flatMap((municipality) => municipality.children)
      .find((school) => school?.id === selectedSchool)?.name
  }, [data, selectedSchool])

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('school')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Text variant="h3" as="h3">
              {formatMessage(newPrimarySchoolMessages.overview.schoolTitle)}
            </Text>
          </GridColumn>
        </GridRow>

        {loading ? (
          <SkeletonLoader height={40} width="100%" borderRadius="large" />
        ) : (
          <>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.overview.currentSchool,
                  )}
                  value={getCurrentSchoolName(application)}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.overview.selectedSchool,
                  )}
                  value={selectedSchoolName || ''}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.overview.grade)}
                  value={formatMessage(
                    newPrimarySchoolMessages.overview.currentGrade,
                    {
                      grade: formatGrade(childGradeLevel, lang),
                    },
                  )}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.shared.date)}
                  value={formatDate(startDate)}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
