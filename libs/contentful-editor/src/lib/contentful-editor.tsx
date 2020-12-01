import React, { useEffect, useState } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { useLockBodyScroll } from 'react-use'

import { Buttons } from './components/Buttons/Buttons'
import { Sidebar } from './components/Sidebar/Sidebar'
import { getContentfulInfo } from './utils/get-contentful-info'
import { getEntryAPI, initializer, MagicType } from './contentful/initializer'

// Maybe use this object https://github.com/island-is/island.is/pull/2024/files
const CONTENTFUL_TYPES_TO_MAP = [
  { id: 'lifeEventPage', matches: ['life-event', 'lifsvidburdur'] },
  { id: 'articleCategory', matches: ['category', 'flokkur'] },
  { id: 'news', matches: ['news', 'frett'] },
  { id: 'article', matches: ['article', 'grein'] },
  { id: 'tellUsAStory', matches: ['tell-us-your-story', 'segdu-okkur-sogu'] },
  { id: 'organization', matches: ['organizations', 'stofnanir'] },
  { id: 'aboutPage', matches: ['stafraent-island'] },
]

export const env = {
  managementAccessToken: '',
  space: '8k0h54kbe6bj',
  environment: 'master',
}

export const contentfulUrl = `https://app.contentful.com/spaces/${env.space}/entries`

/**
 * LOGIN to an endpoint somewhere else first through oauth contentful application.
 * Get management token there (not working from what I tested so far)
 * If we don't have any management token, we just return the component without anything else wrapped around
 */
export const withContentfulEditor = (
  Component: NextComponentType<NextPageContext, unknown, any>,
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
    const [data, setData] = useState<MagicType | undefined>(undefined)
    const [wip, setWip] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    const handleLoad = async () => {
      if (!slug || !contentType || !edit) {
        return
      }

      setLoading(true)
      setError(undefined)

      try {
        /**
         * TODO
         * First we gonna run the initializer somewhere.
         * We gonna expose a get method to return only the object data
         * for the contentType/slug and linked contentType/documents
         * instead of returning the whole space/contentTypes/entries/assets
         * into the state
         */
        /*
        const res = await initializer({
          slug,
          contentType,
          locale,
          env,
        })

        setData(res)
        */

        await initializer({ locale, env })

        const entry = getEntryAPI(slug, contentType)
        console.log('-entry', entry)

        setWip(entry)
      } catch (e) {
        console.log('-e.message', e.message)

        if (e.message === 'Expected parameter accessToken') {
          setError(e.message)
        }
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

    useLockBodyScroll(edit)

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
            wip={wip}
            data={data}
            error={error}
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
