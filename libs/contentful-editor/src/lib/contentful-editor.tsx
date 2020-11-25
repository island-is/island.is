import React, { useEffect, useRef, useState } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import {
  Entry,
  EntryProp,
} from 'contentful-management/dist/typings/entities/entry'

import { Buttons } from './components/Buttons/Buttons'
import { Sidebar } from './components/Sidebar/Sidebar'
import { getContentfulInfo } from './utils/get-contentful-info'
import { Collection } from 'contentful-management/dist/typings/common-types'
import { createContentfulClient, ContentfulEnv } from './contentful/client'
import { buildContentTypeAndData } from './utils/buildContentTypeAndData'

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
  env: ContentfulEnv,
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
    locale: 'en' | 'is-IS'
  }) => {
    const [edit, setEdit] = useState(false)
    const [entry, setEntry] = useState<any | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleLoad = async () => {
      if (!slug || !contentType || !edit || !env.managementAccessToken) {
        return
      }

      setLoading(true)

      try {
        const res = await buildContentTypeAndData({
          slug,
          contentType,
          locale,
          env,
        })

        setEntry(res)
      } catch (e) {
        console.log('-e', e)
      }

      setLoading(false)
    }

    const handleChange = (field: string, value: string) => {
      /*
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
      */
    }

    const handleSave = async () => {
      /*
      const space = await client.getSpace(env.space)
      const environment = await space.getEnvironment(env.environment)
      const entryToSave = await environment.getEntry('2F6n9qoAWTG1ekp12VTQOD')

      if (!entry) {
        return
      }

      setSaving(true)

      entryToSave.fields = entry.fields

      try {
        await entryToSave.update()
        setEdit(false)
      } catch (e) {
        console.log('-e', e)
      }

      setSaving(false)
      */
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
        <Buttons
          copy={edit ? 'Save changes' : 'Edit this page'}
          edit={edit}
          saving={saving}
          onClick={handleEditClick}
          onCancelClick={() => setEdit(false)}
        />

        {edit && (
          <Sidebar
            env={env}
            entry={entry}
            fields={entry?._entry?.items?.[0]?.fields}
            locale={locale}
            loading={loading}
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
