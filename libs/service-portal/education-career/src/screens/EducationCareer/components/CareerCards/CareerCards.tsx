import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { Box, SkeletonLoader, Text } from '@island.is/island-ui/core'
import { Query } from '@island.is/api/schema'
import { EmptyState } from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ActionCard } from '@island.is/service-portal/core'
import { EducationStudentAssessmentPaths } from '@island.is/service-portal/education-student-assessment'

const EducationExamFamilyOverviewsQuery = gql`
  query EducationExamFamilyOverviewsQuery {
    educationExamFamilyOverviews {
      nationalId
      name
      isChild
      organizationType
      organizationName
      yearInterval
      familyIndex
    }
  }
`

const CareerCards = () => {
  useNamespaces('sp.education-career')
  const { data, loading } = useQuery<Query>(EducationExamFamilyOverviewsQuery)
  const { formatMessage } = useLocale()

  const educationExamFamilyOverviews = data?.educationExamFamilyOverviews || []
  if (loading) {
    return <LoadingTemplate />
  }
  return (
    <>
      {educationExamFamilyOverviews.map((member, index) => (
        <Box key={index} marginBottom={10}>
          <Text variant="h3" marginBottom={3}>
            {member.name}
            {member.isChild &&
              ` (${formatMessage({
                id: 'sp.education-career:child',
                defaultMessage: 'barn',
              })})`}
          </Text>
          <ActionCard
            cta={{
              label: formatMessage({
                id: 'sp.education-career:education-more',
                defaultMessage: 'Skoða nánar',
              }),
              url: EducationStudentAssessmentPaths.EducationStudentAssessment.replace(
                ':familyIndex',
                member.familyIndex.toString(),
              ),
              variant: 'text',
              size: 'small',
            }}
            tag={{
              label: member.organizationType,
              variant: 'purple',
              outlined: false,
            }}
            heading={member.organizationName}
            text={member.yearInterval}
          />
        </Box>
      ))}
      {educationExamFamilyOverviews.length === 0 && (
        <Box marginTop={[0, 8]}>
          <EmptyState
            title={defineMessage({
              id: 'sp.education-career:education-no-data',
              defaultMessage: 'Engin gögn fundust',
            })}
          />
        </Box>
      )}
    </>
  )
}

const LoadingTemplate = () => (
  <>
    <Box marginBottom={3}>
      <SkeletonLoader width={300} />
    </Box>
    <SkeletonLoader height={158} />
  </>
)

export default CareerCards
