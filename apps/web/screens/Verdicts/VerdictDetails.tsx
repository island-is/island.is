import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import cn from 'classnames'
import capitalize from 'lodash/capitalize'

import type { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
  LinkV2,
  PdfViewer,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HeadWithSocialSharing, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  type GetVerdictByIdQuery,
  type GetVerdictByIdQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  type CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_VERDICT_BY_ID_QUERY } from '../queries/Verdicts'
import { m } from './translations.strings'
import * as styles from './VerdictDetails.css'

const calculatePdfScale = (width: number) => {
  if (width > theme.breakpoints.md) return 1.4
  if (width > theme.breakpoints.sm) return 1
  return 0.63
}

const downloadPdf = (base64String: string, filename = 'download.pdf') => {
  // Convert Base64 to binary data
  const byteCharacters = atob(base64String)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'application/pdf' })

  // Create a download link
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename

  // Append to the DOM and trigger download
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

interface VerdictDetailsProps {
  item: NonNullable<GetVerdictByIdQuery['webVerdictById']>['item']
}

const PdfView = ({ item }: VerdictDetailsProps) => {
  const { width } = useWindowSize()
  const { formatMessage } = useIntl()

  return (
    <>
      <HeadWithSocialSharing title="Dómur" />
      <Box paddingBottom={3}>
        <GridContainer>
          <Box paddingBottom={2}>
            <LinkV2 href="/domar">
              <Hidden print={true}>
                <Button
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                  as="span"
                  unfocusable
                >
                  {formatMessage(m.verdictPage.goBack)}
                </Button>
              </Hidden>
            </LinkV2>
          </Box>
          <GridRow>
            <GridColumn span="1/1" offset={['0', '0', '0', '1/9']}>
              {Boolean(item.pdfString) && (
                <Text variant="h1" as="h1">
                  {formatMessage(m.verdictPage.heading)}
                </Text>
              )}
              <Inline alignY="center" justifyContent="spaceBetween" space={3}>
                <Webreader readClass="rs_read" marginBottom={0} marginTop={2} />
                {Boolean(item.pdfString) && (
                  <Hidden print={true}>
                    <Button
                      icon="attach"
                      iconType="outline"
                      size="small"
                      onClick={() => {
                        downloadPdf(item.pdfString as string)
                      }}
                    >
                      .PDF
                    </Button>
                  </Hidden>
                )}
              </Inline>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {Boolean(item.pdfString) && (
        <Box paddingY={5} background="overlayDefault">
          <GridContainer>
            <Box
              display="flex"
              justifyContent="center"
              className={styles.pdfContainer}
              height="full"
              overflow="auto"
              boxShadow="subtle"
            >
              <Box printHidden={true} className="rs_read">
                <PdfViewer
                  file={`data:application/pdf;base64,${item.pdfString}`}
                  showAllPages={true}
                  scale={calculatePdfScale(width)}
                />
              </Box>
              <Box className={styles.hiddenOnScreen}>
                <PdfViewer
                  file={`data:application/pdf;base64,${item.pdfString}`}
                  showAllPages={true}
                  scale={1}
                />
              </Box>
            </Box>
          </GridContainer>
        </Box>
      )}
    </>
  )
}

const HtmlView = ({ item }: VerdictDetailsProps) => {
  const { formatMessage } = useIntl()
  const { format } = useDateUtils()
  const logoUrl = formatMessage(m.verdictPage.htmlVerdictLogoUrl)

  const [a, b] = item.title.split('gegn')

  return (
    <>
      <Box paddingBottom={3}>
        <GridContainer>
          <Box paddingBottom={2}>
            <LinkV2 href="/domar">
              <Hidden print={true}>
                <Button
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                  as="span"
                  unfocusable
                >
                  {formatMessage(m.verdictPage.goBack)}
                </Button>
              </Hidden>
            </LinkV2>
          </Box>
          <GridRow>
            <GridColumn span="1/1" offset={['0', '0', '0', '1/9']}>
              <Inline alignY="center" justifyContent="spaceBetween" space={3}>
                <Webreader readClass="rs_read" marginBottom={0} marginTop={2} />
                <Inline alignY="center" space={2}>
                  <Hidden print={true}>
                    <Button
                      icon="print"
                      iconType="outline"
                      size="small"
                      onClick={() => {
                        window.print()
                      }}
                    >
                      {formatMessage(m.verdictPage.print)}
                    </Button>
                  </Hidden>
                </Inline>
              </Inline>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {Boolean(item.richText) && (
        <Box paddingBottom={5}>
          <GridContainer>
            <Box
              display="flex"
              flexDirection="column"
              flexWrap="nowrap"
              alignItems="center"
            >
              <Box paddingBottom={5}>
                <Stack space={2}>
                  {logoUrl && (
                    <Box textAlign="center">
                      <img src={logoUrl} alt="" />
                    </Box>
                  )}
                  <Text variant="h2" as="h1" textAlign="center">
                    {item.court}
                  </Text>
                  <Stack space={1}>
                    <Text variant="h3" as="h2" textAlign="center">
                      {formatMessage(m.verdictPage.caseNumberPrefix)}{' '}
                      {item.caseNumber}
                    </Text>
                    {item.verdictDate && (
                      <Text textAlign="center">
                        {capitalize(
                          format(
                            new Date(item.verdictDate),
                            'eeee d. MMMM yyyy',
                          ).replace('dagur', 'dagurinn'),
                        )}
                      </Text>
                    )}
                    {Boolean(a) && Boolean(b) && (
                      <Box display="flex" justifyContent="center" paddingY={3}>
                        <Box className={styles.verdictHtmlTitleContainer}>
                          <Text>{a.trim()}</Text>
                          <Text>gegn</Text>
                          <Text> {b.trim()}</Text>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                  <Box className={styles.textMaxWidth} paddingX={[0, 6, 8, 12]}>
                    <Text variant="h4" as="h3">
                      {formatMessage(m.verdictPage.keywords)}
                    </Text>
                    <Text>{item.keywords.join(', ')}</Text>
                  </Box>
                  <Box className={styles.textMaxWidth} paddingX={[0, 6, 8, 12]}>
                    <Text variant="h4" as="h3">
                      {formatMessage(m.verdictPage.presentings)}
                    </Text>
                    <Text>{item.presentings}</Text>
                  </Box>
                </Stack>
              </Box>
              <Box
                className={cn('rs_read', styles.textMaxWidth, styles.richText)}
              >
                {webRichText([item.richText] as SliceType[])}
              </Box>
            </Box>
          </GridContainer>
        </Box>
      )}
    </>
  )
}

const VerdictDetails: CustomScreen<VerdictDetailsProps> = ({
  item,
  customPageData,
}) => {
  return (
    <>
      <HeadWithSocialSharing title="Dómur">
        {Boolean(customPageData?.configJson?.noIndexOnVerdictPage) && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>
      {item.pdfString ? <PdfView item={item} /> : <HtmlView item={item} />}
    </>
  )
}

VerdictDetails.getProps = async ({ apolloClient, query, customPageData }) => {
  const verdictResponse = await apolloClient.query<
    GetVerdictByIdQuery,
    GetVerdictByIdQueryVariables
  >({
    query: GET_VERDICT_BY_ID_QUERY,
    variables: {
      input: {
        id: query.id as string,
      },
    },
  })

  const item = verdictResponse?.data?.webVerdictById?.item

  if (!item || (!item?.pdfString && !item?.richText)) {
    throw new CustomNextError(
      404,
      `Verdict with id: ${query.id} could not be found`,
    )
  }

  if (!customPageData?.configJson?.showVerdictDetailPages) {
    throw new CustomNextError(
      404,
      'Verdict detail pages have been turned off in the CMS',
    )
  }

  return {
    item,
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Verdicts, VerdictDetails),
  {
    footerVersion: 'organization',
  },
)
