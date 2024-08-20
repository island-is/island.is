import {
  AlertMessage,
  Button,
  Link,
  LinkContext,
  Text,
  Divider,
} from '@island.is/island-ui/core'

import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Bus } from '../../assets'

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

export const ConfirmationField: FC<
  React.PropsWithChildren<FieldBaseProps & ConfirmationFieldProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()

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
        {formatText(m.criminalRecordInboxText, application, formatMessage)}
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
