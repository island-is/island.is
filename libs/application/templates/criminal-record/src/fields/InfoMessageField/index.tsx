import {
  AlertMessage,
  AlertMessageType,
  Button,
  Link,
  ResponsiveSpace,
  LinkContext,
  Text,
} from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { ApiActions } from '../../shared'

type InfoMessageFieldProps = {
  field: {
    props: {
      link?: {
        title: string
        url: string
      }
      marginBottom?: ResponsiveSpace
      marginTop?: ResponsiveSpace
    }
  }
  application: {
    externalData: {
      getCriminalRecord: {
        data: {
          pdfBase64: string
        }
      }
    }
  }
}

export const InfoMessageField: FC<FieldBaseProps & InfoMessageFieldProps> = ({
  application,
  field,
}) => {
  const { title, description, props } = field
  const { externalData } = application
  const { formatMessage } = useLocale()
  const { link, marginBottom = 2, marginTop = 0 } = props

  return (
    <>
      <Box
        marginBottom={marginBottom}
        marginTop={marginTop}
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
            {description && formatText(description, application, formatMessage)}{' '}
            <Link
              href={link?.url || ''}
              color="blue400"
              underline="normal"
              underlineVisibility="always"
            >
              {link?.title}
            </Link>
          </Text>
        </LinkContext.Provider>
      </Box>
      <object
        data={`data:application/pdf;base64,${externalData.getCriminalRecord.data?.pdfBase64}`}
        // type="application/pdf"
      ></object>
      <iframe
        src={`data:application/pdf;base64,${externalData.getCriminalRecord.data?.pdfBase64}`}
      ></iframe>
    </>
  )
}
