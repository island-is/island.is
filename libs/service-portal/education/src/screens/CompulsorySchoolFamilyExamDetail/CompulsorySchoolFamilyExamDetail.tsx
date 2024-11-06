import { IntroHeader, m } from '@island.is/service-portal/core'
import { compulsorySchoolMessages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { Box, Text, Table as T } from '@island.is/island-ui/core'
import { useParams } from 'react-router-dom'
import { useUserFamilyMemberExamResultsQuery } from './CompulsorySchoolFamilyExamDetail.generated'
import React from 'react'
import { isDefined } from '@island.is/shared/utils'

type UseParams = {
  id: string
}

export const CompulsorySchoolFamilyExamOverview = () => {
  useNamespaces('sp.education-student-assessment')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useUserFamilyMemberExamResultsQuery({
    variables: {
      input: {
        maskedId: id,
      },
    },
  })

  return (
    <>
      <IntroHeader
        title={formatMessage(compulsorySchoolMessages.assessment)}
        intro={formatMessage(
          compulsorySchoolMessages.studentAssessmentIntroText,
        )}
        serviceProviderSlug={'menntamalastofnun'}
        serviceProviderTooltip={formatMessage(m.mmsTooltip)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !data?.userFamilyMemberExamResults && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error &&
        !loading &&
        data?.userFamilyMemberExamResults?.examResults?.map(
          (studentAssessment, index) => (
            <Box key={index} marginBottom={7}>
              <Text variant="h4" as="h2" marginBottom={3}>
                Samræmd könnunarpróf {studentAssessment.gradeLevel}. bekkur
              </Text>
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData>Námsgrein</T.HeadData>
                    <T.HeadData>Vægi</T.HeadData>
                    <T.HeadData>Grunnskólaeinkunn</T.HeadData>
                    <T.HeadData>Raðeinkunn</T.HeadData>
                    <T.HeadData>Hæfnieinkunn</T.HeadData>
                    <T.HeadData>Staða</T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {studentAssessment.coursesExamResults?.map(
                    (studentAssessment, index) => {
                      return (
                        <React.Fragment key={index}>
                          <T.Row>
                            <T.Data>
                              <Text variant="h5">
                                {studentAssessment.label}
                              </Text>
                            </T.Data>
                            <T.Data />
                            <T.Data>
                              <Text variant="h5">
                                {
                                  studentAssessment.totalGrade
                                    ?.compulsorySchoolGrade?.grade
                                }
                              </Text>
                            </T.Data>
                            <T.Data>
                              <Text variant="h5">
                                {
                                  studentAssessment.totalGrade?.serialGrade
                                    ?.grade
                                }
                              </Text>
                            </T.Data>
                            <T.Data>
                              <Text variant="h5">
                                {studentAssessment.competence.competencyGrade}
                              </Text>
                            </T.Data>
                            <T.Data>
                              <Text variant="h5">
                                {studentAssessment.competence.competenceStatus}
                              </Text>
                            </T.Data>
                          </T.Row>
                          {studentAssessment.gradeCategories
                            ?.map((grade, index) => {
                              if (
                                grade.__typename ===
                                'EducationCompulsorySchoolGradeCategoryWeighted'
                              ) {
                                return (
                                  <T.Row key={index}>
                                    <T.Data>{grade.label}</T.Data>
                                    <T.Data>
                                      {`(${grade.grade.compulsorySchoolGrade.weight}%)`}
                                    </T.Data>
                                    <T.Data>
                                      {grade.grade.compulsorySchoolGrade?.grade}
                                    </T.Data>
                                    <T.Data>
                                      {grade.grade.serialGrade.grade}
                                    </T.Data>
                                    <T.Data />
                                    <T.Data />
                                  </T.Row>
                                )
                              } else if (
                                grade.__typename ===
                                'EducationCompulsorySchoolGradeCategoryText'
                              ) {
                                return (
                                  <T.Row key={index}>
                                    <T.Data>{grade.label}</T.Data>
                                    <T.Data colSpan={42}>{grade.text}</T.Data>
                                  </T.Row>
                                )
                              }

                              return null
                            })
                            .filter(isDefined)}
                        </React.Fragment>
                      )
                    },
                  )}
                </T.Body>
              </T.Table>
            </Box>
          ),
        )}
      <p>bleble</p>
    </>
  )
}

export default CompulsorySchoolFamilyExamOverview
