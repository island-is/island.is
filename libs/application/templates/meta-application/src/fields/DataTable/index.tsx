import React, { FC, useMemo } from 'react'
import { Application, formatText } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Table } from '@island.is/application/ui-components'

import { m } from '../../forms/messages'
import isEmpty from 'lodash/isEmpty'

interface DataTableProps {
  application: Application
}

interface Data {
  name: string
  publisher: string
  download: string
}

const DataTable: FC<DataTableProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const isDraft = application.state === 'draft'

  const emptyMessage = formatText(
    isDraft ? m.dataEmptyDraft : m.dataEmpty,
    application,
    formatMessage,
  )

  const data = useMemo(
    () => (application as { answers?: { data?: Data[] } }).answers?.data ?? [],
    [application.answers?.data],
  )
  const columns = React.useMemo(
    () => [
      {
        Header: formatText(m.dataName, application, formatMessage),
        accessor: 'name', // accessor is the "key" in the data
      } as const,
      {
        Header: formatText(m.dataPublisher, application, formatMessage),
        accessor: 'publisher',
      } as const,
      {
        Header: formatText(m.dataDownload, application, formatMessage),
        accessor: 'download',
      } as const,
    ],
    [application, formatMessage],
  )

  return !isEmpty(data) ? (
    <Table
      columns={columns}
      data={data}
      truncate
      showMoreLabel={formatText(m.showMore, application, formatMessage)}
      showLessLabel={formatText(m.showLess, application, formatMessage)}
    />
  ) : (
    <Text>{emptyMessage}</Text>
  )
}

export default DataTable
