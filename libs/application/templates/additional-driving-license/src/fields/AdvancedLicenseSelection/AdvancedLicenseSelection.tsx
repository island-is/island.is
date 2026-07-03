import React, { FC, useEffect, useState } from 'react'

import {
  Box,
  Checkbox,
  ErrorMessage,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath, YES } from '@island.is/application/core'
import {
  organizedAdvancedLicenseMap,
  AdvancedLicense as AdvancedLicenseEnum,
  DrivingLicenseFakeData,
} from '../../lib/constants'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { hasSelectableAdvancedCategories } from '../../lib/utils'
import * as styles from './AdvancedLicenseSelection.css'

const AdvancedLicenseSelection: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  errors,
  application,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()

  const requiredMessage = (errors as { advancedLicense?: string })
    ?.advancedLicense
    ? formatMessage(m.applicationForAdvancedRequiredError)
    : ''

  const advancedLicenseValue = watch('advancedLicense') ?? []

  const fakeData = watch('fakeData') as DrivingLicenseFakeData | undefined
  const rawAge =
    fakeData?.useFakeData === YES
      ? fakeData.age
      : getValueViaPath<number>(
          application.externalData,
          'nationalRegistry.data.age',
        )
  // Coerce to a number so a non-numeric/empty fake value can't become NaN and
  // silently pass the `age < option.minAge` checks (NaN comparisons are false).
  const age = Number(rawAge) || 0

  // Categories the applicant already holds — these come back in the
  // currentLicense data provider (or fakeData when faking) and are tagged
  // in the list so the applicant can see what they already have.
  const heldCategories: string[] =
    fakeData?.useFakeData === YES
      ? fakeData.advancedCategories ?? []
      : (
          getValueViaPath<Array<{ nr?: string | null; name?: string | null }>>(
            application.externalData,
            'currentLicense.data.categories',
          ) ?? []
        )
          .map((category) => category.nr ?? category.name)
          .filter((code): code is string => !!code)

  const alreadyHasCategory = (code?: string) =>
    !!code && heldCategories.includes(code)

  // Only the advanced codes the applicant already holds — these are shown
  // checked + locked, but are NOT part of the licenses being applied for.
  const heldAdvancedCategories = heldCategories.filter(
    (code): code is keyof typeof AdvancedLicenseEnum =>
      code in AdvancedLicenseEnum,
  )

  // The applied-for licenses never include categories the applicant already
  // holds, so the setBeforeSubmitCallback below keeps the submit/continue
  // blocked until at least one new category is selected.
  const [selectedLicenses, setSelectedLicenses] = useState<
    Array<keyof typeof AdvancedLicenseEnum>
  >(() =>
    advancedLicenseValue.filter(
      (code: keyof typeof AdvancedLicenseEnum) =>
        !heldAdvancedCategories.includes(code),
    ),
  )

  useEffect(() => {
    setValue('advancedLicense', selectedLicenses)
  }, [selectedLicenses, setValue])

  // Block moving past this screen until at least one *new* license (one the
  // applicant doesn't already hold) has been selected — but only when there is
  // actually something selectable, so an applicant who already holds every
  // age-reachable category isn't stuck with an unclearable required error.
  const canSelectSomething = hasSelectableAdvancedCategories(
    age,
    heldCategories,
  )

  useEffect(() => {
    if (!setBeforeSubmitCallback) return

    setBeforeSubmitCallback(async () => {
      if (canSelectSomething && selectedLicenses.length === 0) {
        return [false, formatMessage(m.applicationForAdvancedRequiredError)]
      }
      return [true, null]
    })
  }, [setBeforeSubmitCallback, selectedLicenses, canSelectSomething, formatMessage])

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
              const alreadyHas = alreadyHasCategory(option.code)

              return (
                <Box key={`license-option-${option.code}`} marginBottom={4}>
                  <Checkbox
                    label={
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        columnGap={1}
                      >
                        {formatMessage(
                          m[`applicationForAdvancedLicenseTitle${option.code}`],
                        )}
                        {alreadyHas && (
                          <Box
                            pointerEvents="none"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            <Tag variant="mint">
                              {formatMessage(
                                m.applicationForAdvancedLicenseAlreadyHas,
                              )}
                            </Tag>
                          </Box>
                        )}
                      </Box>
                    }
                    subLabel={formatMessage(
                      m[`applicationForAdvancedLicenseLabel${option.code}`],
                    )}
                    large
                    id={name}
                    name={name}
                    backgroundColor="blue"
                    labelVariant="medium"
                    checked={
                      selectedLicenses.includes(option.code) || alreadyHas
                    }
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
                      alreadyHas ||
                      (option.code !== option.group &&
                        !selectedLicenses.includes(option.group) &&
                        !alreadyHasCategory(option.group)) ||
                      age < option.minAge
                    }
                  >
                    {option?.professional?.code &&
                      (selectedLicenses.includes(option.code) ||
                        alreadyHas) && (
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
                          disabled={alreadyHasCategory(
                            option.professional.code,
                          )}
                          checked={
                            selectedLicenses.includes(
                              option.professional.code,
                            ) || alreadyHasCategory(option.professional.code)
                          }
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
