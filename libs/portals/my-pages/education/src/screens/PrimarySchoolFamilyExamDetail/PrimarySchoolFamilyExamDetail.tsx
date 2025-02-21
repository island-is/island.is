import {
  ExpandHeader,
  ExpandRow,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { edMessage } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { Box, Text, Table as T } from '@island.is/island-ui/core'
import { useParams } from 'react-router-dom'
import { useUserFamilyMemberExamResultsQuery } from './PrimarySchoolFamilyExamDetail.generated'

type UseParams = {
  id: string
}

export const PrimarySchoolFamilyExamOverview = () => {
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
    <IntroWrapper
      title={formatMessage(edMessage.assessment)}
      intro={formatMessage(edMessage.studentAssessmentIntroText)}
      serviceProviderSlug={'menntamalastofnun'}
      serviceProviderTooltip={formatMessage(m.mmsTooltip)}
    >
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
                {formatMessage(edMessage.gradeTableTitle, {
                  arg: studentAssessment.gradeLevel,
                })}
              </Text>
              <T.Table>
                <ExpandHeader
                  data={[
                    { value: '' },
                    {
                      value: formatMessage(edMessage.courseName),
                    },
                    {
                      value: formatMessage(edMessage.primarySchoolGrade),
                    },
                    {
                      value: formatMessage(edMessage.nationalCoordinationGrade),
                    },
                    {
                      value: formatMessage(edMessage.competencyGrade),
                    },
                    {
                      value: formatMessage(edMessage.status),
                    },
                  ]}
                />
                <T.Body>
                  {studentAssessment.coursesExamResults?.map(
                    (studentAssessment) => (
                      <ExpandRow
                        data={[
                          {
                            value: studentAssessment.label,
                          },
                          {
                            value:
                              studentAssessment.totalGrade?.primarySchoolGrade
                                ?.grade ?? '',
                          },
                          {
                            value:
                              studentAssessment.totalGrade?.serialGrade
                                ?.grade ?? '',
                          },
                          {
                            value:
                              studentAssessment.competence?.competencyGrade,
                          },
                          {
                            value:
                              studentAssessment.competence?.competenceStatus ??
                              '',
                          },
                        ]}
                      >
                        <T.Table>
                          <T.Head>
                            <T.HeadData>
                              {formatMessage(edMessage.courseCategories)}
                            </T.HeadData>
                            <T.HeadData>
                              {formatMessage(edMessage.weight)}
                            </T.HeadData>
                            <T.HeadData>
                              {formatMessage(edMessage.primarySchoolGrade)}
                            </T.HeadData>
                            <T.HeadData>
                              {formatMessage(
                                edMessage.nationalCoordinationGrade,
                              )}
                            </T.HeadData>
                          </T.Head>
                          {studentAssessment.gradeCategories?.map(
                            (grade, index) => {
                              const tableData =
                                grade.__typename ===
                                'EducationPrimarySchoolGradeCategoryWeighted' ? (
                                  <T.Row key={index}>
                                    <T.Data>{grade.label}</T.Data>
                                    <T.Data>{`(${grade.grade.primarySchoolGrade.weight}%)`}</T.Data>
                                    <T.Data>
                                      {grade.grade.primarySchoolGrade?.grade}
                                    </T.Data>
                                    <T.Data>
                                      {grade.grade.serialGrade.grade}
                                    </T.Data>
                                  </T.Row>
                                ) : grade.__typename ===
                                  'EducationPrimarySchoolGradeCategoryText' ? (
                                  <T.Row key={index}>
                                    <T.Data>{grade.label}</T.Data>
                                    <T.Data colSpan={42}>{grade.text}</T.Data>
                                  </T.Row>
                                ) : null

                              return tableData
                            },
                          )}
                        </T.Table>
                      </ExpandRow>
                    ),
                  )}
                </T.Body>
              </T.Table>
            </Box>
          ),
        )}
    </IntroWrapper>
  )
}

export default PrimarySchoolFamilyExamOverview
