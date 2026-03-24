import { EducationPrimarySchoolAssessmentType } from '@island.is/api/schema'
import { Box, Text, Table as T, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { formSubmit, m } from '@island.is/portals/my-pages/core'

interface Props {
  assessment: EducationPrimarySchoolAssessmentType
  studentId: string
}

export const AssessmentTable = ({ assessment, studentId }: Props) => {
  const { formatMessage } = useLocale()

  const results = assessment?.results ?? []
  const rows = results.flatMap((r, rIdx) =>
    (r?.assignmentResults ?? []).map((ar, arIdx) => ({
      key: ar?.id ?? `${rIdx}-${arIdx}`,
      id: ar?.id,
      schoolYear: r?.schoolYear,
      gradeLevel: r?.gradeLevel,
      schedule: ar?.schedule,
    })),
  )
  const hasSchedule = rows.some((row) => row.schedule != null)

  return (
    <Box key={assessment?.id ?? assessment?.name} marginBottom={3}>
      <Box marginBottom={2}>
        <Text variant="h5">{assessment?.name}</Text>
      </Box>
      {rows.length === 0 ? (
        <Box paddingY={2}>
          <Problem
            type="no_data"
            noBorder
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
          />
        </Box>
      ) : (
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>{formatMessage(psm.schoolYear)}</T.HeadData>
              <T.HeadData>{formatMessage(psm.gradeLevel)}</T.HeadData>
              {hasSchedule && (
                <T.HeadData>{formatMessage(psm.examSitting)}</T.HeadData>
              )}
              <T.HeadData>{formatMessage(psm.downloadResults)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {rows.map((row) => (
              <T.Row key={row.key}>
                <T.Data>{row.schoolYear ?? ''}</T.Data>
                <T.Data>
                  {row.gradeLevel != null
                    ? formatMessage(psm.gradeLevelFormatted, {
                        grade: row.gradeLevel,
                      })
                    : ''}
                </T.Data>
                {hasSchedule && <T.Data>{row.schedule ?? ''}</T.Data>}
                <T.Data>
                  {row.id && studentId && (
                    <Button
                      variant="text"
                      size="small"
                      icon="download"
                      iconType="outline"
                      onClick={() =>
                        formSubmit(
                          `/education/primary-school/${studentId}/result/${row.id}/pdf`,
                        )
                      }
                    >
                      {formatMessage(psm.downloadResults)}
                    </Button>
                  )}
                </T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
    </Box>
  )
}
