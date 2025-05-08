import { FC } from 'react'

import { Button } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { CaseStatistics } from '@island.is/judicial-system-web/src/graphql/schema'

import { mapServiceStatusTitle } from '../helpers'

const convertToCSV = (rows: Record<string, unknown>[]): string => {
  if (!rows.length) return ''
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))))
  const escapeCSVValue = (val: unknown): string => {
    if (typeof val === 'string') {
      return val.includes(',') || val.includes('"')
        ? `"${val.replace(/"/g, '""')}"`
        : val
    }
    return val != null ? String(val) : ''
  }
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((key) => escapeCSVValue(row[key])).join(','),
    ),
  ]
  return csv.join('\n')
}

const millisecondsToHours = (ms: number): string =>
  (ms / (1000 * 60 * 60)).toFixed(2)

interface StatisticsCSVButtonProps {
  stats?: CaseStatistics
  fromDate?: Date
  toDate?: Date
  institutionName?: string
}

export const StatisticsCSVButton: FC<StatisticsCSVButtonProps> = ({
  stats,
  fromDate,
  toDate,
  institutionName,
}) => {
  const formatDateForFilename = (date: Date) =>
    formatDate(date)?.replace(/\./g, '_')

  const getFilename = () => {
    const parts = [
      'RVG_tölur',
      institutionName?.replace(/\s+/g, '_').toLowerCase(),
      fromDate ? formatDateForFilename(fromDate) : '',
      toDate ? formatDateForFilename(toDate) : '',
    ]
    return parts.filter(Boolean).join('_') || 'case_statistics'
  }

  const buildRequestSection = (s: CaseStatistics) => [
    { Tegund: 'R mál' },
    { Titill: 'Heildarfjöldi', Samtals: s.requestCases.count },
    { Titill: 'Í vinnslu', Samtals: s.requestCases.inProgressCount },
    { Titill: 'Lokið', Samtals: s.requestCases.completedCount },
  ]

  const buildIndictmentSection = (s: CaseStatistics) => [
    { Tegund: 'S mál' },
    { Titill: 'Heildarfjöldi', Samtals: s.indictmentCases.count },
    {
      Titill: 'Í vinnslu',
      Samtals: s.indictmentCases.inProgressCount,
    },
    {
      Titill: 'Lokið með dómi',
      Samtals: s.indictmentCases.rulingCount,
      'Meðaltími (dagar)': s.indictmentCases.averageRulingTimeDays,
      'Meðaltími (klst)': millisecondsToHours(
        s.indictmentCases.averageRulingTimeMs,
      ),
    },
  ]

  const buildSubpoenaSection = (s: CaseStatistics) => [
    { Tegund: 'Fyrirköll' },
    { Titill: 'Heildarfjöldi', Samtals: s.subpoenas.count },
    ...s.subpoenas.serviceStatusStatistics.map((status) => ({
      Titill: mapServiceStatusTitle(status.serviceStatus),
      Samtals: status.count,
      'Meðaltími (dagar)': status.serviceStatus
        ? status.averageServiceTimeDays
        : '',
      'Meðaltími (klst)': status.serviceStatus
        ? millisecondsToHours(status.averageServiceTimeMs)
        : '',
    })),
  ]

  const handleDownload = () => {
    if (!stats) return

    const periodText =
      fromDate && toDate
        ? `${formatDate(fromDate)} - ${formatDate(toDate)}`
        : fromDate
        ? `${formatDate(fromDate)} - nú`
        : toDate
        ? `Frá upphafi - ${formatDate(toDate)}`
        : 'Frá upphafi'

    const institutionText = institutionName || 'Allir dómstólar'

    const headerInfo = [
      {
        Síur: institutionText,
      },
      { Síur: periodText },
    ]

    const csvData = [
      { Tegund: 'Öll mál' },
      { Titill: 'Heildarfjöldi', Samtals: stats.count },
      ...buildRequestSection(stats),
      ...buildIndictmentSection(stats),
      ...buildSubpoenaSection(stats),
    ]

    const csv = convertToCSV([...headerInfo, ...csvData])
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${getFilename()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      variant="ghost"
      size="small"
      icon="download"
      iconType="outline"
      onClick={handleDownload}
      disabled={!stats}
    >
      Sækja CSV
    </Button>
  )
}

export default StatisticsCSVButton
