import { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLazyQuery, useQuery } from '@apollo/client'

import {
  AlertBanner,
  Box,
  Button,
  GridColumn,
  GridRow,
  Hyphen,
  Icon,
  LoadingDots,
  Pagination,
  PdfViewer,
  Select,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type {
  ConnectedComponent,
  GetOneSystemsRulingsQuery,
  GetOneSystemsRulingsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import {
  GET_ONE_SYSTEMS_RULING_PDF,
  GET_ONE_SYSTEMS_RULINGS,
} from '@island.is/web/screens/queries'

import { m } from './translation.strings'

interface ComplaintsCommitteeRulingsProps {
  slice: ConnectedComponent
}

interface RulingPdfData {
  oneSystemsRulingPdf: {
    base64: string
    contentType: string
  }
}

const DATE_FORMAT = 'd. MMMM yyyy'
const ITEMS_PER_PAGE = 10
const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 2019 }, (_, i) => ({
  label: String(currentYear - i),
  value: currentYear - i,
}))

const ComplaintsCommitteeRulings = ({
  slice,
}: ComplaintsCommitteeRulingsProps) => {
  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    slice.configJson?.input?.year ?? currentYear,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [pdfBase64, setPdfBase64] = useState<string | null>(null)
  const [pdfTitle, setPdfTitle] = useState<string>('')
  const [pdfError, setPdfError] = useState<boolean>(false)

  const { data, loading, error } = useQuery<
    GetOneSystemsRulingsQuery,
    GetOneSystemsRulingsQueryVariables
  >(GET_ONE_SYSTEMS_RULINGS, {
    variables: {
      input: {
        year: selectedYear,
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
      },
    },
    fetchPolicy: 'no-cache',
    ssr: false,
  })

  const [fetchPdf] = useLazyQuery<RulingPdfData>(GET_ONE_SYSTEMS_RULING_PDF, {
    fetchPolicy: 'no-cache',
  })

  const handleOpenPdf = useCallback(
    async (id: string, title: string) => {
      if (downloadingId) return

      setDownloadingId(id)
      setPdfBase64(null)
      setPdfError(false)
      try {
        const { data: pdfData } = await fetchPdf({ variables: { id } })

        if (pdfData?.oneSystemsRulingPdf?.base64) {
          setPdfBase64(pdfData.oneSystemsRulingPdf.base64)
          setPdfTitle(title)
        }
      } catch (e) {
        setPdfError(true)
      }
      setDownloadingId(null)
    },
    [fetchPdf, downloadingId],
  )

  if (error) {
    return (
      <Box
        background="red100"
        borderColor="red200"
        borderWidth="standard"
        borderRadius="large"
        padding={3}
      >
        <Text color="red600">{formatMessage(m.errorLoadingRulings)}</Text>
      </Box>
    )
  }

  const items =
    data?.oneSystemsRulings?.rulings?.filter((ruling) => Boolean(ruling.id)) ??
    []

  const totalCount = data?.oneSystemsRulings?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handleYearChange = (option: { value: number } | null) => {
    setSelectedYear(option?.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Stack space={5}>
      {pdfBase64 && (
        <Box>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            marginBottom={2}
          >
            <Button
              variant="text"
              size="small"
              preTextIcon="arrowBack"
              preTextIconType="outline"
              onClick={() => setPdfBase64(null)}
            >
              {formatMessage(m.goBack)}
            </Button>
            <a
              href={`data:application/pdf;base64,${pdfBase64}`}
              download={`${pdfTitle || 'ruling'}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant="text"
                size="small"
                icon="download"
                iconType="outline"
                as="span"
              >
                {formatMessage(m.downloadPdf)}
              </Button>
            </a>
          </Box>
          {pdfTitle && (
            <Box marginBottom={2}>
              <Text variant="h3" as="h3">
                {pdfTitle}
              </Text>
            </Box>
          )}
          <PdfViewer file={`data:application/pdf;base64,${pdfBase64}`} />
        </Box>
      )}

      {pdfError && (
        <AlertBanner
          variant="error"
          title={formatMessage(m.errorLoadingPdf)}
          onDismiss={() => setPdfError(false)}
        />
      )}

      {!pdfBase64 && (
        <Stack space={3}>
          <GridRow>
            <GridColumn span={['12/12', '6/12', '4/12', '3/12']}>
              <Select
                name="year"
                label={formatMessage(m.yearLabel)}
                placeholder={formatMessage(m.yearPlaceholder)}
                options={years}
                value={years.find((y) => y.value === selectedYear) ?? null}
                onChange={handleYearChange}
                size="sm"
            />
          )}

          {!loading && items.length === 0 && (
            <Text>{formatMessage(m.noRulingsFound)}</Text>
          )}

          {!loading && items.length > 0 && (
            <Stack space={5}>
              <Stack space={3}>
                {items.map((ruling, index) => (
                  <Box
                    key={`${ruling.id}-${index}`}
                    background="white"
                    borderColor="blue200"
                    borderWidth="standard"
                    borderRadius="large"
                    padding={3}
                    cursor="pointer"
                    onClick={() => handleOpenPdf(ruling.id, ruling.title)}
                  >
                    <Stack space={2}>
                      <Box
                        display="flex"
                        justifyContent="spaceBetween"
                        alignItems="flexStart"
                      >
                        <Box>
                          <Text variant="h4" as="h3" color="blue400">
                            {ruling.title}
                          </Text>
                          {ruling.description && (
                            <Text marginTop={1}>{ruling.description}</Text>
                          )}
                        </Box>
                        <Box marginLeft={2} flexShrink={0}>
                          {downloadingId === ruling.id ? (
                            <LoadingDots />
                          ) : (
                            <Button
                              variant="text"
                              size="small"
                              icon="open"
                              iconType="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenPdf(ruling.id, ruling.title)
                              }}
                            >
                              {formatMessage(m.viewPdf)}
                            </Button>
                          )}
                        </Box>
                      </Box>
                      {ruling.publishedDate && (
                        <Box display="flex" alignItems="center">
                          <Box marginRight={1}>
                            <Icon
                              icon="calendar"
                              size="small"
                              color="dark300"
                            />
                          </Box>
                          <Text variant="small" color="dark300">
                            {format(
                              new Date(ruling.publishedDate),
                              DATE_FORMAT,
                            )}
                          </Text>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center">
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    renderLink={(page, className, children) => (
                      <button
                        className={className}
                        onClick={() => handlePageChange(page)}
                      >
                        {children}
                      </button>
                    )}
                  />
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default ComplaintsCommitteeRulings
