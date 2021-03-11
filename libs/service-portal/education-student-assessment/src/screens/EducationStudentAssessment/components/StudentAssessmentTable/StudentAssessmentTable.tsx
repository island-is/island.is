import React, { Fragment } from 'react'
import {
  AlertMessage,
  Box,
  Table as T,
  Text,
  TextProps,
} from '@island.is/island-ui/core'

type DataField = Pick<
  TextProps,
  'variant' | 'color' | 'truncate' | 'fontWeight' | 'lineHeight'
>

const gradeMock = [
  {
    subject: 'Enska',
    rate: '',
    serialRating: '61',
    abilityRating: 'A+',
    status: 'A1',
    breakdown: [
      {
        subject: 'Lesskilningur',
        rate: '(70%)',
        serialRating: '49',
        abilityRating: '',
        status: '',
      },
      {
        subject: 'Málnotkun',
        rate: '(30%)',
        serialRating: '85',
        abilityRating: '',
        status: '',
      },
    ],
  },
  {
    subject: 'Íslenska',
    rate: '',
    serialRating: '84',
    abilityRating: 'B+',
    status: '',
    breakdown: [
      {
        subject: 'Lestur og bókmenntir',
        rate: '(70%)',
        serialRating: '69',
        abilityRating: '',
        status: '',
      },
      {
        subject: 'Málnotkun',
        rate: '(30%)',
        serialRating: '94',
        abilityRating: '',
        status: '',
      },
      {
        subject: 'Framfaraeinkunn',
        progressRating:
          'Framfarir í íslensku eru svipaðar og almennt gerist á landsvísu.',
      },
    ],
  },
  {
    subject: 'Stærðfræði',
    rate: '',
    serialRating: '79',
    abilityRating: 'B',
    status: '',
    breakdown: [
      {
        subject: 'Reikningur og aðgerðir',
        rate: '(25%)',
        serialRating: '79',
        abilityRating: '',
        status: '',
      },
      {
        subject: 'Rúmfræði og mælingar',
        rate: '(25%)',
        serialRating: '72',
        abilityRating: '',
        status: '',
      },
      {
        subject: 'Algebra',
        rate: '(25%)',
        serialRating: '60',
        abilityRating: '',
        status: '',
      },
      {
        subject: 'Hlutföll og prósentur',
        rate: '(25%)',
        serialRating: '62',
        abilityRating: '',
        status: '',
      },
      {
        subject: 'Framfaraeinkunn',
        progressRating:
          'Framfarir í stærðfræði eru svipaðar og almennt gerist á landsvísu.',
      },
    ],
  },
]
const studentAssessmentData = [
  {
    title: 'Samræmd könnunarpróf 4. bekkur',
    data: gradeMock,
  },
  {
    title: 'Samræmd könnunarpróf 7. bekkur',
    data: gradeMock,
  },
  {
    title: 'Samræmd könnunarpróf 9. bekkur',
    data: gradeMock,
  },
]

const StudentAssessmentTable = () => {
  return (
    <>
      {studentAssessmentData.map((studentAssessment, index) => (
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
                      <T.Data text={dataText} box={dataBox}>
                        {studentAssessment.rate}
                      </T.Data>
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
                      if (breakdown.progressRating) {
                        return (
                          <T.Row key={index}>
                            <T.Data box={dataBox}>{breakdown.subject}</T.Data>
                            <T.Data box={dataBox} colSpan={4}>
                              {breakdown.progressRating}
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
                          <T.Data box={dataBox}>
                            {breakdown.abilityRating}
                          </T.Data>
                          <T.Data box={dataBox}>{breakdown.status}</T.Data>
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

      {studentAssessmentData.length === 0 && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            title="Engin samræmd könnunarpróf fundust"
            message="Ef eitthvað er í ólagi hér er gott að hafa samband"
          />
        </Box>
      )}
    </>
  )
}

export default StudentAssessmentTable
