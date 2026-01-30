import { ApolloError } from '@apollo/client'
import { SkeletonLoader } from '@island.is/island-ui/core'
import { Box, Text, Table as T } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { alignRight } from './ExpandableRow/ExpandableRow.css'

export const DelegationsTable = ({
  data: { headerArray, tableData },
  title,
  loading,
  error,
}: {
  title: string
  loading: boolean
  error: ApolloError | undefined
  data: {
    headerArray: string[]
    tableData: (string | React.ReactElement)[][]
  }
}) => {
  return (
    <Box marginTop={[4, 4, 6]} display="flex" flexDirection="column" rowGap={2}>
      <Text variant="h5">{title}</Text>
      {loading ? (
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={2} />
        </Box>
      ) : error && !tableData?.length ? (
        <Problem error={error} />
      ) : (
        <T.Table>
          <T.Head>
            <T.Row>
              {/* Todo: translate */}
              {headerArray.map((item, i) => (
                <T.HeadData key={item + i} style={{ paddingInline: 16 }}>
                  <Text variant="medium" fontWeight="semiBold">
                    {item}
                  </Text>
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {tableData?.map((row, i) => {
              return (
                <T.Row key={i}>
                  {row.map((cell, j) => {
                    return (
                      <T.Data key={j} style={{ paddingInline: 16 }}>
                        <Box
                          className={
                            j === row.length - 1 ? alignRight : undefined
                          }
                          style={{ maxWidth: 300 }}
                        >
                          {cell}
                        </Box>
                      </T.Data>
                    )
                  })}
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>
      )}
    </Box>
  )
}
