import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Stack, Text, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import slugify from '@sindresorhus/slugify'

import { CUSTOM_SLUGIFY_REPLACEMENTS } from '../../constants'

const DEBOUNCE_TIME = 100

const OrganizationParentSubpageSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [value, setValue] = useState(sdk.field?.getValue() ?? '')
  const [isValid, setIsValid] = useState(true)
  const [organizationPageId, setOrganizationPageId] = useState(
    sdk.entry.fields.organizationPage.getValue()?.sys?.id,
  )
  const initialTitleChange = useRef(true)
  const [hasEntryBeenPublished, setHasEntryBeenPublished] = useState(
    Boolean(sdk.entry.getSys()?.firstPublishedAt),
  )

  const defaultLocale = sdk.locales.default

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
          setValue(
            slugify(String(newTitle), {
              customReplacements: CUSTOM_SLUGIFY_REPLACEMENTS,
            }),
          )
        }
      })
  }, [hasEntryBeenPublished, sdk.entry.fields.title, sdk.field.locale])

  // Store in state what organization page id is being referenced
  useEffect(() => {
    return sdk.entry.fields.organizationPage.onValueChanged((newOrgPage) => {
      setOrganizationPageId(newOrgPage?.sys?.id)
    })
  }, [sdk.entry.fields.organizationPage])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  // Validate the user input
  useDebounce(
    async () => {
      if (!organizationPageId || !value) {
        setIsValid(true)
        return
      }

      const entryId = sdk.entry.getSys().id

      const [subpageResponse, parentSubpageResponse] = await Promise.all([
        cma.entry.getMany({
          query: {
            locale: sdk.field.locale,
            content_type: 'organizationSubpage',
            'fields.slug': value,
            'sys.archivedVersion[exists]': false,
            limit: 1,
            'fields.organizationPage.sys.id': organizationPageId,
            'fields.organizationParentSubpage[exists]': false,
          },
        }),
        cma.entry.getMany({
          query: {
            locale: sdk.field.locale,
            content_type: 'organizationParentSubpage',
            'sys.id[ne]': entryId,
            'fields.slug': value,
            'sys.archivedVersion[exists]': false,
            limit: 1,
            'fields.organizationPage.sys.id': organizationPageId,
          },
        }),
      ])

      // Parent subpage with the same org page and slug
      if (parentSubpageResponse.items.length > 0) {
        setIsValid(false)
        return
      }

      const subpagesWithSameSlugThatDoNotBelongToSomeParentSubpage =
        subpageResponse.items

      // Is there an org subpage that does not belong to a parent subpage that has the same slug?
      if (subpagesWithSameSlugThatDoNotBelongToSomeParentSubpage.length > 0) {
        setIsValid(false)
        return
      }

      setIsValid(true)
    },
    DEBOUNCE_TIME,
    [value, organizationPageId],
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
          Another page already exists with this slug
        </Text>
      )}
    </Stack>
  )
}

export default OrganizationParentSubpageSlugField
