import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { TextInput, Text, Spinner } from '@contentful/f36-components'
import { EntryProps, SysLink } from 'contentful-management'

type Article = EntryProps<{
  subArticles: { 'is-IS': SysLink[] }
  slug: {
    'is-IS': string
    en: string
  }
}>

const environmentId = 'stefna' // TODO: change this to master or even have an environment variable
const spaceId = '8k0h54kbe6bj'

const SubArticleUrlField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const defaultLocale = sdk.locales.default

  const [prefix, setPrefix] = useState('')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setValue(sdk.field?.getValue()?.split('/')?.[1] ?? '')
  }, [sdk.field])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useEffect(() => {
    const parentArticleId = sdk.entry.fields['parent']?.getValue()?.sys?.id

    if (!parentArticleId) {
      setLoading(false)
      return
    }

    cma.entry
      .get({
        entryId: parentArticleId,
        environmentId,
        spaceId,
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
          sdk.field.setValue(`${parentSlug}/${value}`)
        }

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        // TODO: perhaps also log the error that occured
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cma.entry, sdk.entry, sdk.field])

  useDebounce(
    () => {
      sdk.field.setValue(`${prefix}/${value}`)
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
