import { HealthDirectorateVaccination } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyTable,
  LinkButton,
  SortableTable,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { Markdown } from '@island.is/shared/components'
import { messages } from '../../../lib/messages'
import { tagSelector } from '../../../utils/tagSelector'
import * as styles from '../tables/VaccinationsTable.css'

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
        mobileTitleKey="vaccine"
        align="left"
        tagOutlined
        items={
          data.map((item, i) => ({
            id: item?.id ?? `${i}`,
            vaccine: item?.name ?? '',
            date: formatDate(item?.lastVaccinationDate) ?? '',
            status: item?.statusName ?? '',
            tag: tagSelector(item?.status ?? undefined),
            children: (
              <Box
                padding={[0, 0, 0, 3]}
                background={['transparent', 'transparent', 'blue100']}
              >
                <Box background="white">
                  <SortableTable
                    labels={{
                      nr: formatMessage(messages.vaccinesTableHeaderNr),
                      date: formatMessage(messages.vaccinesTableHeaderDate),
                      age: formatMessage(messages.vaccinesTableHeaderAge),
                      vaccine: formatMessage(
                        messages.vaccinesTableHeaderVaccine,
                      ),
                      location: formatMessage(
                        messages.vaccinesTableHeaderLocation,
                      ),
                    }}
                    align="left"
                    defaultSortByKey="nr"
                    inner
                    emptyTableMessage={formatMessage(
                      messages.noVaccinesRegistered,
                    )}
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
                            variant="text"
                          />
                        ) : (
                          vaccination.name ?? ''
                        ),
                        location: vaccination.location ?? '',
                      })) ?? []
                    }
                    footer={
                      item.comments && item.comments.length > 0 ? (
                        <Box
                          width="full"
                          paddingY={2}
                          paddingX={5}
                          background="blue100"
                        >
                          <ul color="black">
                            {item.comments?.map((item, i) => (
                              <li key={i} className={styles.footerList}>
                                <Markdown>{item}</Markdown>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      ) : undefined
                    }
                  />
                </Box>
              </Box>
            ),
          })) ?? []
        }
      />
    </Box>
  )
}
