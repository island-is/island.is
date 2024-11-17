import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyTable,
  SortableTable,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../../lib/messages'
import { tagSelector } from '../../../utils/tagSelector'
import { HealthTable as VaccinationsDetailTable } from '../../../components/Table/HealthTable'
import { DetailHeader, DetailRow } from '../../../utils/types'
import { HealthDirectorateVaccination } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'

interface Props {
  data?: Array<HealthDirectorateVaccination>
}
export const SortedVaccinationsTable = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const headerDataDetail: Array<DetailHeader> = [
    {
      value: formatMessage(messages.vaccinesTableHeaderNr),
    },
    {
      value: formatMessage(messages.vaccinesTableHeaderDate),
    },
    {
      value: formatMessage(messages.vaccinesTableHeaderAge),
    },
    {
      value: formatMessage(messages.vaccinesTableHeaderVaccine),
    },
    {
      value: formatMessage(messages.vaccinesTableHeaderLocation),
    },
  ]
  if (!data || data?.length === 0)
    return <EmptyTable message={formatMessage(messages.noVaccinesRegistered)} />

  return (
    <Box paddingY={4}>
      <SortableTable
        title=""
        labels={{
          vaccine: formatMessage(messages.vaccinatedFor),
          date: formatMessage(messages.vaccinatedLast),
          status: formatMessage(messages.status),
        }}
        tagOutlined
        expandable
        defaultSortByKey="vaccine"
        items={
          data.map((item, i) => ({
            id: item?.id ?? `${i}`,
            name: item?.name ?? '',
            vaccine: item?.name ?? '',
            date: formatDate(item?.lastVaccinationDate) ?? '',

            children: (
              <VaccinationsDetailTable
                headerData={headerDataDetail}
                rowData={item.vaccinationsInfo?.map(
                  (vaccination, i): Array<DetailRow> => {
                    return [
                      {
                        value: (i + 1).toString(),
                      },
                      {
                        value: new Date(vaccination.date).toLocaleDateString(
                          'is-IS',
                        ),
                      },
                      {
                        value: [
                          vaccination.age?.years,
                          vaccination.age?.years
                            ? formatMessage(messages.years)
                            : undefined,
                          vaccination.age?.months,
                          formatMessage(messages.months),
                        ]
                          .filter(Boolean)
                          .join(' '),
                      },
                      {
                        value: vaccination.name ?? '',
                        type: 'link',
                        url: vaccination.url ?? '',
                      },
                      {
                        value: vaccination.location ?? '',
                      },
                    ]
                  },
                )}
                footerText={item.comments ?? []}
              />
            ),
            status: item?.statusName ?? '',
            tag: tagSelector(item?.status ?? undefined),
          })) ?? []
        }
      />
    </Box>
  )
}
