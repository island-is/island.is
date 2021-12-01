import {
  AlertMessage,
  Button,
  TopicCard,
  Link,
  LinkContext,
  Text,
  Pagination,
  Divider,
  LoadingDots,
  PdfViewer,
} from '@island.is/island-ui/core'
import React, { FC, useState } from 'react'
// import MyPDF from 'pdf-viewer-reactjs'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import * as styles from './ConfirmationField.css'

type ConfirmationFieldProps = {
  field: {
    props: {
      link?: {
        title: string
        url: string
      }
    }
  }
  application: {
    externalData: {
      getCriminalRecord: {
        data: {
          contentBase64: string
        }
      }
    }
  }
}

export const ConfirmationField: FC<FieldBaseProps & ConfirmationFieldProps> = ({
  application,
  field,
}) => {
  const { title, description, props } = field
  const { externalData } = application
  const { formatMessage } = useLocale()
  const [viewCriminalRecord, setViewCriminalRecord] = useState(false)

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
            onBlur={function noRefCheck() {}}
            onClick={() => {
              window.open('https://island.is/minarsidur/', '_blank')
            }}
            onFocus={function noRefCheck() {}}
          >
            {formatText(m.openMySites, application, formatMessage)}
          </Button>
        </Box>
      </>
    )
  }

  if (viewCriminalRecord) {
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
            onBlur={function noRefCheck() {}}
            onClick={() => setViewCriminalRecord(false)}
            onFocus={function noRefCheck() {}}
            colorScheme="light"
            title="Go back"
          />
          <a
            href={`data:application/pdf;base64,${externalData.getCriminalRecord.data.contentBase64}`}
            download="sakavottord.pdf"
            className={styles.linkWithoutDecorations}
          >
            <Button icon="download" iconType="outline" variant="text">
              {formatText(m.downloadCriminalRecord, application, formatMessage)}
            </Button>
          </a>
        </Box>

        <PdfViewer
          file={`data:application/pdf;base64,${externalData.getCriminalRecord.data.contentBase64}`}
        />
        {renderFooter()}
      </>
    )
  }

  return (
    <>
      <Text variant="h2" marginBottom={4}>
        {formatText(m.confirmation, application, formatMessage)}
      </Text>
      <Box marginBottom={3} paddingTop={0}>
        <AlertMessage
          type="success"
          title={formatText(m.successTitle, application, formatMessage)}
          message={
            <Box component="span" display="block">
              <Text variant="small">
                {formatText(m.successDescription, application, formatMessage)}
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
            {formatText(m.vertificationDescription, application, formatMessage)}{' '}
            <Link
              href={formatText(
                m.vertificationLinkUrl,
                application,
                formatMessage,
              )}
              color="blue400"
              underline="normal"
              underlineVisibility="always"
            >
              {formatText(m.vertificationLinkTitle, application, formatMessage)}
            </Link>
          </Text>
        </LinkContext.Provider>
      </Box>

      <Box marginBottom={3}>
        <TopicCard
          href="/"
          onClick={() => setViewCriminalRecord(true)}
          tag="Pdf"
          colorScheme="blue"
        >
          {formatText(m.criminalRecord, application, formatMessage)}
        </TopicCard>
      </Box>
      <Button
        icon="open"
        iconType="outline"
        onBlur={function noRefCheck() {}}
        onClick={() => {
          window.open(
            formatText(m.criminalRecordInboxLink, application, formatMessage),
            '_blank',
          )
        }}
        onFocus={function noRefCheck() {}}
        variant="text"
      >
        {formatText(m.criminalRecordInboxText, application, formatMessage)}
      </Button>

      <Box
        display="flex"
        justifyContent="center"
        marginTop={2}
        marginBottom={4}
      >
        <img
          src="/assets/images/bus.svg"
          alt={formatText(m.paymentImage, application, formatMessage)}
          style={{ maxWidth: 220 }}
        />
      </Box>

      {renderFooter()}
    </>
  )
}
