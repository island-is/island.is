import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  SkeletonLoader,
  Table as T,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { EmptyState } from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

const EducationExamResultQuery = gql`
  query EducationExamResultQuery($nationalId: String!) {
    educationExamResult(nationalId: $nationalId) {
      id
      fullName
      grades {
        studentYear
        icelandicGrade {
          grade
          competence
          competenceStatus
          reading {
            grade
            weight
          }
          grammar {
            grade
            weight
          }
          progressText
        }
        mathGrade {
          grade
          competence
          competenceStatus
          calculation {
            grade
            weight
          }
          geometry {
            grade
            weight
          }
          ratiosAndPercentages {
            grade
            weight
          }
          algebra {
            grade
            weight
          }
          numberComprehension {
            grade
            weight
          }
          wordAndNumbers
          progressText
        }
        englishGrade {
          grade
          competence
          competenceStatus
          reading {
            grade
            weight
          }
          grammar {
            grade
            weight
          }
          progressText
        }
      }
    }
  }
`

type DataField = Pick<
  TextProps,
  'variant' | 'color' | 'truncate' | 'fontWeight' | 'lineHeight'
>

const StudentAssessmentTable = () => {
  const { nationalId } = useParams<{ nationalId: string }>()
  const { data, loading: queryLoading, error } = useQuery<Query>(
    EducationExamResultQuery,
    {
      variables: {
        nationalId,
      },
    },
  )
  const educationExamResult =
    data?.educationExamResult?.grades.map((res) => ({
      title: `Samræmd könnunarpróf ${res.studentYear}. bekkur`,
      data: [
        ...(res.englishGrade?.grade
          ? [
              {
                subject: 'Enska',
                serialRating: res.englishGrade?.grade,
                abilityRating: res.englishGrade?.competence,
                status: res.englishGrade?.competenceStatus,
                breakdown: [
                  ...(res.englishGrade?.reading.grade
                    ? [
                        {
                          subject: 'Lesskilningur',
                          rate: `(${res.englishGrade?.reading.weight}%)`,
                          serialRating: res.englishGrade?.reading.grade,
                        },
                      ]
                    : []),
                  ...(res.englishGrade?.grammar.grade
                    ? [
                        {
                          subject: 'Málnotkun',
                          rate: `(${res.englishGrade?.grammar.weight}%)`,
                          serialRating: res.englishGrade?.grammar.grade,
                        },
                      ]
                    : []),
                  ...(res.englishGrade?.progressText
                    ? [
                        {
                          subject: 'Framfaraeinkunn',
                          text: res.englishGrade?.progressText,
                          multiCol: true,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...(res.icelandicGrade?.grade
          ? [
              {
                subject: 'Íslenska',
                serialRating: res.icelandicGrade?.grade,
                abilityRating: res.icelandicGrade?.competence,
                status: res.icelandicGrade?.competenceStatus,
                breakdown: [
                  ...(res.icelandicGrade?.reading.grade
                    ? [
                        {
                          subject: 'Lesskilningur',
                          rate: `(${res.icelandicGrade?.reading.weight}%)`,
                          serialRating: res.icelandicGrade?.reading.grade,
                        },
                      ]
                    : []),
                  ...(res.icelandicGrade?.grammar.grade
                    ? [
                        {
                          subject: 'Málnotkun',
                          rate: `(${res.icelandicGrade?.grammar.weight}%)`,
                          serialRating: res.icelandicGrade?.grammar.grade,
                        },
                      ]
                    : []),
                  ...(res?.icelandicGrade?.progressText
                    ? [
                        {
                          subject: 'Framfaraeinkunn',
                          text: res?.icelandicGrade?.progressText,
                          multiCol: true,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...(res.mathGrade?.grade
          ? [
              {
                subject: 'Stærðfræði',
                serialRating: res.mathGrade?.grade,
                abilityRating: res.mathGrade?.competence,
                status: res.mathGrade?.competenceStatus,
                breakdown: [
                  ...(res.mathGrade?.calculation.grade
                    ? [
                        {
                          subject: 'Reikningur og aðgerðir',
                          rate: `(${res.mathGrade?.calculation.weight}%)`,
                          serialRating: res.mathGrade?.calculation.grade,
                        },
                      ]
                    : []),
                  ...(res.mathGrade?.geometry.grade
                    ? [
                        {
                          subject: 'Rúmfræði og mælingar',
                          rate: `(${res.mathGrade?.geometry.weight}%)`,
                          serialRating: res.mathGrade?.geometry.grade,
                        },
                      ]
                    : []),
                  ...(res.mathGrade?.algebra.grade
                    ? [
                        {
                          subject: 'Algebra',
                          rate: `(${res.mathGrade?.algebra.weight}%)`,
                          serialRating: res.mathGrade?.algebra.grade,
                        },
                      ]
                    : []),
                  ...(res.mathGrade?.ratiosAndPercentages.grade
                    ? [
                        {
                          subject: 'Hlutföll og prósentur',
                          rate: `(${res.mathGrade?.ratiosAndPercentages.weight}%)`,
                          serialRating:
                            res.mathGrade?.ratiosAndPercentages.grade,
                        },
                      ]
                    : []),
                  ...(res.mathGrade?.numberComprehension.grade
                    ? [
                        {
                          subject: 'Tölur og talnaskilningur',
                          rate: `(${res.mathGrade?.numberComprehension.weight}%)`,
                          serialRating:
                            res.mathGrade?.numberComprehension.grade,
                        },
                      ]
                    : []),
                  ...(res?.mathGrade?.wordAndNumbers
                    ? [
                        {
                          subject: 'Orðadæmi og talnadæmi',
                          text: res?.mathGrade?.wordAndNumbers,
                          multiCol: true,
                        },
                      ]
                    : []),
                  ...(res?.mathGrade?.progressText
                    ? [
                        {
                          subject: 'Framfaraeinkunn',
                          text: res?.mathGrade?.progressText,
                          multiCol: true,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
      ],
    })) || []

  if (queryLoading) {
    return <LoadingTemplate />
  }

  return (
    <>
      {data?.educationExamResult && (
        <Text variant="h2" marginBottom={4}>
          {data?.educationExamResult.fullName}
        </Text>
      )}
      {educationExamResult.map((studentAssessment, index) => (
        <Box key={index} marginBottom={7}>
          <Text variant="h3" marginBottom={3}>
            {studentAssessment.title}
          </Text>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>Námsgrein</T.HeadData>
                <T.HeadData>Vægi</T.HeadData>
                <T.HeadData>Raðeinkunn</T.HeadData>
                <T.HeadData>Hæfnieinkunn</T.HeadData>
                <T.HeadData>Staða</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {studentAssessment.data.map((studentAssessment, index) => {
                const containsBreakdown =
                  studentAssessment.breakdown.length !== 0
                const dataBox = {
                  ...(containsBreakdown
                    ? { borderBottomWidth: undefined }
                    : {}),
                }
                const dataText: DataField = {
                  variant: 'h5',
                }
                return (
                  <Fragment key={index}>
                    <T.Row>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.subject}
                      </T.Data>
                      <T.Data text={dataText} box={dataBox}></T.Data>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.serialRating}
                      </T.Data>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.abilityRating}
                      </T.Data>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.status}
                      </T.Data>
                    </T.Row>
                    {studentAssessment.breakdown.map((breakdown, index) => {
                      const isLast =
                        studentAssessment.breakdown.length - 1 !== index
                      const dataBox = {
                        ...(isLast ? { borderBottomWidth: undefined } : {}),
                        paddingTop: undefined,
                      }
                      if (breakdown.multiCol) {
                        return (
                          <T.Row key={index}>
                            <T.Data box={dataBox}>{breakdown.subject}</T.Data>
                            <T.Data box={dataBox} colSpan={4}>
                              {breakdown.text}
                            </T.Data>
                          </T.Row>
                        )
                      }
                      return (
                        <T.Row key={index}>
                          <T.Data box={dataBox}>{breakdown.subject}</T.Data>
                          <T.Data box={dataBox}>{breakdown.rate}</T.Data>
                          <T.Data box={dataBox}>
                            {breakdown.serialRating}
                          </T.Data>
                          <T.Data box={dataBox}></T.Data>
                          <T.Data box={dataBox}></T.Data>
                        </T.Row>
                      )
                    })}
                  </Fragment>
                )
              })}
            </T.Body>
          </T.Table>
        </Box>
      ))}

      {educationExamResult.length === 0 && (
        <Box marginTop={8}>
          <EmptyState
            title={defineMessage({
              id: 'service.portal:education-no-data',
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
    <Text variant="h2" marginBottom={4}>
      <SkeletonLoader width={300} />
    </Text>
    <Text variant="h3" marginBottom={3}>
      <SkeletonLoader width={350} />
    </Text>
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>
            <SkeletonLoader />
          </T.HeadData>
          <T.HeadData>
            <SkeletonLoader />
          </T.HeadData>
          <T.HeadData>
            <SkeletonLoader />
          </T.HeadData>
          <T.HeadData>
            <SkeletonLoader />
          </T.HeadData>
          <T.HeadData>
            <SkeletonLoader />
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        <T.Row>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
        </T.Row>
        <T.Row>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
          <T.Data>
            <SkeletonLoader />
          </T.Data>
        </T.Row>
      </T.Body>
    </T.Table>
  </>
)

export default StudentAssessmentTable
