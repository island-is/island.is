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
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import * as styles from './ConfirmationField.css'
import { Bus } from '../../assets/Bus'

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
      noDebtCertificate: {
        data: {
          debtLessCertificateResult: {
            certificate: {
              type: string
              document: string
            }
          }
        }
      }
    }
  }
}

export const ConfirmationField: FC<
  React.PropsWithChildren<FieldBaseProps & ConfirmationFieldProps>
> = ({ application }) => {
  const { externalData } = application
  const { formatMessage } = useLocale()
  const [viewNoDebtCertificate, setViewNoDebtCertificate] = useState(false)
  const { document } =
    externalData.noDebtCertificate.data.debtLessCertificateResult.certificate

  const renderFooter = () => {
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
            {formatText(m.openMySites, application, formatMessage)}
          </Button>
        </Box>
      </>
    )
  }
  if (viewNoDebtCertificate) {
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
            onClick={() => setViewNoDebtCertificate(false)}
            colorScheme="light"
            title="Go back"
          />
          <a
            href={`data:application/pdf;base64,${document}`}
            download="skuldleysisvottord.pdf"
            className={styles.linkWithoutDecorations}
          >
            <Button icon="download" iconType="outline" variant="text">
              {formatText(
                m.downloadNoDebtCertificate,
                application,
                formatMessage,
              )}
            </Button>
          </a>
        </Box>
        <PdfViewer file={`data:application/pdf;base64,${document}`} />
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
                className={styles.linkStyle}
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
            {`${formatText(
              m.vertificationDescription,
              application,
              formatMessage,
            )} `}
            <Link
              href={formatText(
                m.verificationLinkUrl,
                application,
                formatMessage,
              )}
              color="blue400"
              underline="normal"
              underlineVisibility="always"
            >
              {formatText(m.verificationLinkTitle, application, formatMessage)}
            </Link>
          </Text>
        </LinkContext.Provider>
      </Box>

      <Box marginBottom={3}>
        <TopicCard
          onClick={() => setViewNoDebtCertificate(true)}
          tag="Pdf"
          colorScheme="blue"
        >
          {formatText(m.noDebtCertificate, application, formatMessage)}
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
        {formatText(m.noDebtCertificateInboxText, application, formatMessage)}
      </Button>

      <Box
        display="flex"
        justifyContent="center"
        marginTop={2}
        marginBottom={4}
      >
        <Bus />
      </Box>

      {renderFooter()}
    </>
  )
}
