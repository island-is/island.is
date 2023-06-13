import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Table } from '@island.is/application/ui-components'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { getApplicationExternalData } from '../../lib/oldAgePensionUtils'
import { Country, getCountryByCode } from '@island.is/shared/utils'

export const ResidenceHistoryTable: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { title, description } = field
  const { lang, formatMessage } = useLocale()
  const { residenceHistory } = getApplicationExternalData(application.externalData)
  console.log('RES HIS ', residenceHistory)
  const formattedData = 
    residenceHistory.map((history) => {
      return {
        country: getCountryByCode(history.country)?.name, //lang === 'is' ? getCountryByCode(history.country)?.nameIsk : getCountryByCode(history.country)?.name,
        periodFrom: history.dateOfChange,
        periodTo: '1234',
        lengthOfStay: '1234',
      }
    }) ?? []

  const data = React.useMemo(() => [...formattedData], [formattedData])

  const columns = React.useMemo(
    () => [
      {
        Header: formatText('Land', application, formatMessage),
        accessor: 'country', // accessor is the "key" in the data
      } as const,
      {
        Header: formatText('Tímabil frá', application, formatMessage),
        accessor: 'periodFrom',
      } as const,
      {
        Header: formatText('Tímabil til', application, formatMessage),
        accessor: 'periodTo',
      } as const,
      {
        Header: formatText(
          'Dvalartími (16-67 ára)',
          application,
          formatMessage,
        ),
        accessor: 'lengthOfStay',
      } as const,
    ],
    [application, formatMessage],
  )

  return (
    <Table
      columns={columns}
      data={data}
      truncate
      // showMoreLabel={formatText(
      //   parentalLeaveFormMessages.shared.salaryLabelShowMore,
      //   application,
      //   formatMessage,
      // )}
      // showLessLabel={formatText(
      //   parentalLeaveFormMessages.shared.salaryLabelShowLess,
      //   application,
      //   formatMessage,
      // )}
    />
  )
}

export default ResidenceHistoryTable