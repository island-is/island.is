import { useLocale, useNamespaces } from '@island.is/localization'
import { SortableTable, formatDate } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { Vaccine } from '../dataStructure'
import { tagSelector } from '../../../utils/tagSelector'
import { VaccinationsDetailTable } from './VaccinationsDetailTable'
import { DetailHeader, DetailRow } from '../../../utils/types'
import { ATC_URL_BASE } from '../../../utils/constants'
import { HealthDirectorateVaccinations } from '@island.is/api/schema'

interface Props {
  data: Array<HealthDirectorateVaccinations>
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
          id: item?.diseaseId ?? `${i}`,
          name: item?.diseaseName ?? '',
          vaccine: item?.diseaseName ?? '',
          date: formatDate(item?.lastVaccinationDate) ?? '',

          children: (
            <VaccinationsDetailTable
              headerData={headerDataDetail}
              rowData={item.vaccinations?.map(
                (vaccination, i): Array<DetailRow> => {
                  return [
                    {
                      value: (i + 1).toString(),
                    },
                    {
                      value:
                        vaccination.vaccinationDate.toLocaleDateString('is-IS'),
                    },
                    {
                      value: [
                        vaccination.vaccinationsAge?.years,
                        formatMessage(messages.years),
                        vaccination.vaccinationsAge?.months,
                        formatMessage(messages.months),
                      ]
                        .filter(Boolean)
                        .join(' '),
                    },
                    {
                      value: vaccination.code ?? '',
                      type: 'link',
                      url: ATC_URL_BASE + vaccination.code,
                    },
                    {
                      value: vaccination.generalComment,
                    },
                  ]
                },
              )}
              footerText={item.comments ?? []}
            />
          ),
          status: item?.vaccinationsStatusName ?? '',
          tag: tagSelector(item?.vaccinationStatus ?? ''),
        })) ?? []
      }
    />
  )
}
