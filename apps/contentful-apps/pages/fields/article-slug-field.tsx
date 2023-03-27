import { FieldExtensionSDK } from '@contentful/app-sdk'
import { TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

const environmentId = 'stefna' // TODO: change this to master or even have an environment variable
const spaceId = '8k0h54kbe6bj'

const ArticleSlugField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(sdk.field.getValue())
  }, [sdk.field])

  useDebounce(
    () => {
      const valueDuringRequest = value

      cma.entry
        .getMany({
          environmentId,
          spaceId,
          query: {
            content_type: 'subArticle',
            'fields.parent.sys.id': sdk.entry.getSys().id,
          },
        })
        .then(async (response) => {
          // Match the response with the latest value and if there is no match, wait for the debounce to call the CMS again
          if (value !== valueDuringRequest) return

          sdk.notifier.success(
            `Please stay on this page while we are updating ${response.items.length} baby article urls...`,
          )

          for (const entry of response.items) {
            const url = {}

            for (const locale of Object.keys(sdk.locales.names)) {
              console.group(locale)
              url[locale] = `${value}/${
                entry.fields?.url?.[locale]?.split('/')?.[1] ?? ''
              }`
            }

            await cma.entry.update(
              {
                entryId: entry.sys.id,
                environmentId,
                spaceId,
              },
              { ...entry, fields: { ...entry.fields, url } },
            )
          }

          sdk.notifier.success(
            `Thanks for your patience. The baby article urls have successfully been updated`,
          )

          sdk.field.setValue(value)
        })
    },
    500,
    [value],
  )

  return (
    <TextInput
      value={value}
      onChange={(ev) => {
        setValue(ev.target.value)
      }}
    />
  )
}

export default ArticleSlugField
