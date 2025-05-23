import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'react-use'
import { EntryProps, SysLink } from 'contentful-management'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Spinner, Text, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE,
  DEFAULT_LOCALE,
} from '../../constants'
import { slugify } from '../../utils'

type Article = EntryProps<{
  subArticles: { [DEFAULT_LOCALE]: SysLink[] }
  slug: {
    [DEFAULT_LOCALE]: string
    en: string
  }
}>

const SubArticleUrlField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const defaultLocale = sdk.locales.default

  const [prefix, setPrefix] = useState('')
  const [value, setValue] = useState(
    sdk.field?.getValue()?.split('/')?.pop() ?? '',
  )
  const [loading, setLoading] = useState(true)
  const [firstRender, setFirstRender] = useState(true)
  const parentArticleIsPresent = useRef<boolean | null>(null)
  const [hasEntryBeenPublished, setHasEntryBeenPublished] = useState(
    Boolean(sdk.entry.getSys()?.firstPublishedAt),
  )
  const initialTitleChange = useRef(true)

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

  const fetchParentArticle = useCallback(() => {
    const parentArticleId = sdk.entry.fields['parent']?.getValue()?.sys?.id

    if (!parentArticleId) {
      parentArticleIsPresent.current = false
      setLoading(false)
      return
    }

    parentArticleIsPresent.current = true

    cma.entry
      .get({
        entryId: parentArticleId,
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
      })
      .then((parentArticle: Article) => {
        const subArticles =
          parentArticle.fields?.subArticles?.[defaultLocale] ?? []

        let parentSlug = ''

        const entrySysId = sdk.entry.getSys().id

        for (const subArticle of subArticles) {
          if (subArticle.sys.id === entrySysId) {
            parentSlug = parentArticle.fields.slug?.[sdk.field.locale]
            break
          }
        }

        if (parentSlug) {
          setPrefix(parentSlug)
        }

        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.error(error)
      })
  }, [cma.entry, defaultLocale, sdk.entry, sdk.field.locale])

  useEffect(() => {
    sdk.entry.onSysChanged(() => {
      if (parentArticleIsPresent.current !== false) return

      const parentId = sdk.entry.fields?.['parent']?.getValue()?.sys?.id

      if (!parentId) return

      // Refetch parent if subArticle was missing a parent but got one at a later point
      fetchParentArticle()
    })
  }, [fetchParentArticle, sdk.entry])

  useEffect(() => {
    setValue(sdk.field?.getValue()?.split('/')?.pop() ?? '')
  }, [sdk.field])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useEffect(fetchParentArticle, [fetchParentArticle])

  useDebounce(
    () => {
      if (firstRender) {
        setFirstRender(false)
        return
      }
      if (value.trim().length === 0) {
        sdk.field.setValue('')
      } else {
        sdk.field.setValue(`${prefix}/${value}`)
      }
      sdk.field.setInvalid(
        value.length === 0 && sdk.field.locale === defaultLocale,
      )
    },
    500,
    [value],
  )

  if (loading) return <Spinner />

  return (
    <>
      <TextInput
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value)
        }}
        isInvalid={value.length === 0 && sdk.field.locale === defaultLocale}
      />
      <Text>
        {prefix}/{value}
      </Text>
    </>
  )
}

export default SubArticleUrlField
