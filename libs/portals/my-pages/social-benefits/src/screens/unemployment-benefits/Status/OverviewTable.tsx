import { Box, Divider, Stack, Tag } from '@island.is/island-ui/core'
import { GetUnemploymentApplicationOverviewQuery } from './Status.generated'
import { UserInfoLine } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'

type OverviewRow = NonNullable<
  GetUnemploymentApplicationOverviewQuery['vmstApplicationsUnemploymentApplicationOverview']['rows']
>[number]

interface OverviewTableProps {
  rows: OverviewRow[]
  applicationStatusName?: string | null
  dataRequested?: boolean | null
}

const getJobSearchConfirmationDateRange = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getDate() > 25 ? now.getMonth() + 1 : now.getMonth()
  const start = new Date(year, month, 20)
  const end = new Date(year, month, 25)

  const fmt = (d: Date) =>
    `${d.getDate()}.${d.toLocaleString('is-IS', { month: 'short' })}`

  return `Næst: ${fmt(start)}-${fmt(end)}`
}

const getRowTag = (
  key: string | null | undefined,
  applicationStatusName?: string | null,
): (() => React.ReactNode) | undefined => {
  switch (key) {
    case 'application-status':
      return applicationStatusName
        ? () => (
            <Tag variant="mint" outlined disabled>
              {applicationStatusName}
            </Tag>
          )
        : undefined
    case 'last-job-search-confirmation-date':
      return () => (
        <Tag variant="blue" outlined disabled>
          {getJobSearchConfirmationDateRange()}
        </Tag>
      )
    default:
      return undefined
  }
}

export const OverviewTable = ({
  rows,
  applicationStatusName,
  dataRequested,
}: OverviewTableProps) => {
  const { formatMessage } = useLocale()
  return (
    <Box paddingTop={4}>
      <Stack space={0}>
        {rows.map((row, index) => (
          <Box key={row.key ?? index}>
            <UserInfoLine
              label={row.label ?? ''}
              content={row.value ?? '-'}
              renderEnd={getRowTag(row.key, applicationStatusName)}
            />
            <Divider />
          </Box>
        ))}
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
