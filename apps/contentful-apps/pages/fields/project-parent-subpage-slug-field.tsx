import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Stack, Text, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { slugify } from '../../utils'

const DEBOUNCE_TIME = 100

const ProjectParentSubpageSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [value, setValue] = useState(sdk.field?.getValue() ?? '')
  const [isValid, setIsValid] = useState(true)
  const [projectPageId, setProjectPageId] = useState<string | undefined>(
    sdk.entry.fields.projectPage?.getValue()?.sys?.id,
  )
  const latestFieldValues = useRef({ value, projectPageId })
  latestFieldValues.current = { value, projectPageId }
  const initialTitleChange = useRef(true)
  const [hasEntryBeenPublished, setHasEntryBeenPublished] = useState(
    Boolean(sdk.entry.getSys()?.firstPublishedAt),
  )

  const defaultLocale = sdk.locales.default

  // Store in state what project page id is being referenced
  useEffect(() => {
    return sdk.entry.fields.projectPage?.onValueChanged((newProjectPage) => {
      setProjectPageId(newProjectPage?.sys?.id)
    })
  }, [sdk.entry.fields.projectPage])

  useEffect(() => {
    return sdk.entry.onSysChanged((newSys) => {
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

        // Callback gets called on initial render, so we want to ignore that
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
      if (!projectPageId || !value) {
        setIsValid(true)
        return
      }

      const [projectPage, parentSubpagesWithSameSlug] = await Promise.all([
        cma.entry.get({ entryId: projectPageId }),
        cma.entry.getMany({
          query: {
            locale: sdk.field.locale,
            content_type: 'projectParentSubpage',
            'fields.slug': value,
            'sys.id[ne]': sdk.entry.getSys().id,
            'sys.archivedVersion[exists]': false,
            'fields.projectPage.sys.id': projectPageId,
            limit: 1,
            select: 'sys',
          },
        }),
      ])

      // The web resolves a project page's own subpages before parent subpages,
      // so a parent subpage can't share a slug with one of them
      const projectSubpages =
        projectPage?.fields?.projectSubpages?.[sdk.field.locale] ??
        projectPage?.fields?.projectSubpages?.[defaultLocale] ??
        []
      const projectSubpageIds: string[] = projectSubpages
        .map((subpage: { sys?: { id?: string } }) => subpage?.sys?.id)
        .filter(Boolean)

      const subpagesWithSameSlug =
        projectSubpageIds.length > 0
          ? await cma.entry.getMany({
              query: {
                locale: sdk.field.locale,
                content_type: 'projectSubpage',
                'fields.slug': value,
                'sys.id[in]': projectSubpageIds.join(','),
                'sys.archivedVersion[exists]': false,
                limit: 1,
                select: 'sys',
              },
            })
          : { items: [] }

      // Discard the result if the slug or project page changed during the queries
      if (
        latestFieldValues.current.value !== value ||
        latestFieldValues.current.projectPageId !== projectPageId
      ) {
        return
      }

      setIsValid(
        parentSubpagesWithSameSlug.items.length === 0 &&
          subpagesWithSameSlug.items.length === 0,
      )
    },
    DEBOUNCE_TIME,
    [value, projectPageId],
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
          Another page in this project already exists with this slug
        </Text>
      )}
    </Stack>
  )
}

export default ProjectParentSubpageSlugField
