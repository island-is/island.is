import { EducationPrimarySchoolAssessmentResult } from '@island.is/api/schema'
import { Box, Button, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formSubmit, m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolMessages as psm } from '../../../lib/messages'

interface Props {
  results: EducationPrimarySchoolAssessmentResult[]
}

export const AssessmentTable = ({ results }: Props) => {
  const { formatMessage } = useLocale()

  if (results.length === 0) {
    return (
      <Box paddingY={2}>
        <Problem
          type="no_data"
          noBorder
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
        />
      </Box>
    )
  }

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(psm.schoolYear)}</T.HeadData>
          <T.HeadData>{formatMessage(psm.gradeLevel)}</T.HeadData>
          <T.HeadData>{formatMessage(psm.examSitting)}</T.HeadData>
          <T.HeadData>{formatMessage(psm.downloadResults)}</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {results.map((result) => {
          const { id, downloadServiceUrl, schoolYear, grade, period } = result
          return (
            <T.Row key={id}>
              <T.Data>{schoolYear ?? ''}</T.Data>
              <T.Data>
                {grade?.level != null
                  ? formatMessage(psm.gradeLevelFormatted, {
                      grade: grade.level,
                    })
                  : ''}
              </T.Data>
              <T.Data>{period?.startDateString ?? ''}</T.Data>
              <T.Data>
                {downloadServiceUrl && (
                  <Button
                    variant="text"
                    size="small"
                    icon="download"
                    iconType="outline"
                    onClick={() => formSubmit(downloadServiceUrl)}
                  >
                    {formatMessage(psm.downloadResults)}
                  </Button>
                )}
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
