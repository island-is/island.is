import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Stack, Text, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { slugify, slugifyDate } from '../../utils'

const DEBOUNCE_TIME = 100

const GenericListItemSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const [genericList, setGenericList] = useState(null)
  const [hasEntryBeenPublished, setHasEntryBeenPublished] = useState(
    Boolean(sdk.entry.getSys()?.firstPublishedAt),
  )

  const [value, setValue] = useState(sdk.field.getValue() ?? '')
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    sdk.entry.onSysChanged((newSys) => {
      setHasEntryBeenPublished(Boolean(newSys?.firstPublishedAt))
    })
  }, [sdk.entry])

  useEffect(() => {
    const unsubscribe = sdk.entry.fields.genericList.onValueChanged(
      (updatedList) => {
        if (updatedList?.sys?.id) {
          cma.entry
            .get({
              entryId: updatedList.sys.id,
            })
            .then(setGenericList)
        } else {
          setGenericList(null)
        }
      },
    )

    return unsubscribe
  }, [cma.entry, sdk.entry.fields.genericList])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const initialRender = useRef({
    title: true,
    date: true,
  })

  useEffect(() => {
    const unsubscribeFromTitleValueChanges = sdk.entry.fields.title
      .getForLocale(sdk.field.locale)
      .onValueChanged((newTitle) => {
        if (initialRender.current.title) {
          initialRender.current.title = false
          return
        }
        if (!newTitle || hasEntryBeenPublished) {
          return
        }
        const date = sdk.entry.fields.date.getValue()
        setValue(`${slugify(newTitle)}${date ? '-' + slugifyDate(date) : ''}`)
      })

    const unsubscribeFromDateValueChanges =
      sdk.entry.fields.date.onValueChanged((newDate) => {
        if (initialRender.current.date) {
          initialRender.current.date = false
          return
        }
        const date = newDate
        const title = sdk.entry.fields.title
          .getForLocale(sdk.field.locale)
          .getValue()
        if (!title || hasEntryBeenPublished) {
          return
        }
        setValue(`${slugify(title)}${date ? `-${slugifyDate(date)}` : ''}`)
      })

    return () => {
      unsubscribeFromTitleValueChanges()
      unsubscribeFromDateValueChanges()
    }
  }, [
    hasEntryBeenPublished,
    sdk.entry.fields.date,
    sdk.entry.fields.title,
    sdk.field.locale,
  ])

  useDebounce(
    async () => {
      const genericListId = sdk.entry.fields.genericList.getValue()?.sys?.id
      if (!genericListId || !value) {
        return
      }
      const itemsInSameListWithSameSlug =
        (
          await cma.entry.getMany({
            environmentId: sdk.ids.environment,
            spaceId: sdk.ids.space,
            query: {
              locale: sdk.field.locale,
              content_type: 'genericListItem',
              'fields.slug': value,
              'sys.id[ne]': sdk.entry.getSys().id,
              'sys.archivedVersion[exists]': false,
            },
          })
        )?.items ?? []
      setIsValid(itemsInSameListWithSameSlug.length <= 0)
    },
    DEBOUNCE_TIME,
    [value],
  )

  useDebounce(
    () => {
      if (isValid) {
        sdk.field.setValue(value)
      } else {
        sdk.field.setValue(null) // Set to null to prevent entry publish
      }
      sdk.field.setInvalid(!isValid)
    },
    DEBOUNCE_TIME,
    [isValid, value],
  )

  if (
    genericList &&
    genericList?.fields?.itemType?.[sdk.locales.default] !== 'Clickable'
  ) {
    return (
      <Text>
        Slug can only be changed if the list item type is {`"Clickable"`}
      </Text>
    )
  }

  const isInvalid = value.length === 0 || !isValid

  return (
    <Stack spacing="spacingXs" flexDirection="column" alignItems="flex-start">
      <TextInput
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value)
        }}
        isInvalid={isInvalid}
      />
      {value.length === 0 && sdk.field.locale === sdk.locales.default && (
        <Text fontColor="red400">Invalid slug</Text>
      )}
      {value.length > 0 && isInvalid && (
        <Text fontColor="red400">Item already exists with this slug</Text>
      )}
    </Stack>
  )
}

export default GenericListItemSlugField
