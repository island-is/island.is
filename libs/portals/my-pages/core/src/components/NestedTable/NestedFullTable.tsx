import cn from 'classnames'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { tableStyles } from '../../utils/utils'

import * as styles from './NestedTable.css'
import { EmptyTable } from '../EmptyTable/EmptyTable'

interface Props {
  headerArray: string[]
  data: Array<string[]>
  loading?: boolean
  emptyMessage?: string
  flush?: boolean
}

export const NestedFullTable = ({
  headerArray,
  data,
  loading,
  emptyMessage,
  flush,
}: Props) => {
  return (
    <Box
      className={cn(styles.wrapper, { [styles.wrapperFlush]: flush })}
      background="white"
    >
      {!loading && !!data.length && (
        <T.Table>
          <T.Head>
            <T.Row>
              {headerArray.map((item, i) => (
                <T.HeadData
                  box={{
                    textAlign: i > 1 ? 'right' : 'left',
                    paddingRight: 2,
                    paddingLeft: flush && i === 0 ? 1 : 2,
                    className: styles.noBorder,
                  }}
                  key={i}
                  text={{ truncate: true }}
                  style={
                    flush && i === 0
                      ? { ...tableStyles, paddingLeft: 8 }
                      : tableStyles
                  }
                >
                  <Text variant="small" fontWeight="semiBold">
                    {item}
                  </Text>
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {data?.map((row, i) => (
              <T.Row key={i}>
                {row.map((value, ii) => (
                  <T.Data
                    box={{
                      paddingRight: 2,
                      paddingLeft: flush && ii === 0 ? 1 : 2,
                      textAlign: ii > 1 ? 'right' : 'left',
                      background: i % 2 === 0 ? 'white' : undefined,
                      className: styles.noBorder,
                    }}
                    key={ii}
                    style={
                      flush && ii === 0
                        ? { ...tableStyles, paddingLeft: 8 }
                        : tableStyles
                    }
                  >
                    <Text variant="small">{value}</Text>
                  </T.Data>
                ))}
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
      )}
      {(loading || !data.length) && (
        <EmptyTable
          loading={loading}
          message={emptyMessage ?? 'Ekkert fannst'}
        />
      )}
    </Box>
  )
}
