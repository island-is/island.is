import { formatTextWithLocale } from '@island.is/application/core'
import {
  Application,
  FormTextWithLocale,
  KeyValueItem,
  TableData,
} from '@island.is/application/types'
import { Box, GridColumn, Table } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

type Props = {
  data: TableData
  application: Application
  title: FormTextWithLocale | undefined
  description: FormTextWithLocale | undefined
  filteredItems: KeyValueItem[] | undefined
  loadedItems: KeyValueItem[] | undefined
}

export const RenderTableData = ({
  data,
  application,
  title,
  description,
  filteredItems,
  loadedItems,
}: Props) => {
  const { formatMessage, lang: locale } = useLocale()

  return (
    <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
      <Box
        marginTop={filteredItems || loadedItems || description || title ? 0 : 8}
      >
        <Table.Table>
          <Table.Head>
            <Table.Row>
              {data.header.map((cell, index) => (
                <Table.HeadData key={`header-${index}`}>
                  {formatTextWithLocale(
                    cell,
                    application,
                    locale,
                    formatMessage,
                  )}
                </Table.HeadData>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {data.rows.map((row, rowIndex) => (
              <Table.Row key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <Table.Data key={`row-${rowIndex}-cell-${cellIndex}`}>
                    {formatTextWithLocale(
                      cell,
                      application,
                      locale,
                      formatMessage,
                    )}
                  </Table.Data>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Table>
      </Box>
    </GridColumn>
  )
}
