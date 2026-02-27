import { ApolloError } from '@apollo/client'
import {
  Box,
  Icon,
  Input,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
  UserAvatar,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { alignRight } from './ExpandableRow/ExpandableRow.css'
import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { MobileRowData } from './getTableData'
import { formatNationalId } from '@island.is/portals/core'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './Tables.css'

export const DelegationsTable = ({
  data: { headerArray, tableData, mobileRows },
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
    mobileRows?: MobileRowData[]
  }
}) => {
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
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

  const filteredMobileRows = useMemo(() => {
    if (!searchValue || !mobileRows) return mobileRows

    return mobileRows.filter((row) => {
      const searchValueLower = searchValue.toLowerCase()
      const name = row.identity.name?.toLowerCase()
      const nationalId = row.identity.nationalId?.toLowerCase()

      return (
        name?.includes(searchValueLower) || nationalId?.includes(searchValue)
      )
    })
  }, [searchValue, mobileRows])

  return (
    <Box
      marginBottom={6}
      display="flex"
      flexDirection="column"
      rowGap={[0, 0, 0, 2]}
    >
      <Box
        display="flex"
        flexDirection={['column', 'row', 'column', 'row']}
        alignItems={['stretch', 'center', 'stretch', 'center']}
        columnGap={1}
        rowGap={2}
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
      ) : isMobile && filteredMobileRows ? (
        <Box>
          {filteredMobileRows.map((mobileRow, idx) => (
            <Box
              key={`${mobileRow.identity.nationalId}-${idx}`}
              className={styles.mobileDivider}
              paddingTop={3}
              marginTop={idx === 0 ? 0 : 3}
              position="relative"
            >
              <Box
                display="flex"
                alignItems="center"
                columnGap={1}
                marginBottom={1}
              >
                {mobileRow.icon ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    background="blue100"
                    style={{ width: 32, height: 32, flexShrink: 0 }}
                  >
                    <Icon icon={mobileRow.icon} color="blue400" />
                  </Box>
                ) : (
                  <UserAvatar
                    color="blue"
                    username={mobileRow.identity.name}
                    size="medium"
                  />
                )}
                <Text variant="h4" as="h2" color="blue400">
                  {mobileRow.identity.name}
                </Text>
              </Box>

              <Box marginBottom={2}>
                <Stack space={1}>
                  <Box display="flex" flexDirection="row">
                    <Box width="half" display="flex" alignItems="center">
                      <Text fontWeight="semiBold" variant="default">
                        {formatMessage(m.nationalId)}
                      </Text>
                    </Box>
                    <Box width="half">
                      <Text variant="default">
                        {formatNationalId(mobileRow.identity.nationalId)}
                      </Text>
                    </Box>
                  </Box>
                  {mobileRow.dataRows.map((dataRow, j) => (
                    <Box key={j} display="flex" flexDirection="row">
                      <Box width="half" display="flex" alignItems="center">
                        <Text fontWeight="semiBold" variant="default">
                          {dataRow.label}
                        </Text>
                      </Box>
                      <Box width="half">
                        <Text variant="default">{dataRow.content}</Text>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box marginBottom={1}>{mobileRow.action}</Box>
            </Box>
          ))}
        </Box>
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
