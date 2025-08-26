import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  SkeletonLoader,
  Table as T,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { IntroHeader, MMS_SLUG, m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

const EducationExamResultQuery = gql`
  query EducationExamResultQuery($familyIndex: Int!) {
    educationExamResult(familyIndex: $familyIndex) {
      id
      fullName
      grades {
        studentYear
        courses {
          label
          gradeSum {
            label
            serialGrade {
              grade
              label
              weight
            }
            elementaryGrade {
              grade
              label
              weight
            }
          }
          competence
          competenceStatus
          grades {
            label
            serialGrade {
              grade
              label
              weight
            }
            elementaryGrade {
              grade
              label
              weight
            }
            __typename
          }
          wordAndNumbers {
            grade
            label
            weight
          }
          progressText {
            grade
            label
            weight
          }
          __typename
        }
      }
      __typename
    }
  }
`

type DataField = Pick<
  TextProps,
  'variant' | 'color' | 'truncate' | 'fontWeight' | 'lineHeight'
>

type UseParams = {
  familyIndex: string
}

const StudentAssessmentTable = () => {
  useNamespaces('sp.education-career')
  const { familyIndex } = useParams() as UseParams
  const { formatMessage } = useLocale()
  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery<Query>(EducationExamResultQuery, {
    variables: {
      familyIndex: parseInt(familyIndex, 10),
    },
  })

  if (queryLoading) {
    return <LoadingTemplate />
  }

  return (
    <>
      {data?.educationExamResult && (
        <IntroHeader
          title={data?.educationExamResult.fullName}
          intro={{
            id: 'sp.education-student-assessment:education-student-assessment-intro',
            defaultMessage:
              'Hér birtast einkunnir þínar og barna þinna úr samræmdum prófum frá árinu 2020 sem sóttar eru til Menntamálastofnunar. Unnið er að því að því að koma öllum einkunnum úr menntakerfi Íslands á einn stað.',
          }}
          serviceProviderSlug={MMS_SLUG}
          serviceProviderTooltip={formatMessage(m.mmsTooltip)}
        />
      )}
      {error && !queryLoading && <Problem error={error} noBorder={false} />}
      {!error && !queryLoading && !data?.educationExamResult.grades.length && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {data?.educationExamResult.grades.map((studentAssessment, index) => (
        <Box key={index} marginBottom={7}>
          <Text variant="h4" as="h2" marginBottom={3}>
            Samræmd könnunarpróf {studentAssessment.studentYear}. bekkur
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
              {studentAssessment.courses.map((studentAssessment, index) => {
                const containsBreakdown = studentAssessment.grades.length !== 0
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
                        {studentAssessment.label}
                      </T.Data>
                      <T.Data text={dataText} box={dataBox}></T.Data>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.gradeSum?.elementaryGrade?.grade}
                      </T.Data>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.gradeSum?.serialGrade?.grade}
                      </T.Data>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.competence}
                      </T.Data>
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.competenceStatus}
                      </T.Data>
                    </T.Row>
                    {studentAssessment.grades.map((grade, index) => {
                      const dataBox = {
                        borderBottomWidth: undefined,
                        paddingTop: undefined,
                      }
                      return (
                        <T.Row key={index}>
                          <T.Data box={dataBox}>{grade.label}</T.Data>
                          <T.Data box={dataBox}>
                            {grade.elementaryGrade?.weight &&
                              `(${grade.elementaryGrade.weight}%)`}
                          </T.Data>
                          <T.Data box={dataBox}>
                            {grade.elementaryGrade?.grade}
                          </T.Data>
                          <T.Data box={dataBox}>
                            {grade.serialGrade?.grade}
                          </T.Data>
                          <T.Data box={dataBox}></T.Data>
                          <T.Data box={dataBox}></T.Data>
                        </T.Row>
                      )
                    })}
                    {studentAssessment.wordAndNumbers && (
                      <T.Row key={index}>
                        <T.Data
                          box={{
                            paddingTop: undefined,
                            borderBottomWidth: undefined,
                          }}
                        >
                          {studentAssessment.wordAndNumbers?.label}
                        </T.Data>
                        <T.Data
                          box={{
                            paddingTop: undefined,
                            borderBottomWidth: undefined,
                          }}
                        >
                          {studentAssessment.wordAndNumbers.weight}
                        </T.Data>
                        <T.Data
                          box={{
                            paddingTop: undefined,
                            borderBottomWidth: undefined,
                          }}
                          colSpan={42}
                        >
                          {studentAssessment.wordAndNumbers.grade}
                        </T.Data>
                      </T.Row>
                    )}
                    {studentAssessment.progressText && (
                      <T.Row key={index}>
                        <T.Data box={{ paddingTop: undefined }}>
                          {studentAssessment.progressText?.label}
                        </T.Data>
                        <T.Data box={{ paddingTop: undefined }}>
                          {studentAssessment.progressText.weight}
                        </T.Data>
                        <T.Data box={{ paddingTop: undefined }} colSpan={42}>
                          {studentAssessment.progressText.grade}
                        </T.Data>
                      </T.Row>
                    )}
                  </Fragment>
                )
              })}
            </T.Body>
          </T.Table>
        </Box>
      ))}
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
