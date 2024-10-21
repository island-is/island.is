import React, { FC, useEffect, useState } from 'react'

import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useForm, useFormContext } from 'react-hook-form'
import {
  advancedLicenseMap,
  AdvancedLicense as AdvancedLicenseEnum,
} from '../../lib/constants'
import { useLocale } from '@island.is/localization'

const AdvancedLicense: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { getValues } = useForm()
  const { setValue, watch } = useFormContext()

  const advancedLicenseValue = watch('advancedLicense')
  console.log('advancedLicenseValue', advancedLicenseValue)
  const [selectedLicenses, setSelectedLicenses] = useState<
    Array<keyof typeof AdvancedLicenseEnum>
  >([])

  useEffect(() => {
    if (selectedLicenses) {
      setValue('advancedLicense', selectedLicenses)
    }
  }, [selectedLicenses, setValue])

  const values = getValues()

  console.log('values', values)

  return (
    <Box marginBottom={4}>
      {advancedLicenseMap.map((option, index) => (
        <Box
          key={index}
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
              `applicationForAdvancedLicenseApplyFor${option.code}`,
            )}
          </Text>
          <Checkbox
            label="hey"
            id="hey"
            backgroundColor="blue"
            labelVariant="medium"
            onChange={(e) => {
              const checked = e.target.checked

              setSelectedLicenses((prev) => {
                if (checked) {
                  return [...prev, option.code]
                }

                // remove the sub license if the main license is unchecked
                if (!checked) {
                  return prev.filter(
                    (item) => item !== option.professional?.code,
                  )
                }

                return prev.filter((item) => item !== option.code)
              })
            }}
          />
          {option?.professional && (
            <Box marginTop={3}>
              <Checkbox
                disabled={!selectedLicenses.includes(option.code)}
                label="hey"
                id="hey44"
                backgroundColor="blue"
                labelVariant="small"
                onChange={(e) => {
                  setSelectedLicenses((prev) => {
                    if (e.target.checked && option.professional?.code) {
                      return [...prev, option.professional.code]
                    }

                    return prev.filter(
                      (item) =>
                        option.professional?.code &&
                        item !== option.professional.code,
                    )
                  })
                }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

export { AdvancedLicense }
