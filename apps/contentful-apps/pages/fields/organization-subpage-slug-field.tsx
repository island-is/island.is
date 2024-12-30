import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import type { EntryProps } from 'contentful-management'
import type { FieldExtensionSDK } from '@contentful/app-sdk'
import { Spinner, Stack, Text, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import slugify from '@sindresorhus/slugify'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'

const DEBOUNCE_TIME = 100

const config = {
  environmentId: CONTENTFUL_ENVIRONMENT,
  spaceId: CONTENTFUL_SPACE,
}

interface OrganizationSubpageSlugFieldProps {
  fetchSubpagesWithSameSlug: (
    slug: string,
    organizationPageId: string,
  ) => Promise<EntryProps[]>
}

const OrganizationSubpageSlugField = ({
  fetchSubpagesWithSameSlug,
}: OrganizationSubpageSlugFieldProps) => {
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
          setValue(slugify(String(newTitle)))
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
      const subpagesWithSameSlug = await fetchSubpagesWithSameSlug(
        value,
        organizationPageId,
      )
      console.log(subpagesWithSameSlug)
      setIsValid(subpagesWithSameSlug.length === 0)
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

const Wrapper = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const [state, setState] = useState<
    | { type: 'loading'; data: null }
    | { type: 'page'; data: null }
    | { type: 'childPage'; data: EntryProps }
  >({ type: 'loading', data: null })

  useEffect(() => {
    const start = async () => {
      try {
        const response = await cma.entry.getMany({
          query: {
            content_type: 'organizationParentSubpage',
            include: 1,
            links_to_entry: sdk.ids.entry,
            'sys.archivedAt[exists]': false,
          },
        })
        if (response.items.length > 0) {
          setState({ type: 'childPage', data: response.items[0] })
        } else {
          setState({ type: 'page', data: null })
        }
      } catch {
        setState({ type: 'page', data: null })
      }
    }

    start()
  }, [cma.entry, sdk.ids.entry])

  const fetchSubpagesWithSameSlug = useCallback(
    async (slug: string, organizationPageId: string) => {
      // TODO: Filter-a út org subpages sem eru með parent subpage fyrir ofan sig
      const [parentSubpagesResponse, organizationSubpagesResponse] =
        await Promise.all([
          cma.entry.getMany({
            ...config,
            query: {
              content_type: 'organizationParentSubpage',
              'fields.slug': slug,
              'sys.archivedVersion[exists]': false,
              'fields.organizationPage.sys.id': organizationPageId,
              limit: 1000,
            },
          }),
          cma.entry.getMany({
            ...config,
            query: {
              content_type: 'organizationSubpage',
              'fields.slug': slug,
              'sys.id[ne]': sdk.entry.getSys().id,
              'sys.archivedVersion[exists]': false,
              'fields.organizationPage.sys.id': organizationPageId,
              limit: 1000,
            },
          }),
        ])

      return [
        ...parentSubpagesResponse.items,
        ...organizationSubpagesResponse.items,
      ]
    },
    [cma.entry, sdk.entry],
  )

  const fetchChildSubpagesWithSameSlug = useCallback(
    async (slug: string, organizationPageId: string) => {
      // TODO: sækja öll hin börnin og bera saman slugs
      const items =
        (
          await cma.entry.getMany({
            ...config,
            query: {
              content_type: 'organizationSubpage',
              'fields.slug': slug,
              'sys.id[ne]': sdk.entry.getSys().id,
              'sys.archivedVersion[exists]': false,
              'fields.organizationPage.sys.id': organizationPageId,
              limit: 1000,
            },
          })
        )?.items ?? []
      return items
    },
    [cma.entry, sdk.entry],
  )

  if (state.type === 'loading') return <Spinner />

  return (
    <OrganizationSubpageSlugField
      fetchSubpagesWithSameSlug={
        state.type === 'childPage'
          ? fetchChildSubpagesWithSameSlug
          : fetchSubpagesWithSameSlug
      }
    />
  )
}

export default Wrapper
