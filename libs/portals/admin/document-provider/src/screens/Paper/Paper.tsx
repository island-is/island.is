import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { format as formatNationalId } from 'kennitala'
import {
  Box,
  Text,
  Table as T,
  SkeletonLoader,
  Pagination,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
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

  const paperMailArray = data?.documentProviderPaperMailList.paperMail ?? []
  const totalCount = data?.documentProviderPaperMailList.totalCount ?? 0

  return (
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
                <T.HeadData>
                  {formatMessage(m.SingleProviderInstitutionNationalIdLabel)}
                </T.HeadData>
                <T.HeadData>{formatMessage(m.paperOrigin)}</T.HeadData>
                <T.HeadData>{formatMessage(m.paperBooleanTitle)}</T.HeadData>
                <T.HeadData>{formatMessage(m.paperUpdated)}</T.HeadData>
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
                            ? formatMessage(m.yes)
                            : formatMessage(m.no)
                          : ''}
                      </Text>
                    </Box>
                  </T.Data>
                  <T.Data>
                    <Box display="flex" flexDirection="column">
                      <Text>
                        {item.dateUpdated
                          ? format(new Date(item.dateUpdated), 'dd.MM.yyyy')
                          : ''}
                      </Text>
                    </Box>
                  </T.Data>
                </T.Row>
              ))}
            </T.Body>
          </T.Table>
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
      {!error && (
        <Box marginTop={3}>
          <Pagination
            page={page}
            totalPages={Math.ceil(totalCount / DEFAULT_PAGE_SIZE)}
            renderLink={(page, className, children) => (
              <button className={className} onClick={() => setPage(page)}>
                {children}
              </button>
            )}
          />
        </Box>
      )}
    </Box>
  )
}

export default PaperScreen
