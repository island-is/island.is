import React, { useEffect, useRef, useState } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { createClient } from 'contentful-management'
import { Entry } from 'contentful-management/dist/typings/entities/entry'

import { Header } from './Header/Header'
import { Sidebar } from './Sidebar/Sidebar'

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
  }: {
    pageProps: unknown
    slug: string
  }) => {
    const client = useRef(
      createClient({ accessToken: env.managementAccessToken }),
    ).current
    const [edit, setEdit] = useState(false)
    const [entry, setEntry] = useState<Entry | undefined>(undefined)

    const handleContentType = async () => {
      if (!slug || !edit || !env.managementAccessToken) {
        return
      }

      const space = await client.getSpace(env.space)
      const environment = await space.getEnvironment(env.environment)

      try {
        const entry = await environment.getEntry('2F6n9qoAWTG1ekp12VTQOD')

        setEntry(entry)
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
              'is-IS': value,
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
      console.log('-entryToSave', entryToSave)

      try {
        const res = await entryToSave.update()
        console.log('-res', res)
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
      handleContentType()
    }, [slug, edit])

    return (
      <>
        <Header
          copy={edit ? 'Save changes' : 'Edit this page'}
          cancel={edit}
          onClick={handleEditClick}
          onCancelClick={() => setEdit(false)}
        />
        {edit && <Sidebar fields={entry?.fields} onChange={handleChange} />}
        <Component {...pageProps} />
      </>
    )
  }

  NewComponent.getInitialProps = async (ctx: NextPageContext) => {
    const { slug } = ctx.query

    const props = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    return {
      pageProps: props,
      slug,
    }
  }

  return NewComponent
}
