import {
  AlertMessage,
  Button,
  TopicCard,
  Link,
  LinkContext,
  Text,
  Divider,
  PdfViewer,
} from '@island.is/island-ui/core'

import React, { FC, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, PdfViewerField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { applicationUiFields as m } from '../../messages'

interface PdfViewerFieldProps extends FieldBaseProps {
  field: PdfViewerField
}

export const PdfViewerFormField: FC<
  React.PropsWithChildren<PdfViewerFieldProps>
> = ({ field, application }) => {
  const { externalData } = application
  const {
    openMySitesLabel,
    downloadPdfButtonLabel,
    successTitle,
    successDescription,
    verificationDescription,
    verificationLinkTitle,
    verificationLinkUrl,
    viewPdfButtonLabel,
    openInboxButtonLabel,
    confirmationMessage,
    pdfKey,
  } = field
  const { formatMessage } = useLocale()
  const [viewPdf, setViewPdf] = useState(false)
  const pdfExt = getValueViaPath(externalData, pdfKey)
  function renderFooter() {
    return (
      <>
        <Divider />
        <Box
          display="flex"
          justifyContent="flexEnd"
          paddingTop={4}
          marginBottom={4}
        >
          <Button
            icon="arrowForward"
            iconType="outline"
            onClick={() => {
              window.open(`${window.location.origin}/minarsidur`, '_blank')
            }}
          >
            {formatText(
              openMySitesLabel || m.openMySitesLabel,
              application,
              formatMessage,
            )}
          </Button>
        </Box>
      </>
    )
  }

  if (viewPdf) {
    return (
      <>
        <Box
          display="flex"
          marginBottom={2}
          justifyContent="spaceBetween"
          alignItems="center"
        >
          <Button
            circle
            icon="arrowBack"
            onClick={() => setViewPdf(false)}
            colorScheme="light"
            title="Go back"
          />
          <a
            href={`data:application/pdf;base64,${pdfExt}`}
            download="sakavottord.pdf"
          >
            <Button icon="download" iconType="outline" variant="text">
              {formatText(
                downloadPdfButtonLabel || m.downloadPdfButtonLabel,
                application,
                formatMessage,
              )}
            </Button>
          </a>
        </Box>

        <PdfViewer file={`data:application/pdf;base64,${pdfExt}`} />
        {renderFooter()}
      </>
    )
  }

  return (
    <>
      <Text variant="h2" marginBottom={4}>
        {formatText(
          confirmationMessage || m.confirmationMessage,
          application,
          formatMessage,
        )}
      </Text>
      <Box marginBottom={3} paddingTop={0}>
        <AlertMessage
          type="success"
          title={formatText(
            successTitle || m.successTitle,
            application,
            formatMessage,
          )}
          message={
            <Box component="span" display="block">
              <Text variant="small">
                {formatText(
                  successDescription || m.successDescription,
                  application,
                  formatMessage,
                )}
              </Text>
            </Box>
          }
        />
      </Box>
      <Box
        marginBottom={3}
        marginTop={0}
        background="blue100"
        padding={4}
        display="flex"
      >
        <LinkContext.Provider
          value={{
            linkRenderer: (href, children) => (
              <a
                style={{
                  color: '#0061ff',
                  textDecoration: 'none',
                  boxShadow: 'inset 0 -1px 0 0 currentColor',
                  paddingBottom: 4,
                }}
                href={href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {children}
              </a>
            ),
          }}
        >
          <Text variant="small">
            {formatText(
              verificationDescription || m.verificationDescription,
              application,
              formatMessage,
            )}
            <Link
              href={formatText(
                verificationLinkUrl || m.verificationLinkUrl,
                application,
                formatMessage,
              )}
              color="blue400"
              underline="normal"
              underlineVisibility="always"
            >
              {formatText(
                verificationLinkTitle || m.verificationLinkTitle,
                application,
                formatMessage,
              )}
            </Link>
          </Text>
        </LinkContext.Provider>
      </Box>

      <Box marginBottom={3}>
        <TopicCard
          onClick={(event) => {
            setViewPdf(true)
          }}
          tag="Pdf"
          colorScheme="blue"
        >
          {formatText(
            viewPdfButtonLabel || m.viewPdfButtonLabel,
            application,
            formatMessage,
          )}
        </TopicCard>
      </Box>

      <Button
        icon="open"
        iconType="outline"
        onClick={() => {
          window.open(
            formatText(
              `${window.location.origin}/minarsidur/postholf`,
              application,
              formatMessage,
            ),
            '_blank',
          )
        }}
        variant="text"
      >
        {formatText(
          openInboxButtonLabel || m.openInboxButtonLabel,
          application,
          formatMessage,
        )}
      </Button>

      <Box
        display="flex"
        justifyContent="center"
        marginTop={2}
        marginBottom={4}
      ></Box>
      {renderFooter()}
    </>
  )
}
