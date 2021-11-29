import {
  AlertMessage,
  AlertMessageType,
  Button,
  Link,
  ResponsiveSpace,
  LinkContext,
  Text,
} from '@island.is/island-ui/core'
import React, { FC, useState } from 'react'
// import MyPDF from 'pdf-viewer-reactjs'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { ApiActions } from '../../shared'
import { m } from '../../lib/messages'

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

  if (viewCriminalRecord) {
    return (
      <>
        <Button
          circle
          icon="arrowBack"
          onBlur={function noRefCheck() {}}
          onClick={() => setViewCriminalRecord(false)}
          onFocus={function noRefCheck() {}}
          colorScheme="light"
          title="Go back"
        />
        {/* <object
          data={`data:application/pdf;base64,${externalData.getCriminalRecord.data?.pdfBase64}`}
          type="application/pdf"
          width="100%"
        ></object> */}
        <embed
          type="application/pdf"
          src={`data:application/pdf;base64,${externalData.getCriminalRecord.data.contentBase64}`}
          width="100%"
          height="100%"
        ></embed>
        {/* <MyPDF
          document={{
            base64: `data:application/pdf;base64,${externalData.getCriminalRecord.data?.pdfBase64}`,
          }}
        /> */}
      </>
    )
  }

  return (
    <>
      <Text variant="h2" marginBottom={4}>
        {formatText(m.confirmation, application, formatMessage)}
      </Text>
      <Box marginBottom={2} paddingTop={0}>
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
        marginBottom={4}
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

      <Button
        icon="open"
        iconType="outline"
        onBlur={function noRefCheck() {}}
        onClick={() => setViewCriminalRecord(true)}
        onFocus={function noRefCheck() {}}
        variant="text"
      >
        Sakavottorðið geturðu einnig fundið í pósthólfinu þínu
      </Button>

      <Box display="flex" justifyContent="center" marginTop={2}>
        <img
          src="/assets/images/bus.svg"
          alt={formatText(m.paymentImage, application, formatMessage)}
          style={{ maxWidth: 220 }}
        />
      </Box>
    </>
  )
}
