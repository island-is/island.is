import { ApolloError } from '@apollo/client'
import {
  Box,
  Icon,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
  UserAvatar,
} from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { alignRight } from './ExpandableRow/ExpandableRow.css'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
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
  const isMobile = width < theme.breakpoints.lg

  return (
    <Box
      marginBottom={6}
      display="flex"
      flexDirection="column"
      rowGap={[0, 0, 0, 2]}
    >
      <Text variant={isMobile ? 'h4' : 'h5'}>{title}</Text>

      {loading ? (
        <Box padding={3}>
          <SkeletonLoader space={1} height={40} repeat={2} />
        </Box>
      ) : error && !tableData?.length ? (
        <Problem error={error} />
      ) : isMobile && mobileRows ? (
        <MobileDelegationsTable mobileRows={mobileRows} />
      ) : (
        <DesktopDelegationsTable
          headerArray={headerArray}
          tableData={tableData}
        />
      )}
    </Box>
  )
}

const DesktopDelegationsTable = ({
  headerArray,
  tableData,
}: {
  headerArray: string[]
  tableData: React.ReactElement[][]
}) => {
  return (
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
        {tableData?.map((row, i) => {
          return (
            <T.Row key={i}>
              {row.map((cell, j) => {
                return (
                  <T.Data key={j} style={{ paddingInline: 16 }}>
                    <Box
                      className={
                        j === row.length - 1 && headerArray[j] === ''
                          ? alignRight
                          : undefined
                      }
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
  )
}

const MobileDelegationsTable = ({
  mobileRows,
}: {
  mobileRows: MobileRowData[]
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      {mobileRows.map((mobileRow, idx) => (
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
                style={{ width: 40, height: 40, flexShrink: 0 }}
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
            <Text variant="h4" as="h2">
              {mobileRow.identity.name}
            </Text>
          </Box>

          <Box marginBottom={2}>
            <Stack space={1}>
              <Box display="flex" flexDirection="row">
                <Box width="half" display="flex" alignItems="center">
                  <Text fontWeight="semiBold" variant="medium">
                    {formatMessage(m.nationalId)}
                  </Text>
                </Box>
                <Box width="half">
                  <Text variant="medium">
                    {formatNationalId(mobileRow.identity.nationalId)}
                  </Text>
                </Box>
              </Box>
              {mobileRow.dataRows.map((dataRow, j) => (
                <Box key={j} display="flex" flexDirection="row">
                  <Box width="half" display="flex" alignItems="center">
                    <Text fontWeight="semiBold" variant="medium">
                      {dataRow.label}
                    </Text>
                  </Box>
                  <Box width="half">
                    <Text variant="medium">{dataRow.content}</Text>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box marginBottom={1}>{mobileRow.action}</Box>
        </Box>
      ))}
    </Box>
  )
}
