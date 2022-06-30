import React from 'react'
import { useFormContext } from 'react-hook-form'

type PropTypes = { name: string; appType: string }

export const HiddenFields = ({ name, appType }: PropTypes) => {
  const { register } = useFormContext()

  return (
    <input
      type="hidden"
      name={name}
      id={name}
      ref={register({ required: true })}
      value={appType}
    ></input>
  )
}
