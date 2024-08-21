import { useLocale, useNamespaces } from '@island.is/localization'
import { SortableTable, formatDate } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { Vaccine } from '../dataStructure'
import { tagSelector } from '../../../utils/tagSelector'
import { VaccinationsDetailTable } from './VaccinationsDetailTable'
import { DetailHeader, DetailRow } from '../../../utils/types'
import { ATC_URL_BASE } from '../../../utils/constants'
import { HealthDirectorateVaccination } from '@island.is/api/schema'

interface Props {
  data: Array<HealthDirectorateVaccination>
}
export const SortedVaccinationsTable = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const headerDataDetail: Array<DetailHeader> = [
    {
      value: 'Nr.',
    },
    {
      value: 'Dags.',
    },
    {
      value: 'Aldur',
    },
    {
      value: 'Bóluefni',
    },
    {
      value: 'Staður',
    },
  ]
  return (
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
        data?.map((item, i) => ({
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
                      value: vaccination.date.toLocaleDateString('is-IS'),
                    },
                    {
                      value: [
                        vaccination.age?.years,
                        formatMessage(messages.years),
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
                      value: vaccination.comment,
                    },
                  ]
                },
              )}
              footerText={item.comments ?? []}
            />
          ),
          status: item?.statusName ?? '',
          tag: tagSelector(item?.status ?? ''),
        })) ?? []
      }
    />
  )
}
