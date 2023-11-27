import { formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  PdfLinkButtonField,
  StaticText,
} from '@island.is/application/types'
import {
  Box,
  Button,
  Link,
  LinkContext,
  PdfViewer,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import * as styles from './PdfLinkButtonFormField.css'

interface Props extends FieldBaseProps {
  field: PdfLinkButtonField
}

export const PdfLinkButtonFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
}) => {
  const { lang, formatMessage } = useLocale()
  const [fileToView, setFileToView] = useState<
    | {
        base64: string
        buttonText?: StaticText
        customButtonText?: { is: string; en: string }
      }
    | undefined
  >(undefined)

  const files = field.getPdfFiles && field.getPdfFiles(application)

  if (!field.condition || !files || files.length === 0) return undefined

  if (fileToView) {
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
            onClick={() => {
              // field.setIsViewingFile(false)
              setFileToView(undefined)
            }}
            colorScheme="light"
            title="Go back"
          />
          <a
            href={`data:application/pdf;base64,${fileToView.base64}`}
            download="sakavottord.pdf"
            className={styles.linkWithoutDecorations}
          >
            <Button icon="download" iconType="outline" variant="text">
              {formatText(
                field.downloadButtonTitle,
                application,
                formatMessage,
              )}
            </Button>
          </a>
        </Box>

        <PdfViewer file={`data:application/pdf;base64,${fileToView.base64}`} />
      </>
    )
  }

  return (
    <>
      {files.map((file) => (
        <Box marginBottom={2}>
          <TopicCard
            onClick={() => {
              // field.setIsViewingFile(true)
              setFileToView(file)
            }}
            tag="Pdf"
            colorScheme="blue"
          >
            {file.buttonText &&
              formatText(file.buttonText, application, formatMessage)}
            {file.customButtonText &&
              (lang === 'is'
                ? file.customButtonText.is
                : file.customButtonText.en)}
          </TopicCard>
        </Box>
      ))}
      <Box background="blue100" padding={4} display="flex">
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
              field.vertificationDescription,
              application,
              formatMessage,
            )}{' '}
            <Link
              href={formatText(
                field.vertificationLinkUrl,
                application,
                formatMessage,
              )}
              color="blue400"
              underline="normal"
              underlineVisibility="always"
            >
              {formatText(
                field.vertificationLinkTitle,
                application,
                formatMessage,
              )}
            </Link>
          </Text>
        </LinkContext.Provider>
      </Box>
    </>
  )
}
