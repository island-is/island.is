import {
  HealthDirectorateVaccination,
  HealthDirectorateVaccinationsInfo,
} from '@island.is/api/schema'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyTable,
  LinkButton,
  PortalTable,
  createColumnHelper,
  formatDate,
  useIsMobile,
} from '@island.is/portals/my-pages/core'
import { Markdown } from '@island.is/shared/components'
import { useMemo } from 'react'
import { messages } from '../../../lib/messages'
import { tableTextCell } from '../../../components/TableTextCell/TableTextCell'
import { tagSelector } from '../../../utils/tagSelector'
import * as styles from '../tables/VaccinationsTable.css'

const columnHelper = createColumnHelper<HealthDirectorateVaccination>()
const infoColumnHelper = createColumnHelper<HealthDirectorateVaccinationsInfo>()

interface Props {
  data?: Array<HealthDirectorateVaccination>
}
export const SortedVaccinationsTable = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()

  const { columns, infoColumns } = useMemo(() => {
    return {
      columns: [
        columnHelper.accessor((item) => item.name ?? '', {
          id: 'vaccine',
          header: formatMessage(messages.vaccinatedFor),
        }),
        columnHelper.accessor((item) => item.lastVaccinationDate ?? '', {
          id: 'date',
          header: formatMessage(messages.vaccinatedLast),
          meta: { type: 'interactive' },
          cell: ({ row }) =>
            tableTextCell(formatDate(row.original.lastVaccinationDate) ?? ''),
        }),
        columnHelper.accessor((item) => item.statusName ?? '', {
          id: 'status',
          header: formatMessage(messages.status),
          meta: { type: 'interactive' },
          cell: ({ getValue, row }) => (
            <Tag
              variant={tagSelector(row.original.status ?? undefined)}
              outlined
              disabled
            >
              {getValue()}
            </Tag>
          ),
        }),
      ],
      infoColumns: [
        infoColumnHelper.accessor((_, index) => index + 1, {
          id: 'nr',
          header: formatMessage(messages.vaccinesTableHeaderNr),
          meta: { type: 'interactive' },
          cell: ({ getValue }) => tableTextCell(getValue()),
        }),
        infoColumnHelper.accessor((item) => item.date ?? '', {
          id: 'date',
          header: formatMessage(messages.vaccinesTableHeaderDate),
          meta: { type: 'interactive' },
          cell: ({ row }) =>
            tableTextCell(
              row.original.date
                ? new Date(row.original.date).toLocaleDateString('is-IS')
                : '',
            ),
        }),
        infoColumnHelper.accessor(
          (item) => (item.age?.years ?? 0) * 12 + (item.age?.months ?? 0),
          {
            id: 'age',
            header: formatMessage(messages.vaccinesTableHeaderAge),
            meta: { type: 'interactive' },
            cell: ({ row }) => {
              const { age } = row.original
              return tableTextCell(
                [
                  age?.years,
                  age?.years ? formatMessage(messages.years) : undefined,
                  age?.months,
                  formatMessage(messages.months),
                ]
                  .filter(Boolean)
                  .join(' '),
              )
            },
          },
        ),
        infoColumnHelper.accessor((item) => item.name ?? '', {
          id: 'vaccine',
          header: formatMessage(messages.vaccinesTableHeaderVaccine),
          meta: { type: 'interactive' },
          cell: ({ row }) => {
            const { url, name } = row.original
            if (url) {
              return (
                <LinkButton
                  icon={undefined}
                  size="small"
                  to={url}
                  text={name ?? ''}
                  variant="text"
                />
              )
            }
            return isMobile ? (
              <Text variant="h5" as="h3">
                {name ?? ''}
              </Text>
            ) : (
              tableTextCell(name ?? '')
            )
          },
        }),
        infoColumnHelper.accessor((item) => item.location ?? '', {
          id: 'location',
          header: formatMessage(messages.vaccinesTableHeaderLocation),
          meta: { type: 'interactive' },
          cell: ({ getValue }) => tableTextCell(getValue()),
        }),
      ],
    }
  }, [formatMessage, isMobile])

  if (!data || data?.length === 0)
    return <EmptyTable message={formatMessage(messages.noVaccinesRegistered)} />

  return (
    <Box paddingY={4}>
      <PortalTable
        columns={columns}
        data={data}
        emptyMessage={formatMessage(messages.noVaccinesRegistered)}
        getRowId={(item, i) => item.id ?? `${i}`}
        defaultSorting={[{ id: 'vaccine', desc: false }]}
        mobileTitleKey="vaccine"
        renderExpandedRow={({ original: item }) => (
          <Box
            padding={[0, 0, 0, 3]}
            background={['transparent', 'transparent', 'blue100']}
          >
            <Box background="white">
              <PortalTable
                columns={infoColumns}
                data={item.vaccinationsInfo ?? []}
                emptyMessage={formatMessage(messages.noVaccinesRegistered)}
                getRowId={(info, i) => info.id?.toString() ?? `${i}`}
                defaultSorting={[{ id: 'nr', desc: false }]}
                mobileTitleKey="vaccine"
              />
            </Box>
            {item.comments && item.comments.length > 0 && (
              <Box width="full" paddingY={2} paddingX={5} background="blue100">
                <ul color="black">
                  {item.comments.map((comment, i) => (
                    <li key={i} className={styles.footerList}>
                      <Markdown>{comment}</Markdown>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        )}
      />
    </Box>
  )
}
