import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import type { EntryProps } from 'contentful-management'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Stack, Text, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { slugify } from '../../utils'

const DEBOUNCE_TIME = 100

const ProjectSubpageSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [value, setValue] = useState(sdk.field?.getValue() ?? '')
  const [isValid, setIsValid] = useState(true)
  const [projectPage, setProjectPage] = useState<EntryProps | null>(null)
  const initialTitleChange = useRef(true)
  const [hasEntryBeenPublished, setHasEntryBeenPublished] = useState(
    Boolean(sdk.entry.getSys()?.firstPublishedAt),
  )

  const defaultLocale = sdk.locales.default

  useEffect(() => {
    const fetchProjectPage = async () => {
      const response = await cma.entry.getMany({
        query: {
          links_to_entry: sdk.entry.getSys().id,
          content_type: 'projectPage',
          'sys.archivedVersion[exists]': false,
          limit: 1,
        },
      })
      if (response.items.length > 0) {
        setProjectPage(response.items[0])
      }
    }
    fetchProjectPage()
  }, [cma.entry, sdk.entry])

  useEffect(() => {
    sdk.entry.onSysChanged((newSys) => {
      setHasEntryBeenPublished(Boolean(newSys?.firstPublishedAt))
    })
  }, [sdk.entry])

  // Update slug field if the title field changes
  useEffect(() => {
    return sdk.entry.fields.title
      .getForLocale(sdk.field.locale)
      .onValueChanged((newTitle) => {
        if (hasEntryBeenPublished) {
          return
        }

        // Callback gets called on initial render, so we  want to ignore that
        if (initialTitleChange.current) {
          initialTitleChange.current = false
          return
        }

        if (newTitle) {
          setValue(slugify(String(newTitle)))
        }
      })
  }, [hasEntryBeenPublished, sdk.entry.fields.title, sdk.field.locale])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  // Validate the user input
  useDebounce(
    async () => {
      if (!projectPage) {
        setIsValid(true)
        return
      }

      const subpageIds: string[] =
        projectPage?.fields?.projectSubpages?.[defaultLocale]?.map(
          (subpage) => subpage.sys.id,
        ) ?? []

      const subpagesWithSameSlug = (
        await cma.entry.getMany({
          query: {
            locale: sdk.field.locale,
            content_type: 'projectSubpage',
            'fields.slug': value,
            'sys.id[ne]': sdk.entry.getSys().id,
            'sys.archivedVersion[exists]': false,
            limit: 1000,
            select: 'sys',
          },
        })
      ).items

      const subpageExistsWithSameSlug = subpagesWithSameSlug.some((subpage) =>
        subpageIds.includes(subpage.sys.id),
      )

      if (subpageExistsWithSameSlug) {
        setIsValid(false)
        return
      }
      setIsValid(true)
    },
    DEBOUNCE_TIME,
    [value, projectPage],
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
      {value.length === 0 && sdk.field.locale === defaultLocale && (
        <Text fontColor="red400">Invalid slug</Text>
      )}
      {value.length > 0 && isInvalid && (
        <Text fontColor="red400">
          Project subpage already exists with this slug
        </Text>
      )}
    </Stack>
  )
}

export default ProjectSubpageSlugField
