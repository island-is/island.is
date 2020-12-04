import React, { FC, useContext, useState } from 'react'
import {
  Buttons,
  Sidebar,
  ContentfulContext,
} from '@island.is/contentful-editor'
import { useLockBodyScroll } from 'react-use'

export const Editor: FC = ({ children }) => {
  const { saving, save } = useContext(ContentfulContext)
  const [edit, setEdit] = useState(false)

  const handleEditClick = async () => {
    if (edit) {
      const res = await save()

      if (res) {
        setEdit(false)
        window.location.reload()
      }
    } else {
      setEdit(!edit)
    }
  }

  useLockBodyScroll(edit)

  return (
    <>
      <Buttons
        copy={edit ? 'Save changes' : 'Edit this page'}
        edit={edit}
        saving={saving}
        onClick={handleEditClick}
        onCancelClick={() => setEdit(false)}
      />

      {edit && <Sidebar />}
      {children}
    </>
  )
}
