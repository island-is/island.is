import React, { FC } from 'react'
import {
  Text,
  Table as T,
  Column,
  Columns,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { tableStyles } from '../../utils/utils'
import { EmptyTable } from '../EmptyTable/EmptyTable'
import { MessageDescriptor } from 'react-intl'

interface TableItem {
  title: string
  value: string | React.ReactNode
  detail?: string
}

interface Props {
  dataArray: Array<Array<TableItem | null | undefined | ''>>
  title?: string
  subtitle?: string
  mt?: boolean
  loading?: boolean
  emptyMessage?: MessageDescriptor
}

export const TableGrid: FC<React.PropsWithChildren<Props>> = ({
  dataArray,
  title,
  subtitle,
  mt,
  loading,
  emptyMessage,
}) => {
  return (
    <T.Table box={mt ? { marginTop: 'containerGutter' } : undefined}>
      <T.Head>
        <T.Row>
          <T.HeadData colSpan={4} style={tableStyles}>
            <Text variant="medium" fontWeight="semiBold" as="span">
              {title}
            </Text>{' '}
            <Text variant="medium" as="span">
              {subtitle}
            </Text>
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {loading && <EmptyTable message={emptyMessage} loading={loading} />}
        {!loading &&
          dataArray.map((row, ii) => (
            <T.Row key={`row-${ii}`}>
              {row.map(
                (rowitem, iii) =>
                  rowitem && (
                    <T.Data
                      key={`rowitem-${iii}`}
                      colSpan={2}
                      style={tableStyles}
                    >
                      <Columns alignY="center" collapseBelow="lg" space={2}>
                        <Column>
                          <Text
                            title={rowitem.detail}
                            variant="medium"
                            fontWeight="semiBold"
                            as="span"
                          >
                            {rowitem.title}
                          </Text>
                        </Column>
                        <Column>
                          <Text
                            as={
                              typeof rowitem.value === 'string'
                                ? undefined
                                : 'span'
                            }
                            variant="medium"
                            title={rowitem.detail}
                          >
                            {rowitem.value}
                          </Text>
                        </Column>
                      </Columns>
                    </T.Data>
                  ),
              )}
            </T.Row>
          ))}
      </T.Body>
    </T.Table>
  )
}
