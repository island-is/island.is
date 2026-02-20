import { ApolloError } from '@apollo/client'
import { Input, SkeletonLoader } from '@island.is/island-ui/core'
import { Box, Text, Table as T } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { alignRight } from './ExpandableRow/ExpandableRow.css'
import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

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
    tableData: React.ReactElement[][]
  }
}) => {
  const { formatMessage } = useLocale()
  const [searchValue, setSearchValue] = useState('')

  const filteredDelegations = useMemo(() => {
    if (!searchValue) {
      return tableData
    }

    return tableData.filter((person) => {
      const searchValueLower = searchValue.toLowerCase()
      const name = person[0]?.props?.identity.name?.toLowerCase()
      const nationalId = person[0]?.props?.identity.nationalId?.toLowerCase()

      return (
        name?.includes(searchValueLower) || nationalId?.includes(searchValue)
      )
    })
  }, [searchValue, tableData])

  return (
    <Box
      marginBottom={[4, 4, 6]}
      display="flex"
      flexDirection="column"
      rowGap={2}
    >
      <Box
        display="flex"
        alignItems="center"
        columnGap={2}
        justifyContent="spaceBetween"
      >
        <Text variant="h5">{title}</Text>
        {tableData?.length > 5 && (
          <Input
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={formatMessage(m.searchPlaceholder)}
            size="xs"
            type="text"
            backgroundColor="blue"
            icon={{ name: 'search' }}
          />
        )}
      </Box>
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
            {filteredDelegations?.map((row, i) => {
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
