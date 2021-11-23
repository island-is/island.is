import {
  AlertMessage,
  AlertMessageType,
  Button,
  Link,
  ResponsiveSpace,
  Text,
} from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'

type FieldAlertMessageProps = {
  field: {
    props: {
      links: {
        title: string
        url: string
      }[]
      type: AlertMessageType
      marginBottom?: ResponsiveSpace
      marginTop?: ResponsiveSpace
      successTitle?: string
    }
  }
}

export const SuccessMessageField: FC<
  FieldBaseProps & FieldAlertMessageProps
> = ({ application, field }) => {
  const { title, description, props } = field
  const { formatMessage } = useLocale()
  const {
    links,
    type,
    marginBottom = 2,
    marginTop = 0,
    successTitle = '',
  } = props
  return (
    <Box marginBottom={marginBottom} paddingTop={marginTop}>
      <AlertMessage
        type={type ?? 'success'}
        title={formatText(successTitle, application, formatMessage)}
        message={
          <>
            {description && (
              <Box component="span" display="block">
                <Text variant="small">
                  {formatText(description, application, formatMessage)}
                </Text>
              </Box>
            )}
            {links && (
              <Box component="span" display="flex" marginTop={2}>
                {links.map((link, index) => (
                  <Box component="span" marginRight={2} key={index}>
                    <Link href={link.url}>
                      <Button
                        variant="text"
                        icon="open"
                        iconType="outline"
                        size="small"
                      >
                        {link.title}
                      </Button>
                    </Link>
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
