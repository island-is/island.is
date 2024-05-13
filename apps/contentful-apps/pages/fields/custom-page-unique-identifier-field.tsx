import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { FormControl, Select, TextInput } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { CustomPageUniqueIdentifier } from '@island.is/shared/types'

const CustomPageUniqueIdentifierField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [selectedOption, setSelectedOption] = useState(sdk.field.getValue())
  const [isSubpage, setIsSubpage] = useState<boolean | null>(null)
  const [subpageSlug, setSubpageSlug] = useState(
    sdk.locales.available.reduce((prev, curr) => {
      console.log(curr, sdk.entry.fields.slug.getForLocale(curr).getValue())
      prev[curr] = sdk.entry.fields.slug.getForLocale(curr).getValue() || ''
      return prev
    }, {}),
  )

  useEffect(() => {
    sdk.entry.fields.parentPage.onValueChanged((parentPage) => {
      setIsSubpage(Boolean(parentPage?.sys?.id))
    })
  }, [sdk.entry.fields.parentPage])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const options = useMemo<string[]>(() => {
    const index = sdk.field.validations.findIndex(
      (validation) => validation?.in?.length > 0,
    )
    if (index <= 0) {
      sdk.notifier.warning(
        'Unique identifier field validation could not be loaded, using enum value instead',
      )
      return Object.values(CustomPageUniqueIdentifier)
    }
    return sdk.field.validations[index].in as string[]
  }, [sdk.field.validations, sdk.notifier])

  const availableLocales = useMemo(() => {
    const validLocales = sdk.locales.available

    // Make sure that the default locale is at the top
    if (validLocales.length > 0 && validLocales[0] !== sdk.locales.default) {
      const index = validLocales.findIndex(
        (locale) => locale === sdk.locales.default,
      )
      if (index >= 0) {
        validLocales.splice(index, 1)
        validLocales.unshift(sdk.locales.default)
      }
    }

    return validLocales
  }, [sdk.locales.available, sdk.locales.default])

  // TODO: figure out
  useDebounce(
    () => {
      for (const locale in subpageSlug) {
        console.log(locale, subpageSlug[locale])
        sdk.entry.fields.slug
          .setValue(subpageSlug[locale], locale)
          .then((r) => {
            console.log(r)
          })
      }
    },
    300,
    [subpageSlug],
  )

  return (
    <div>
      {isSubpage === true && (
        <div>
          {availableLocales.map((locale) => (
            <FormControl key={locale}>
              <FormControl.Label>
                Subpage slug - {sdk.locales.names[locale]}
              </FormControl.Label>
              <TextInput
                value={subpageSlug[locale]}
                onChange={(ev) => {
                  setSubpageSlug((prev) => ({
                    ...prev,
                    [locale]: ev.target.value,
                  }))
                }}
              />
            </FormControl>
          ))}
        </div>
      )}
      {isSubpage === false && (
        <Select
          value={selectedOption}
          onChange={({ target: { value } }) => {
            setSelectedOption(value)
            sdk.field.setValue(value)
          }}
        >
          {options?.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      )}
    </div>
  )
}

export default CustomPageUniqueIdentifierField
