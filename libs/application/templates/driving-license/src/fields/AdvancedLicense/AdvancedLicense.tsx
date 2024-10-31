import React, { FC, useEffect, useState } from 'react'

import { Box, Checkbox, ErrorMessage, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import {
  organizedAdvancedLicenseMap,
  AdvancedLicense as AdvancedLicenseEnum,
} from '../../lib/constants'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { joinWithAnd } from '../../lib/utils'

const AdvancedLicense: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()

  const requiredMessage = (errors as { advancedLicense?: string })
    ?.advancedLicense
    ? formatMessage(m.applicationForAdvancedRequiredError)
    : ''

  const advancedLicenseValue = watch('advancedLicense') ?? []

  const [selectedLicenses, setSelectedLicenses] =
    useState<Array<keyof typeof AdvancedLicenseEnum>>(advancedLicenseValue)

  useEffect(() => {
    setValue('advancedLicense', selectedLicenses)
  }, [selectedLicenses, setValue])

  return (
    <Box>
      {Object.entries(organizedAdvancedLicenseMap).map(([, options], index) => {
        const s1arr = options.map((option) => {
          return option.code
        })

        const s1 = joinWithAnd(s1arr)

        const s2 = options.find((x) => x.minAge)?.minAge

        const requiredAgeText =
          s1 &&
          s2 &&
          formatMessage(m[`applicationForAdvancedAgeRequired`], {
            licenses: s1,
            age: String(s2),
          })

        return (
          <Box
            key={`license-group-${index}`}
            marginTop={index === 0 ? 2 : 5}
            marginBottom={5}
          >
            {requiredAgeText && (
              <Box marginBottom={2}>
                <Text variant="medium" as="div">
                  {requiredAgeText}
                </Text>
              </Box>
            )}
            {options.map((option) => {
              const name = `field-${option.code}`

              return (
                <Box
                  key={`license-option-${option.code}`}
                  marginBottom={2}
                  paddingX={3}
                  paddingTop={2}
                  paddingBottom={3}
                  background="blue100"
                  borderRadius="large"
                  border="standard"
                >
                  <Text as="div" marginBottom={2}>
                    {formatMessage(
                      m[`applicationForAdvancedLicenseTitle${option.code}`],
                    )}
                  </Text>
                  <Checkbox
                    label={formatMessage(
                      m[`applicationForAdvancedLicenseLabel${option.code}`],
                    )}
                    id={name}
                    name={name}
                    backgroundColor="blue"
                    labelVariant="medium"
                    checked={advancedLicenseValue.includes(option.code)}
                    onChange={() => {
                      setSelectedLicenses((prev) => {
                        return prev.includes(option.code)
                          ? prev
                              .filter((item) => item !== option.code)
                              .filter(
                                (item) => item !== option.professional?.code,
                              )
                          : [...prev, option.code]
                      })
                    }}
                  />
                  {option?.professional?.code && (
                    <Box
                      key={`professional-${option.professional.code}`}
                      marginTop={2}
                      paddingX={3}
                      paddingY={2}
                      background="blue100"
                      borderRadius="large"
                      border="standard"
                    >
                      <Checkbox
                        disabled={!selectedLicenses.includes(option?.code)}
                        label={formatMessage(
                          m[
                            `applicationForAdvancedLicenseLabel${option.professional.code}`
                          ],
                        )}
                        backgroundColor="blue"
                        labelVariant="small"
                        checked={advancedLicenseValue.includes(
                          option?.professional?.code,
                        )}
                        onChange={(e) => {
                          setSelectedLicenses((prev) => {
                            if (e.target.checked && option.professional?.code) {
                              return [...prev, option.professional.code]
                            }

                            return prev.filter(
                              (item) => item !== option.professional?.code,
                            )
                          })
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        )
      })}
      {!selectedLicenses?.length && requiredMessage && (
        <ErrorMessage>
          <div>{requiredMessage}</div>
        </ErrorMessage>
      )}
    </Box>
  )
}

export { AdvancedLicense }
