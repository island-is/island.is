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
import {
  formatGrade,
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentSchoolName,
} from '../../../lib/newPrimarySchoolUtils'
import { FriggSchoolsByMunicipalityQuery } from '../../../types/schema'
import { ReviewGroupProps } from './props'

export const CurrentSchool = ({
  application,
  goToScreen,
}: ReviewGroupProps) => {
  let isEditable = false

  const { formatMessage, lang } = useLocale()

  const { childGradeLevel, primaryOrgId } = getApplicationExternalData(
    application.externalData,
  )

  const { currentSchoolId } = getApplicationAnswers(application.answers)

  const { data, loading, error } = useQuery<FriggSchoolsByMunicipalityQuery>(
    friggSchoolsByMunicipalityQuery,
  )
  const selectedSchoolName = useMemo(() => {
    return data?.friggSchoolsByMunicipality
      ?.flatMap((m) => m.managing ?? [])
      .find((school) => school?.id === currentSchoolId)?.name
  }, [data, currentSchoolId])

  //If the primaryOrgId doesn't exists it means Frigg doesn't have the data
  if (!primaryOrgId) {
    isEditable = true
  }

  return (
    <ReviewGroup
      isEditable={isEditable}
      editAction={() => goToScreen?.('currentSchool')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span="10/12">
            <Text variant="h3" as="h3">
              {formatMessage(
                newPrimarySchoolMessages.primarySchool
                  .currentSchoolSubSectionTitle,
              )}
            </Text>
          </GridColumn>
        </GridRow>
        {loading ? (
          <SkeletonLoader height={40} width="100%" borderRadius="large" />
        ) : (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.primarySchool.currentSchool,
                )}
                value={getCurrentSchoolName(application) || selectedSchoolName}
                error={
                  error
                    ? formatMessage(coreErrorMessages.failedDataProvider)
                    : undefined
                }
              />
            </GridColumn>
            {primaryOrgId && (
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.primarySchool.grade,
                  )}
                  value={formatMessage(
                    newPrimarySchoolMessages.primarySchool.currentGrade,
                    {
                      grade: formatGrade(childGradeLevel, lang),
                    },
                  )}
                />
              </GridColumn>
            )}
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
