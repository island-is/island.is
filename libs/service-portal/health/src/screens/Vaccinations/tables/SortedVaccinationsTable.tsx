import { useLocale } from '@island.is/localization'
import { SortableTable, formatDate } from '@island.is/service-portal/core'
import { messages } from '../../../lib/messages'
import { Vaccine } from '../dataStructure'
import { tagSelector } from '../../../utils/tagSelector'
import { VaccinationsDetailTable } from './VaccinationsDetailTable'
import { DetailHeader, DetailRow } from '../../../utils/types'
import { ATC_URL_BASE } from '../../../utils/constants'

interface Props {
  data: Array<Vaccine>
}
export const SortedVaccinationsTable = ({ data }: Props) => {
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
      sortByKey="vaccine"
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
                        vaccination.vaccinationAge.years,
                        formatMessage(messages.years),
                        vaccination.vaccinationAge.months,
                        formatMessage(messages.months),
                      ]
                        .filter(Boolean)
                        .join(' '),
                    },
                    {
                      value: vaccination.vaccineName,
                      type: 'link',
                      url: ATC_URL_BASE + vaccination.code,
                    },
                    {
                      value: vaccination.generalComment,
                    },
                  ]
                },
              )}
              footerText={item.comments}
            />
          ),
          status: item?.vaccinationStatusName ?? '',
          tag: tagSelector(item?.vaccinationStatus ?? ''),
        })) ?? []
      }
    />
  )
}
