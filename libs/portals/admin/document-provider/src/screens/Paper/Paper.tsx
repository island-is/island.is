import React, { useCallback, useState } from 'react'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { format as formatNationalId } from 'kennitala'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Table as T,
  SkeletonLoader,
  Pagination,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { documentProviderNavigation } from '../../lib/navigation'
import { useGetPaperMailListQuery } from './PaperMail.generated'
import { Problem } from '@island.is/react-spa/shared'

const DEFAULT_PAGE_SIZE = 10

const PaperScreen = () => {
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)

  const { data, loading, error } = useGetPaperMailListQuery({
    variables: {
      input: {
        page: page,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    },
  })

  if (error) {
    return <Problem error={error} />
  }

  const paperMailArray = data?.getPaperMailList.paperMail ?? []
  const totalCount = data?.getPaperMailList.totalCount ?? 0

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <Box paddingBottom={4}>
            <PortalNavigation
              navigation={documentProviderNavigation}
              title={formatMessage(m.documentProviders)}
            />
          </Box>
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 2]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <Box marginBottom={[2, 3, 5]}>
            <IntroHeader
              title={formatMessage(m.paperTitle)}
              intro={formatMessage(m.paperDescription)}
            />
            {paperMailArray.length ? (
              <Box marginBottom={[2, 3]}>
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>Kennitala</T.HeadData>
                      <T.HeadData>Uppruni</T.HeadData>
                      <T.HeadData>Pappír</T.HeadData>
                      <T.HeadData>Uppfært</T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {paperMailArray.map((item) => (
                      <T.Row key={item.nationalId + item.dateUpdated}>
                        <T.Data>
                          <Box display="flex" flexDirection="column">
                            <Text>{formatNationalId(item.nationalId)}</Text>
                          </Box>
                        </T.Data>
                        <T.Data>
                          <Box display="flex" flexDirection="column">
                            <Text>{item.origin}</Text>
                          </Box>
                        </T.Data>
                        <T.Data>
                          <Box display="flex" flexDirection="column">
                            <Text>
                              {typeof item.wantsPaper === 'boolean'
                                ? item.wantsPaper === true
                                  ? 'Já'
                                  : 'Nei'
                                : ''}
                            </Text>
                          </Box>
                        </T.Data>
                        <T.Data>
                          <Box display="flex" flexDirection="column">
                            <Text>
                              {item.dateUpdated
                                ? format(
                                    new Date(item.dateUpdated),
                                    'dd.MM.yyyy',
                                  )
                                : ''}
                            </Text>
                          </Box>
                        </T.Data>
                      </T.Row>
                    ))}
                  </T.Body>
                </T.Table>
                {totalCount && totalCount > DEFAULT_PAGE_SIZE && (
                  <Box marginTop={3}>
                    <Pagination
                      page={page}
                      totalPages={Math.ceil(totalCount / DEFAULT_PAGE_SIZE)}
                      renderLink={(page, className, children) => (
                        <button
                          className={className}
                          onClick={() => setPage(page)}
                        >
                          {children}
                        </button>
                      )}
                    />
                  </Box>
                )}
              </Box>
            ) : undefined}
            {loading && (
              <Box width="full">
                <SkeletonLoader repeat={8} height={40} space={2} />
              </Box>
            )}
            {!loading && !error && !paperMailArray.length && (
              <Problem type="no_data" noBorder={false} />
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default PaperScreen
