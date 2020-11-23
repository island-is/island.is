import React, { useEffect, useRef, useState } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { createClient } from 'contentful-management'
import { Entry } from 'contentful-management/dist/typings/entities/entry'

import { Header } from './components/Header/Header'
import { Sidebar } from './components/Sidebar/Sidebar'
import { getContentfulInfo } from './utils/get-contentful-info'

const CONTENTFUL_TYPES_TO_MAP = [
  { id: 'lifeEventPage', matches: ['life-event', 'lifsvidburdur'] },
  { id: 'articleCategory', matches: ['category', 'flokkur'] },
  { id: 'news', matches: ['news', 'frett'] },
  { id: 'article', matches: ['article', 'grein'] },
  { id: 'tellUsAStory', matches: ['tell-us-your-story', 'segdu-okkur-sogu'] },
  { id: 'organization', matches: ['organizations', 'stofnanir'] },
  { id: 'aboutPage', matches: ['stafraent-island'] },
]

export const withContentfulEditor = (
  Component: NextComponentType<NextPageContext, unknown, any>,
  env: {
    space: string
    managementAccessToken: string
    environment: string
  },
) => {
  const NewComponent = ({
    pageProps,
    slug,
    contentType,
    locale,
  }: {
    pageProps: unknown
    slug: string
    contentType: string
    locale: string
  }) => {
    const client = useRef(
      createClient({ accessToken: env.managementAccessToken }),
    ).current
    const [edit, setEdit] = useState(false)
    const [entry, setEntry] = useState<Entry | undefined>(undefined)

    const handleLoad = async () => {
      if (!slug || !contentType || !edit || !env.managementAccessToken) {
        return
      }

      const space = await client.getSpace(env.space)
      const environment = await space.getEnvironment(env.environment)

      try {
        const entry = await environment.getEntries({
          content_type: contentType,
          'fields.slug': slug,
          locale,
        })

        setEntry(entry.items?.[0])
      } catch (e) {
        console.log('-e', e)
      }
    }

    const handleChange = (field: string, value: string) => {
      setEntry((prev) => {
        return {
          ...prev,
          fields: {
            ...prev?.fields,
            [field]: {
              ...prev?.fields[field],
              [locale]: value,
            },
          },
        }
      })
    }

    const handleSave = async () => {
      const space = await client.getSpace(env.space)
      const environment = await space.getEnvironment(env.environment)
      const entryToSave = await environment.getEntry('2F6n9qoAWTG1ekp12VTQOD')

      if (!entry) {
        return
      }

      entryToSave.fields = entry.fields

      try {
        await entryToSave.update()
        setEdit(false)
      } catch (e) {
        console.log('-e', e)
      }
    }

    const handleEditClick = () => {
      if (edit) {
        handleSave()
      } else {
        setEdit(!edit)
      }
    }

    useEffect(() => {
      handleLoad()
    }, [slug, edit])

    return (
      <>
        <Header
          copy={edit ? 'Save changes' : 'Edit this page'}
          cancel={edit}
          onClick={handleEditClick}
          onCancelClick={() => setEdit(false)}
        />

        {edit && (
          <Sidebar
            fields={entry?.fields}
            locale={locale}
            onChange={handleChange}
          />
        )}

        <Component {...pageProps} />
      </>
    )
  }

  NewComponent.getInitialProps = async (ctx: NextPageContext) => {
    const { slug, contentType, locale } = getContentfulInfo(
      ctx,
      CONTENTFUL_TYPES_TO_MAP,
    )

    console.log('-slug', slug)
    console.log('-contentType', contentType)
    console.log('-locale', locale)

    const props = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    return {
      pageProps: props,
      slug,
      contentType,
      locale,
    }
  }

  return NewComponent
}
