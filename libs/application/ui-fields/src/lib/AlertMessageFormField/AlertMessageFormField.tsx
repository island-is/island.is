import {
  formatTextWithLocale,
  getValueViaPath,
} from '@island.is/application/core'
import { AlertMessage, Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useMemo } from 'react'
import { Markdown } from '@island.is/shared/components'
import {
  AlertMessageField,
  FieldBaseProps,
  FormValue,
} from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { useWatch } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: AlertMessageField
}

export const AlertMessageFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
}) => {
  const { formatMessage, lang: locale } = useLocale()

  const watchValue = field.watchValue || ''
  const someValue = useWatch({
    name: watchValue,
    defaultValue: getValueViaPath(application.answers, watchValue),
  }) as FormValue
  const updatedApplication = useMemo(
    () => ({
      ...application,
      answers: { ...application.answers, [watchValue]: someValue },
    }),
    [application, watchValue, someValue],
  )

  return (
    <Box
      marginTop={field.marginTop ?? 2}
      marginBottom={field.marginBottom ?? 2}
    >
      <AlertMessage
        type={field.alertType ?? 'default'}
        title={formatTextWithLocale(
          field.title ?? '',
          updatedApplication,
          locale as Locale,
          formatMessage,
        )}
        message={
          <Box>
            <Box component="span" display="block">
              {field.message != null ? (
                <Text variant="small">
                  <Markdown>
                    {formatTextWithLocale(
                      field.message,
                      updatedApplication,
                      locale as Locale,
                      formatMessage,
                    )}
                  </Markdown>
                </Text>
              ) : null}
            </Box>
            {field.links && (
              <Box display="flex" flexWrap="wrap" marginTop={2}>
                {field.links.map((link, index) => (
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
          </Box>
        }
      />
    </Box>
  )
}
