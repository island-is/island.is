import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'

type FieldAlertMessageProps = {
  field: {
    props: {
      links: {
        title: MessageDescriptor | string
        url: MessageDescriptor | string
        isExternal: boolean
      }[]
    }
  }
}

export const FieldAlertMessage: FC<FieldBaseProps & FieldAlertMessageProps> = ({
  application,
  field,
}) => {
  const { title, description, props } = field
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={5}>
      <AlertMessage
        type="info"
        title={formatText(title, application, formatMessage)}
        message={
          <>
            <Box component="span" display="block">
              <Text variant="small">
                {description
                  ? formatText(description, application, formatMessage)
                  : undefined}
              </Text>
            </Box>
            {props.links && (
              <Box display="flex" flexWrap="wrap" marginTop={2}>
                {props.links.map((link, index) => (
                  <Box component="span" marginRight={2} key={index}>
                    <a
                      href={formatMessage(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="text"
                        icon={link.isExternal ? 'open' : undefined}
                        iconType={link.isExternal ? 'outline' : undefined}
                        size="small"
                        as="span"
                      >
                        {formatMessage(link.title)}
                      </Button>
                    </a>
                  </Box>
                ))}
              </Box>
            )}
          </>
        }
      />
    </Box>
  )
}
