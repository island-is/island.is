import { Box, Divider, Stack, Tag } from '@island.is/island-ui/core'
import { GetUnemploymentApplicationOverviewQuery } from './Status.generated'
import { UserInfoLine } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { applicationStatusColorMap } from '../../../lib/utils/vmstApplicationStatusColorMap'

type OverviewItem = NonNullable<
  GetUnemploymentApplicationOverviewQuery['vmstApplicationsUnemploymentApplicationOverview']['overviewItems']
>[number]

interface OverviewTableProps {
  overviewItems: OverviewItem[]
  applicationStatusName?: string | null
  applicationStatusId?: string | null
  dataRequested?: boolean | null
}

const getJobSearchConfirmationDateRange = (locale: Locale): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getDate() > 25 ? now.getMonth() + 1 : now.getMonth()
  const start = new Date(year, month, 20)
  const end = new Date(year, month, 25)

  const dateLocale = locale === 'is' ? 'is-IS' : 'en-GB'
  const fmt = (d: Date) =>
    `${d.getDate()}.${d.toLocaleString(dateLocale, { month: 'short' })}`

  return `${fmt(start)}-${fmt(end)}`
}

const getRowTag = (
  key: string | null | undefined,
  applicationStatusName?: string | null,
  applicationStatusId?: string | null,
  dateRangeLabel?: string,
): (() => React.ReactNode) | undefined => {
  switch (key) {
    case 'application-status': {
      if (!applicationStatusName) return undefined
      const tagVariant =
        applicationStatusColorMap[applicationStatusId?.toUpperCase() ?? ''] ??
        'warn'
      return () => (
        <Tag variant={tagVariant} outlined disabled>
          {applicationStatusName}
        </Tag>
      )
    }
    case 'last-job-search-confirmation-date':
      return () => (
        <Tag variant="blue" outlined disabled>
          {dateRangeLabel}
        </Tag>
      )
    default:
      return undefined
  }
}

export const OverviewTable = ({
  overviewItems,
  applicationStatusName,
  applicationStatusId,
  dataRequested,
}: OverviewTableProps) => {
  const { formatMessage, lang } = useLocale()
  const dateRangeLabel = formatMessage(um.jobSearchConfirmationNextDate, {
    dateRange: getJobSearchConfirmationDateRange(lang),
  }) as string
  return (
    <Box paddingTop={4}>
      <Stack space={0}>
        {overviewItems.map((item, index) => {
          const tag = getRowTag(
            item.key,
            applicationStatusName,
            applicationStatusId,
            dateRangeLabel,
          )
          return (
            <Box key={item.key ?? index}>
              <UserInfoLine
                label={item.label ?? ''}
                content={item.value ?? '-'}
                renderEnd={tag}
                {...(!tag && {
                  valueColumnSpan: ['1/1', '7/12', '1/1', '1/1', '7/12'],
                  editColumnSpan: ['0', '0', '0', '0', '0'],
                })}
              />
              <Divider />
            </Box>
          )
        })}
        {dataRequested && (
          <>
            <UserInfoLine
              label={formatMessage(um.statusDataLabel)}
              content={formatMessage(um.statusDataContent)}
              renderEnd={() => (
                <Tag variant="red" outlined disabled>
                  {formatMessage(um.statusDataMissing)}
                </Tag>
              )}
            />
            <Divider />
          </>
        )}
      </Stack>
    </Box>
  )
}
