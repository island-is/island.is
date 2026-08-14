import { Box, Divider, Stack, Tag } from '@island.is/island-ui/core'
import { UserInfoLine } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { VmstApplicationStatus } from '@island.is/api/schema'
import { VmstApplicationOverviewItem } from '@island.is/portals/my-pages/graphql'
import { unemploymentBenefitsMessages as um } from '../../lib/messages/unemployment'
import { resolveStatusTagVariant } from '../../lib/statusTagVariant'

export type RowTagRenderer = () => React.ReactNode

interface OverviewTableProps {
  overviewItems: VmstApplicationOverviewItem[]
  applicationStatusName?: string | null
  applicationStatus?: VmstApplicationStatus | null
  dataRequested?: boolean | null
  /** Resolver for row tags beyond the built-in `application-status` row. */
  getExtraRowTag?: (
    key: string | null | undefined,
  ) => RowTagRenderer | undefined
}

export const OverviewTable = ({
  overviewItems,
  applicationStatusName,
  applicationStatus,
  dataRequested,
  getExtraRowTag,
}: OverviewTableProps) => {
  const { formatMessage } = useLocale()

  const getRowTag = (
    key: string | null | undefined,
  ): RowTagRenderer | undefined => {
    if (key === 'application-status' && applicationStatusName) {
      return () => (
        <Tag
          variant={resolveStatusTagVariant(applicationStatus)}
          outlined
          disabled
        >
          {applicationStatusName.replace('(VS)', '').trim()}
        </Tag>
      )
    }
    return getExtraRowTag?.(key)
  }

  return (
    <Box paddingTop={4}>
      <Stack space={0}>
        {overviewItems.map((item, index) => {
          const tag = getRowTag(item.key)
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
