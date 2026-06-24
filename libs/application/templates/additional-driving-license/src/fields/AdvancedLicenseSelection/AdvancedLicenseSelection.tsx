import React, { FC, useEffect, useState } from 'react'

import { Box, Checkbox, ErrorMessage, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import {
  organizedAdvancedLicenseMap,
  AdvancedLicense as AdvancedLicenseEnum,
  DrivingLicenseFakeData,
} from '../../lib/constants'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import * as styles from './AdvancedLicenseSelection.css'

const AdvancedLicenseSelection: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  errors,
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()

  const requiredMessage = (errors as { advancedLicense?: string })
    ?.advancedLicense
    ? formatMessage(m.applicationForAdvancedRequiredError)
    : ''

  const advancedLicenseValue = watch('advancedLicense') ?? []

  const fakeData = watch('fakeData') as DrivingLicenseFakeData | undefined
  const age =
    fakeData?.useFakeData === 'yes'
      ? fakeData.age
      : getValueViaPath<number>(
          application.externalData,
          'nationalRegistry.data.age',
        ) ?? 0

  const [selectedLicenses, setSelectedLicenses] =
    useState<Array<keyof typeof AdvancedLicenseEnum>>(advancedLicenseValue)

  useEffect(() => {
    setValue('advancedLicense', selectedLicenses)
  }, [selectedLicenses, setValue])

  return (
    <Box className={styles.root}>
      {Object.entries(organizedAdvancedLicenseMap).map(([, options], index) => {
        const group = options.find((x) => x.group)?.group
        const groupAge = options.find((x) => x.minAge)?.minAge

        return (
          <Box
            key={`license-group-${index}`}
            marginTop={index === 0 ? 2 : 7}
            marginBottom={5}
          >
            <Box marginBottom={2}>
              <Text variant="h4">
                {group ? formatMessage(m[`groupTitle${group}`]) : ''}
              </Text>
              <Text variant="medium" as="div">
                {formatMessage(m[`applicationForAdvancedAgeRequired`], {
                  age: String(groupAge),
                })}
              </Text>
            </Box>
            {options.map((option) => {
              const name = `field-${option.code}`

              return (
                <Box key={`license-option-${option.code}`} marginBottom={4}>
                  <Checkbox
                    label={formatMessage(
                      m[`applicationForAdvancedLicenseTitle${option.code}`],
                    )}
                    subLabel={formatMessage(
                      m[`applicationForAdvancedLicenseLabel${option.code}`],
                    )}
                    large
                    id={name}
                    name={name}
                    backgroundColor="blue"
                    labelVariant="medium"
                    checked={advancedLicenseValue.includes(option.code)}
                    onChange={() => {
                      setSelectedLicenses((prev) => {
                        if (!prev.includes(option.code)) {
                          return [...prev, option.code]
                        }

                        const codesToRemove =
                          option.code === option.group
                            ? options.flatMap((o) => [
                                o.code,
                                o.professional?.code,
                              ])
                            : [option.code, option.professional?.code]

                        return prev.filter(
                          (item) => !codesToRemove.includes(item),
                        )
                      })
                    }}
                    disabled={
                      (option.code !== option.group &&
                        !advancedLicenseValue.includes(option.group)) ||
                      age < option.minAge
                    }
                  >
                    {option?.professional?.code &&
                      advancedLicenseValue.includes(option.code) && (
                        <Checkbox
                          key={`professional-${option.professional.code}`}
                          id={`field-${option.professional.code}`}
                          name={`field-${option.professional.code}`}
                          label={formatMessage(
                            m[
                              `applicationForAdvancedLicenseLabel${option.professional.code}`
                            ],
                          )}
                          labelVariant="small"
                          checked={advancedLicenseValue.includes(
                            option?.professional?.code,
                          )}
                          onChange={(e) => {
                            setSelectedLicenses((prev) => {
                              if (
                                e.target.checked &&
                                option.professional?.code
                              ) {
                                return [...prev, option.professional.code]
                              }

                              return prev.filter(
                                (item) => item !== option.professional?.code,
                              )
                            })
                          }}
                        />
                      )}
                  </Checkbox>
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

export { AdvancedLicenseSelection }
