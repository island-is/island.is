import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Stack, Text, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import slugify from '@sindresorhus/slugify'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'

const DEBOUNCE_TIME = 100
const config = {
  environmentId: CONTENTFUL_ENVIRONMENT,
  spaceId: CONTENTFUL_SPACE,
}

const OrganizationSubpageSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [value, setValue] = useState(sdk.field?.getValue() ?? '')
  const [isValid, setIsValid] = useState(true)
  const [organizationPageId, setOrganizationPageId] = useState(
    sdk.entry.fields.organizationPage.getValue()?.sys?.id,
  )
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
        if (hasEntryBeenPublished) return
        if (newTitle) {
          setValue(
            slugify(String(newTitle), {
              customReplacements: [['ö', 'o']],
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
      const subpagesWithSameSlug =
        (
          await cma.entry.getMany({
            ...config,
            query: {
              locale: sdk.field.locale,
              content_type: 'organizationSubpage',
              'fields.slug': value,
              'sys.id[ne]': sdk.entry.getSys().id,
              limit: 1000,
            },
          })
        )?.items ?? []

      if (
        subpagesWithSameSlug.some(
          (subpage) =>
            subpage.fields.organizationPage?.[sdk.locales.default]?.sys?.id ===
            organizationPageId,
        )
      ) {
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
          Organization subpage already exists with this slug
        </Text>
      )}
    </Stack>
  )
}

export default OrganizationSubpageSlugField
