import React, { FC, useEffect } from 'react'

import {
  Box,
  Checkbox,
  ErrorMessage,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import {
  organizedAdvancedLicenseMap,
  AdvancedLicense as AdvancedLicenseEnum,
  DrivingLicenseFakeData,
  getApplicantAge,
  getHeldCategories,
  hasSelectableAdvancedCategories,
} from '../../utils'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
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

  const advancedLicenseValue = (watch('advancedLicense') ?? []) as Array<
    keyof typeof AdvancedLicenseEnum
  >

  const fakeData = watch('fakeData') as DrivingLicenseFakeData | undefined
  // Age and held categories are derived the same way on the prerequisites
  // eligibility gate, so both screens share these helpers to stay in sync.
  const age = getApplicantAge(application.externalData, fakeData)
  const heldCategories = getHeldCategories(application.externalData)

  const alreadyHasCategory = (code?: string) =>
    !!code && heldCategories.includes(code)

  // Only the advanced codes the applicant already holds — these are shown
  // checked + locked, but are NOT part of the licenses being applied for.
  const heldAdvancedCategories = heldCategories.filter(
    (code): code is keyof typeof AdvancedLicenseEnum =>
      code in AdvancedLicenseEnum,
  )

  // The form value `advancedLicense` is the single source of truth for what the
  // applicant is applying for. It never includes categories they already hold
  // (those render checked + locked and can't be toggled), so the applied-for
  // selection is derived straight from it and changes are written back
  // immediately. Reading from the form value (rather than mirroring it into
  // local state at mount) means a `Screen` re-render with a transiently-empty
  // form value can't desync the display or wipe the saved selection.
  const selectedLicenses = advancedLicenseValue.filter(
    (code) => !heldAdvancedCategories.includes(code),
  )

  const updateSelected = (
    updater: (
      prev: Array<keyof typeof AdvancedLicenseEnum>,
    ) => Array<keyof typeof AdvancedLicenseEnum>,
  ) => setValue('advancedLicense', updater(selectedLicenses))

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
  }, [
    setBeforeSubmitCallback,
    selectedLicenses,
    canSelectSomething,
    formatMessage,
  ])

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
                      updateSelected((prev) => {
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
                          disabled={
                            alreadyHasCategory(option.professional.code) ||
                            age < option.professional.minAge
                          }
                          checked={
                            selectedLicenses.includes(
                              option.professional.code,
                            ) || alreadyHasCategory(option.professional.code)
                          }
                          onChange={(e) => {
                            updateSelected((prev) => {
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
