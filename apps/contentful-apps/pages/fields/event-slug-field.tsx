import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { TextInput } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'
import slugify from '@sindresorhus/slugify'

const slugifyDate = (value: string) => {
  try {
    const date = new Date(value)
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  } catch {
    return ''
  }
}

const EventSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [value, setValue] = useState(sdk.field.getValue() ?? '')
  const [initialRender, setInitialRender] = useState(true)
  const [hasEntryBeenPublished, setHasEntryBeenPublished] = useState(
    Boolean(sdk.entry.getSys()?.firstPublishedAt),
  )
  const initialTitleChange = useRef(true)
  const initialDateChange = useRef(true)

  useEffect(() => {
    sdk.entry.onSysChanged((newSys) => {
      setHasEntryBeenPublished(Boolean(newSys?.firstPublishedAt))
    })
  }, [sdk.entry])

  useDebounce(
    () => {
      if (initialRender) {
        setInitialRender(false)
        return
      }
      sdk.field.setValue(value)
    },
    100,
    [value],
  )

  useEffect(() => {
    if (initialRender) {
      return
    }

    const unsubscribeFromTitleValueChanges = sdk.entry.fields.title
      .getForLocale(sdk.field.locale)
      .onValueChanged((newTitle) => {
        if (!newTitle || hasEntryBeenPublished) {
          return
        }
        if (initialTitleChange.current) {
          initialTitleChange.current = false
          return
        }
        const date = sdk.entry.fields.startDate.getValue()
        setValue(
          `${slugify(newTitle, { customReplacements: [['ö', 'o']] })}${
            date ? '-' + slugifyDate(date) : ''
          }`,
        )
      })

    const unsubscribeFromDateValueChanges =
      sdk.entry.fields.startDate.onValueChanged((newDate) => {
        const date = newDate
        const title = sdk.entry.fields.title
          .getForLocale(sdk.field.locale)
          .getValue()
        if (!title || hasEntryBeenPublished) {
          return
        }
        if (initialDateChange.current) {
          initialDateChange.current = false
          return
        }
        setValue(`${slugify(title)}${date ? '-' + slugifyDate(date) : ''}`)
      })

    return () => {
      unsubscribeFromTitleValueChanges()
      unsubscribeFromDateValueChanges()
    }
  }, [
    hasEntryBeenPublished,
    initialRender,
    sdk.entry.fields.startDate,
    sdk.entry.fields.title,
    sdk.field.locale,
  ])

  return (
    <TextInput
      value={value}
      onChange={(ev) => {
        setValue(ev.target.value)
      }}
      isInvalid={value.length === 0 && sdk.field.locale === sdk.locales.default}
    />
  )
}

export default EventSlugField
