import { Box, Table as T, Tag } from '@island.is/island-ui/core'
import { messages } from '../../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ExpandHeader, ExpandRow } from '@island.is/portals/my-pages/core'
import { VaccinationsDetailTable } from './VaccinationsDetailTable'
import { DetailHeader, DetailRow } from '../../../utils/types'
import { Vaccine } from '../dataStructure'
import { ATC_URL_BASE } from '../../../utils/constants'

interface Props {
  data: Array<Vaccine>
}

export const VaccinationsTable = ({ data }: Props) => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()
  const headerData: Array<DetailHeader> = [
    {
      value: '',
    },
    {
      value: formatMessage(messages.vaccinatedFor),
    },
    {
      value: formatMessage(messages.vaccinatedLast),
      align: 'right',
    },
    {
      value: formatMessage(messages.vaccinatedStatus),
      align: 'right',
    },
  ]

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

  return (
    <Box>
      <T.Table>
        <ExpandHeader data={headerData} />
        <T.Body>
          {data.map((row, index) => {
            return (
              <ExpandRow
                key={index}
                data={[
                  {
                    value: row.diseaseName,
                  },
                  {
                    value: row.lastVaccinationDate
                      ? row.lastVaccinationDate.toLocaleDateString('is-IS')
                      : ' - ',
                    align: 'right',
                  },
                  {
                    value: (
                      <Tag
                        outlined
                        variant={
                          row.vaccinationStatus === 'expired'
                            ? 'blue'
                            : row.vaccinationStatus === 'unvaccinated'
                            ? 'red'
                            : 'mint'
                        }
                      >
                        {row.vaccinationStatusName}
                      </Tag>
                    ),
                    align: 'right',
                  },
                ]}
              >
                <VaccinationsDetailTable
                  headerData={headerDataDetail}
                  rowData={row.vaccinations?.map(
                    (vaccination, i): Array<DetailRow> => {
                      return [
                        {
                          value: (i + 1).toString(),
                        },
                        {
                          value:
                            vaccination.vaccinationDate.toLocaleDateString(
                              'is-IS',
                            ),
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
                  footerText={row.comments}
                />
              </ExpandRow>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}
