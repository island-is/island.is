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

  useEffect(() => {
    setValue(sdk.field?.getValue()?.split('/')?.pop() ?? '')
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
        environmentId: process.env.CONTENTFUL_ENVIRONMENT,
        spaceId: process.env.CONTENTFUL_SPACE,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cma.entry, sdk.entry, sdk.field])

  useDebounce(
    () => {
      if (firstRender) {
        setFirstRender(false)

        // No need to change the value if the value is already up to date
        if (sdk.field.getValue() === `${prefix}/${value}`) {
          return
        }
      }

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
