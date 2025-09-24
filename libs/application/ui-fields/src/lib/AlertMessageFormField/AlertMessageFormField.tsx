import {
  formatTextWithLocale,
  shouldShowFormItem,
} from '@island.is/application/core'
import {
  AlertMessage,
  Box,
  Button,
  getTextStyles,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect } from 'react'
import { Markdown } from '@island.is/shared/components'
import { AlertMessageField, FieldBaseProps } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { useFormContext } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'
import cn from 'classnames'

interface Props extends FieldBaseProps {
  field: AlertMessageField
}

const divWithSmallText = cn(getTextStyles({ variant: 'small' }))

export const AlertMessageFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const { getValues, setValue, watch } = useFormContext()
  const user = useUserInfo()

  // Use form state to control alert visibility instead of a local React state variable.
  // This ensures the alert updates correctly when the beforeSubmit callback triggers
  // and prevents React state from being out-of-sync with form values.
  const showAlertMessage = watch(
    'showAlertMessage',
    !field.shouldBlockInSetBeforeSubmitCallback,
  )

  // Register the beforeSubmit callback inside a useEffect to ensure it only runs
  // once when the component mounts. Since `screen.tsx` now supports multiple
  // callbacks, we don't want to register the same AlertMessage callback on
  // every render and accidentally duplicate it.
  useEffect(() => {
    if (field.shouldBlockInSetBeforeSubmitCallback) {
      setBeforeSubmitCallback?.(
        async () => {
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
            setValue('showAlertMessage', true)
            return [false, ''] // Block submit
          }

          return [true, null] // Continue
        },
        { allowMultiple: true },
      )
    }
  }, [
    field,
    application.answers,
    application.externalData,
    getValues,
    setBeforeSubmitCallback,
    setValue,
    user,
  ])

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
                  <Box component="div" className={divWithSmallText}>
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
                  </Box>
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
