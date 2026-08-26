import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { messages } from '../../lib/messages'
import { formatHourlyWage } from '../EmployeesEditor/utils'
import { formatPercentMagnitude } from '../../utils/wageGap'

type PayDispersionDto = SalaryAnalysisResponseDto['payDispersion']
type PayDispersionEmployeeDto = PayDispersionDto['employees'][number]

const RENDERED_POPULATION: PayDispersionDto['population'] = 'ALL_EMPLOYEES'
const dash = '—'

const formatSpreads = (value: number | null | undefined): string =>
  value == null
    ? dash
    : `${value > 0 ? '+' : ''}${value.toFixed(2).replace('.', ',')}`

const formatSignedPercent = (value: number) =>
  `${value > 0 ? '+' : value < 0 ? '-' : ''}${formatPercentMagnitude(value)}%`

const formatSignedDeviation = (
  employee: PayDispersionEmployeeDto,
  formatMessage: ReturnType<typeof useLocale>['formatMessage'],
): string => {
  const value = employee.deviationPercent
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  const m = messages.salaryAnalysis.payDispersion

  const word =
    employee.payStatus === 'UNDERPAID'
      ? formatMessage(m.directionBelow)
      : employee.payStatus === 'OVERPAID'
      ? formatMessage(m.directionAbove)
      : undefined

  const percent = `${sign}${formatPercentMagnitude(value)}%`
  return word ? `${percent} (${word})` : percent
}

const genderLabel = (
  gender: PayDispersionEmployeeDto['gender'],
  formatMessage: ReturnType<typeof useLocale>['formatMessage'],
): string => {
  const m = messages.salaryAnalysis.payDispersion
  if (gender === 'MALE') return formatMessage(m.genderMale)
  if (gender === 'FEMALE') return formatMessage(m.genderFemale)
  return formatMessage(m.genderNeutral)
}

type Props = {
  payDispersion?: PayDispersionDto | null
  identifierForOrdinal: (ordinal: number) => string
}

export const PayDispersionTable = ({
  payDispersion,
  identifierForOrdinal,
}: Props) => {
  const { formatMessage } = useLocale()
  const p = messages.salaryAnalysis.payDispersion

  if (!payDispersion) return null

  if (
    payDispersion.available &&
    payDispersion.population !== RENDERED_POPULATION
  ) {
    return null
  }

  return (
    <Box marginBottom={4}>
      <Text variant="h4" marginBottom={2}>
        {formatMessage(p.heading)}
      </Text>

      {!payDispersion.available ? (
        <Box>
          {payDispersion.blockers.map((code) => (
            <Text key={code} variant="small" color="dark350">
              {formatMessage(
                code === 'COHORT_TOO_SMALL'
                  ? p.blockerCohortTooSmall
                  : code === 'NO_SCORE_VARIATION'
                  ? p.blockerNoScoreVariation
                  : p.blockerGapNotComputable,
              )}
            </Text>
          ))}
        </Box>
      ) : payDispersion.employees.length === 0 ? (
        <Text variant="small" color="dark350">
          {formatMessage(p.allClear)}
        </Text>
      ) : (
        <>
          <Text marginBottom={1}>{formatMessage(p.intro)}</Text>
          <Text marginBottom={2} fontWeight="semiBold">
            {formatMessage(p.noObligation)}
          </Text>
          {payDispersion.cohortResidualSpreadPercentUp != null &&
            payDispersion.cohortResidualSpreadPercentDown != null && (
              <Text variant="small" color="dark350" marginBottom={2}>
                {formatMessage(p.spreadNote, {
                  down: formatSignedPercent(
                    payDispersion.cohortResidualSpreadPercentDown,
                  ),
                  up: formatSignedPercent(
                    payDispersion.cohortResidualSpreadPercentUp,
                  ),
                  threshold: String(payDispersion.threshold).replace('.', ','),
                })}
              </Text>
            )}

          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(p.numberHeader)}</T.HeadData>
                <T.HeadData>{formatMessage(p.genderHeader)}</T.HeadData>
                <T.HeadData>{formatMessage(p.points)}</T.HeadData>
                <T.HeadData>{formatMessage(p.salary)}</T.HeadData>
                <T.HeadData>{formatMessage(p.predictedSalary)}</T.HeadData>
                <T.HeadData>{formatMessage(p.deviationHeader)}</T.HeadData>
                <T.HeadData>{formatMessage(p.spreadHeader)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {payDispersion.employees.map((employee) => (
                <T.Row key={employee.employeeOrdinal}>
                  <T.Data>
                    {identifierForOrdinal(employee.employeeOrdinal)}
                  </T.Data>
                  <T.Data>{genderLabel(employee.gender, formatMessage)}</T.Data>
                  <T.Data>{employee.score}</T.Data>
                  <T.Data>
                    {formatHourlyWage(employee.regularHourlyWage)}
                  </T.Data>
                  <T.Data>
                    {formatHourlyWage(employee.expectedHourlyWage)}
                  </T.Data>
                  <T.Data>
                    {formatSignedDeviation(employee, formatMessage)}
                  </T.Data>
                  <T.Data>{formatSpreads(employee.studentizedResidual)}</T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
        </>
      )}
    </Box>
  )
}
