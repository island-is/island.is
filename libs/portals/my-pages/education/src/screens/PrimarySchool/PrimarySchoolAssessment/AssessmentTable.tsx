import { useMemo } from 'react'
import { EducationPrimarySchoolAssessmentResult } from '@island.is/api/schema'
import { Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Table,
  createColumnHelper,
  formSubmit,
  m,
} from '@island.is/portals/my-pages/core'
import { primarySchoolMessages as psm } from '../../../lib/messages'

interface Props {
  results: EducationPrimarySchoolAssessmentResult[]
  loading?: boolean
}

const columnHelper =
  createColumnHelper<EducationPrimarySchoolAssessmentResult>()

export const AssessmentTable = ({ results, loading }: Props) => {
  const { formatMessage, locale } = useLocale()

  const hasExamSitting = results.some(
    (r) =>
      typeof r.period?.startDateString === 'string' &&
      r.period.startDateString.trim().length > 0,
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('schoolYear', {
        header: formatMessage(psm.schoolYear),
        enableSorting: false,
        cell: ({ getValue }) => getValue() ?? '',
      }),
      columnHelper.accessor((row) => row.grade?.level, {
        id: 'gradeLevel',
        header: formatMessage(psm.gradeLevel),
        enableSorting: false,
        cell: ({ getValue }) => {
          const level = getValue()
          return level != null
            ? formatMessage(psm.gradeLevelFormatted, { grade: level })
            : ''
        },
      }),
      ...(hasExamSitting
        ? [
            columnHelper.accessor((row) => row.period?.startDateString, {
              id: 'examSitting',
              header: formatMessage(psm.examSitting),
              enableSorting: false,
              cell: ({ getValue }) => getValue() ?? '',
            }),
          ]
        : []),
      columnHelper.display({
        id: 'viewResults',
        header: () => null,
        enableSorting: false,
        meta: { align: 'right' },
        cell: ({ row }) => {
          const url = row.original.downloadServiceUrl
          if (!url) return null

          return (
            <Button
              variant="text"
              size="small"
              icon="copy"
              iconType="outline"
              aria-label={`${formatMessage(psm.viewResults)}${
                row.original.schoolYear ? `: ${row.original.schoolYear}` : ''
              }`}
              onClick={() => formSubmit(url)}
            >
              {formatMessage(psm.viewResults)}
            </Button>
          )
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, hasExamSitting],
  )

  return (
    <Table
      columns={columns}
      data={results}
      loading={loading}
      emptyMessage={formatMessage(m.noDataFoundDetail)}
    />
  )
}
