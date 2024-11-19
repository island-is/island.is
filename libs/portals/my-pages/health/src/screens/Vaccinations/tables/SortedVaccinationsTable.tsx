import { HealthDirectorateVaccination } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyTable,
  LinkButton,
  SortableTable,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { HealthTable as VaccinationsDetailTable } from '../../../components/Table/HealthTable'
import { messages } from '../../../lib/messages'
import { tagSelector } from '../../../utils/tagSelector'
import { DetailHeader, DetailRow } from '../../../utils/types'

interface Props {
  data?: Array<HealthDirectorateVaccination>
}
export const SortedVaccinationsTable = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  if (!data || data?.length === 0)
    return <EmptyTable message={formatMessage(messages.noVaccinesRegistered)} />

  return (
    <Box paddingY={4}>
      <SortableTable
        labels={{
          vaccine: formatMessage(messages.vaccinatedFor),
          date: formatMessage(messages.vaccinatedLast),
          status: formatMessage(messages.status),
        }}
        expandable
        defaultSortByKey="vaccine"
        tagOutlined
        items={
          data.map((item, i) => ({
            id: item?.id ?? `${i}`,
            name: item?.name ?? '',
            vaccine: item?.name ?? '',
            date: formatDate(item?.lastVaccinationDate) ?? '',
            status: item?.statusName ?? '',
            tag: tagSelector(item?.status ?? undefined),
            children:
              item.vaccinationsInfo && item.vaccinationsInfo.length > 0 ? (
                <SortableTable
                  labels={{
                    nr: formatMessage(messages.vaccinesTableHeaderNr),
                    date: formatMessage(messages.vaccinesTableHeaderDate),
                    age: formatMessage(messages.vaccinesTableHeaderAge),
                    vaccine: formatMessage(messages.vaccinesTableHeaderVaccine),
                    location: formatMessage(
                      messages.vaccinesTableHeaderLocation,
                    ),
                  }}
                  defaultSortByKey="nr"
                  inner
                  items={
                    item.vaccinationsInfo?.map((vaccination, x) => ({
                      id: vaccination?.id.toString() ?? `${x}`,
                      nr: (x + 1).toString(),
                      date: new Date(vaccination.date).toLocaleDateString(
                        'is-IS',
                      ),
                      age: [
                        vaccination.age?.years,
                        vaccination.age?.years
                          ? formatMessage(messages.years)
                          : undefined,
                        vaccination.age?.months,
                        formatMessage(messages.months),
                      ]
                        .filter(Boolean)
                        .join(' '),
                      vaccine: vaccination.url ? (
                        <LinkButton
                          icon={undefined}
                          size="small"
                          to={vaccination.url ?? '/'}
                          text={vaccination.name ?? ''}
                        />
                      ) : (
                        vaccination.name ?? ''
                      ),
                      location: vaccination.location ?? '',
                    })) ?? []
                  }
                />
              ) : null,
          })) ?? []
        }
      />
    </Box>
  )
}
