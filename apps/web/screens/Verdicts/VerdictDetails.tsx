import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'

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
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HeadWithSocialSharing, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  type GetVerdictByIdQuery,
  type GetVerdictByIdQueryVariables,
} from '@island.is/web/graphql/schema'
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

const VerdictDetails: CustomScreen<VerdictDetailsProps> = ({ item }) => {
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
                <Inline alignY="center" space={2}>
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
      {Boolean(item.pdfString) && (
        <Box>
          <Box paddingY={5} background="overlayDefault" printHidden={true}>
            <GridContainer>
              <Box
                display="flex"
                justifyContent="center"
                className={styles.pdfContainer}
                height="full"
                overflow="auto"
                boxShadow="subtle"
              >
                <PdfViewer
                  file={`data:application/pdf;base64,${item.pdfString}`}
                  showAllPages={true}
                  scale={calculatePdfScale(width)}
                />
              </Box>
            </GridContainer>
          </Box>
        </Box>
      )}
      <Box className={styles.hiddenOnScreen}>
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
              <PdfViewer
                file={`data:application/pdf;base64,${item.pdfString}`}
                showAllPages={true}
                scale={1}
              />
            </Box>
          </GridContainer>
        </Box>
      </Box>
      {Boolean(item.richText) && (
        <Box paddingBottom={5}>
          <GridContainer>
            <GridRow>
              <GridColumn offset={['0', '0', '0', '1/9']}>
                <Box>{webRichText([item.richText] as SliceType[])}</Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
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
)
