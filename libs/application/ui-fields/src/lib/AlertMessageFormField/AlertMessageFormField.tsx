import {
  formatTextWithLocale,
  shouldShowFormItem,
} from '@island.is/application/core'
import { AlertMessage, Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useState } from 'react'
import { Markdown } from '@island.is/shared/components'
import { AlertMessageField, FieldBaseProps } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { useFormContext } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'

interface Props extends FieldBaseProps {
  field: AlertMessageField
}

export const AlertMessageFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const { getValues } = useFormContext()
  const user = useUserInfo()
  const [showAlertMessage, setShowAlertMessage] = useState<boolean>(
    !field.shouldBlockInSetBeforeSubmitCallback,
  )
  if (field.shouldBlockInSetBeforeSubmitCallback) {
    setBeforeSubmitCallback?.(async () => {
      const condition = shouldShowFormItem(
        field,
        {
          ...application.answers,
          ...getValues(),
        },
        application.externalData,
        user,
      )
      if (condition) {
        setShowAlertMessage(true)
        return [false, ''] // Block submit
      }

      return [true, null] // Continue
    })
  }

  return (
    showAlertMessage && (
      <Box
        marginTop={field.marginTop ?? 2}
        marginBottom={field.marginBottom ?? 2}
      >
        <AlertMessage
          type={field.alertType ?? 'default'}
          title={formatTextWithLocale(
            field.title ?? '',
            application,
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
                        {
                          ...application,
                          answers: {
                            ...application.answers,
                            ...getValues(),
                          },
                        },
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
  )
}
