import React, { useEffect, useRef, useState } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { createClient } from 'contentful-management'
import { Entry } from 'contentful-management/dist/typings/entities/entry'

import { Header } from './Header/Header'
import { Sidebar } from './Sidebar/Sidebar'

const mapping = (path?: string) => {
  console.log('-path', path)

  if (!path) {
    return { locale: undefined, name: undefined }
  }

  const slashes = path.match(/\//g)?.length
  let arg = path?.split('/')?.[1]
  let locale = 'is-IS'

  if (arg === 'en') {
    arg = path?.split('/')?.[2]
    locale = 'en'
  }

  if (
    (arg === 'en' && slashes === 2) ||
    (arg === 'is-IS' && slashes === 1) ||
    !arg
  ) {
    return { locale, name: 'article' }
  }

  const types = [
    { id: 'lifeEventPage', matches: ['life-event', 'lifsvidburdur'] },
    { id: 'articleCategory', matches: ['category', 'flokkur'] },
    { id: 'news', matches: ['news', 'frett'] },
    { id: 'article', matches: ['article', 'grein'] },
    { id: 'tellUsAStory', matches: ['tell-us-your-story', 'segdu-okkur-sogu'] },
    { id: 'organization', matches: ['organizations', 'stofnanir'] },
    { id: 'aboutPage', matches: ['stafraent-island'] },
  ]

  const res = types.find((t) => t.matches.find((item) => item === arg))
  console.log('-res', res)

  if (!res) {
    return { locale: undefined, name: undefined }
  }

  return { locale, name: res.id }
}

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
  }: {
    pageProps: unknown
    slug?: string
    contentType: {
      locale?: string
      name?: string
    }
  }) => {
    console.log('-slug', slug)
    console.log('-contentType', contentType)

    const client = useRef(
      createClient({ accessToken: env.managementAccessToken }),
    ).current
    const [edit, setEdit] = useState(false)
    const [entry, setEntry] = useState<Entry | undefined>(undefined)

    const handleLoad = async () => {
      if (!slug || !contentType.name || !edit || !env.managementAccessToken) {
        return
      }

      const space = await client.getSpace(env.space)
      const environment = await space.getEnvironment(env.environment)

      try {
        const entry = await environment.getEntries({
          content_type: contentType.name,
          'fields.slug': slug,
          locale: contentType.locale,
        })
        console.log('-entry', entry)

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
              [contentType.locale ?? 'is-IS']: value,
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
            locale={contentType.locale}
            onChange={handleChange}
          />
        )}

        <Component {...pageProps} />
      </>
    )
  }

  NewComponent.getInitialProps = async (ctx: NextPageContext) => {
    const { query, asPath } = ctx
    const { slug } = query
    const contentType = mapping(asPath)
    // console.log('-contentType', contentType)

    const props = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    return {
      pageProps: props,
      slug,
      contentType,
    }
  }

  return NewComponent
}
