import { Box, Text, Table, UseBoxStylesProps } from '@island.is/island-ui/core'
import { UserInfoLine, formatDate } from '@island.is/service-portal/core'
import { StackWithBottomDivider } from '../StackWithBottomDivider/StackWithBottomDivider'
import parseISO from 'date-fns/parseISO'
import isValid from 'date-fns/isValid'
import { isDefined } from '@island.is/shared/utils'

interface Props<T> {
  entries: Array<T>
  title:
    | string
    | {
        singular: string
        plural?: string
      }
  columns: Array<{
    label: string
    key: keyof T
    isDate?: boolean
  }>
  box?: Omit<UseBoxStylesProps, 'component'>
}

export const StackOrTableBlock = <T,>({
  entries,
  title,
  columns,
  box,
}: Props<T>) => {
  if (!entries.length || !columns) {
    return null
  }

  if (entries.length > 1) {
    return (
      <Box {...box}>
        <Text variant="eyebrow" color="purple400" marginBottom={2}>
          {typeof title === 'string' ? title : title.plural}
        </Text>
        <Table.Table>
          <Table.Head>
            <Table.Row>
              {columns.map((c, idx) => (
                <Table.HeadData key={`table-stack-head-row-${idx}`}>
                  {c.label}
                </Table.HeadData>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {entries.map((entry, i) => (
              <Table.Row key={`table-stack-row-${i}`}>
                {columns.map((c, idx) => (
                  <Table.Data key={`table-stack-row-${i}-col-${idx}`}>
                    {entry?.[c.key]?.toString() ?? ''}
                  </Table.Data>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Table>
      </Box>
    )
  }
  const entry = entries[0]

  return (
    <StackWithBottomDivider box={box} space="p2">
      {columns
        .map((c, idx) => {
          let entryVal: string | undefined
          if (c.isDate) {
            const dateString = parseISO(entry[c.key]?.toString() ?? '')
            if (!isValid(dateString)) {
              return null
            }
            entryVal = formatDate(dateString)
          } else {
            entryVal = entry[c.key]?.toString()
          }

          if (!entryVal) {
            return null
          }

          if (idx === 0) {
            return (
              <UserInfoLine
                key={`stack-lines-row-${idx}`}
                title={typeof title === 'string' ? title : title.singular}
                label={c.label}
                content={entryVal?.toString() ?? ''}
              />
            )
          }
          return (
            <UserInfoLine
              key={`stack-lines-row-${idx}`}
              label={c.label}
              content={entryVal?.toString() ?? ''}
            />
          )
        })
        .filter(isDefined)}
    </StackWithBottomDivider>
  )
}
