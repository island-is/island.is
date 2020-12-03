import React, { FC, ReactNode, useContext, useEffect, useState } from 'react'
import {
  Buttons,
  Sidebar,
  ContentfulContext,
} from '@island.is/contentful-editor'
import { useLockBodyScroll } from 'react-use'

interface EditorProps {}

export const Editor: FC<EditorProps> = ({ children }) => {
  const { loggedIn } = useContext(ContentfulContext)
  const [edit, setEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleLoad = async () => {
    // if (!slug || !contentType || !edit) {
    //   return
    // }
    // const entry = getEntryAPI(slug, contentType)
    // setEntry(entry)
    // setLoading(false)
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

  if (!loggedIn) {
    return <>{children}</>
  }

  return (
    <>
      <Buttons
        copy={edit ? 'Save changes' : 'Edit this page'}
        edit={edit}
        saving={saving}
        onClick={handleEditClick}
        onCancelClick={() => setEdit(false)}
      />

      {edit && <Sidebar onChange={handleChange} />}
      {children}
    </>
  )
}
