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

  const columns = useMemo(
    () => [
      columnHelper.accessor('schoolYear', {
        header: formatMessage(psm.schoolYear),
        cell: ({ getValue }) => getValue() ?? '',
      }),
      columnHelper.accessor((row) => row.grade?.level, {
        id: 'gradeLevel',
        header: formatMessage(psm.gradeLevel),
        cell: ({ getValue }) => {
          const level = getValue()
          return level != null
            ? formatMessage(psm.gradeLevelFormatted, { grade: level })
            : ''
        },
      }),
      columnHelper.accessor((row) => row.period?.startDateString, {
        id: 'examSitting',
        header: formatMessage(psm.examSitting),
        cell: ({ getValue }) => getValue() ?? '',
      }),
      columnHelper.display({
        id: 'download',
        header: formatMessage(psm.downloadResults),
        enableSorting: false,
        cell: ({ row }) => {
          const url = row.original.downloadServiceUrl
          if (!url) return null

          return (
            <Button
              variant="text"
              size="small"
              icon="download"
              iconType="outline"
              onClick={() => formSubmit(url)}
            >
              {formatMessage(psm.downloadResults)}
            </Button>
          )
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
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
