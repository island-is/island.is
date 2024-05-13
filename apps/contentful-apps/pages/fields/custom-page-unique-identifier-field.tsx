import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { CollectionProp, EntryProps, KeyValueMap } from 'contentful-management'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  FormControl,
  Select,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { CustomPageUniqueIdentifier } from '@island.is/shared/types'

const DEBOUNCE_TIME_IN_MS = 300

const CustomPageUniqueIdentifierField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [selectedOption, setSelectedOption] = useState(sdk.field.getValue())
  const [isSubpage, setIsSubpage] = useState<boolean | null>(null)
  const [subpageSlug, setSubpageSlug] = useState(
    sdk.locales.available.reduce((obj, locale) => {
      obj[locale] = sdk.entry.fields.slug.getForLocale(locale).getValue() || ''
      return obj
    }, {}),
  )
  const subpageSlugRef = useRef(subpageSlug)
  const [subpageSlugError, setSubpageSlugError] = useState(
    sdk.locales.available.reduce((obj, locale) => {
      obj[locale] = ''
      return obj
    }, {}),
  )

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

  useEffect(() => {
    sdk.entry.fields.parentPage.onValueChanged((parentPage) => {
      const isSubpage = Boolean(parentPage?.sys?.id)
      setIsSubpage(isSubpage)
      if (isSubpage) {
        const fieldValue = sdk.field.getValue()
        if (!fieldValue && options?.length > 0) {
          sdk.field.setValue(options[0])
          setSelectedOption(options[0])
        }
      }
    })
  }, [options, sdk.entry.fields.parentPage, sdk.field])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useDebounce(
    async () => {
      const requests: Promise<{
        response: CollectionProp<EntryProps<KeyValueMap>>
        subpageSlug
        locale: string
      }>[] = []
      for (const locale in subpageSlug) {
        const parentPageId = sdk.entry.fields.parentPage.getValue()?.sys?.id
        if (parentPageId) {
          requests.push(
            (async () => {
              const response = await cma.entry.getMany({
                query: {
                  content_type: 'customPage',
                  'fields.slug': subpageSlug[locale],
                  'fields.parentPage.sys.id': parentPageId,
                  'sys.id[ne]': sdk.entry.getSys().id,
                  locale,
                },
              })
              return {
                response,
                locale,
                subpageSlug,
              }
            })(),
          )
        }
      }

      const responses = await Promise.all(requests)

      const deltaSubpageSlugError = {}

      for (const { response, locale, subpageSlug } of responses) {
        if (
          response.total > 0 &&
          subpageSlug[locale] === subpageSlugRef.current[locale] &&
          subpageSlug[locale].length > 0
        ) {
          deltaSubpageSlugError[
            locale
          ] = `Slug is already in use: ${subpageSlug[locale]}`
        } else {
          sdk.entry.fields.slug.setValue(subpageSlug[locale], locale)
        }
      }

      if (Object.keys(deltaSubpageSlugError).length > 0) {
        setSubpageSlugError((prev) => ({
          ...prev,
          ...deltaSubpageSlugError,
        }))
      } else {
        setSubpageSlugError(
          sdk.locales.available.reduce((obj, locale) => {
            obj[locale] = ''
            return obj
          }, {}),
        )
      }
    },
    DEBOUNCE_TIME_IN_MS,
    [subpageSlug],
  )

  return (
    <div>
      {isSubpage === true && (
        <div>
          {availableLocales.map((locale) => (
            <FormControl key={locale}>
              <FormControl.Label>
                Subpage Slug - {sdk.locales.names[locale]}
              </FormControl.Label>
              <TextInput
                value={subpageSlug[locale]}
                onChange={(ev) => {
                  setSubpageSlug((previousSubpageSlug) => {
                    const updatedSubpageSlug = {
                      ...previousSubpageSlug,
                      [locale]: ev.target.value,
                    }
                    subpageSlugRef.current = updatedSubpageSlug
                    return updatedSubpageSlug
                  })
                }}
              />
              {subpageSlugError[locale] && (
                <Text fontColor="red700">{subpageSlugError[locale]}</Text>
              )}
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
