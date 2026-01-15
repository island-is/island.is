import React from 'react'
import { gql, useQuery } from '@apollo/client'

import {
  Box,
  SkeletonLoader,
  Text,
  ActionCard,
} from '@island.is/island-ui/core'
import { Query } from '@island.is/api/schema'
import { m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { EducationStudentAssessmentPaths } from '@island.is/portals/my-pages/education-student-assessment'
import { Problem } from '@island.is/react-spa/shared'
import { useNavigate } from 'react-router-dom'

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
  const { data, loading, error } = useQuery<Query>(
    EducationExamFamilyOverviewsQuery,
  )
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const educationExamFamilyOverviews = data?.educationExamFamilyOverviews || []

  if (error && !loading) {
    return <Problem error={error} noBorder={false} />
  }
  if (!error && !loading && !educationExamFamilyOverviews.length) {
    return (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(m.noData)}
        message={formatMessage(m.noDataFoundDetail)}
        imgSrc="./assets/images/sofa.svg"
      />
    )
  }
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
              onClick: () =>
                navigate(
                  EducationStudentAssessmentPaths.EducationStudentAssessment.replace(
                    ':familyIndex',
                    member.familyIndex.toString(),
                  ),
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
