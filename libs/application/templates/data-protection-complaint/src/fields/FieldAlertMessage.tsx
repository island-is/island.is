import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AlertMessage, Box, Button, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'

type FieldAlertMessageProps = {
  field: {
    props: {
      links: {
        title: string
        url: string
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
              {description
                ? formatText(description, application, formatMessage)
                : undefined}
            </Box>
            {props.links && (
              <Box component="span" display="flex" marginTop={2}>
                {props.links.map((link, index) => (
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
