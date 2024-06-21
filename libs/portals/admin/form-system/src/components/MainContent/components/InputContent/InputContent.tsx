import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack } from '@island.is/island-ui/core'
import { BaseInput } from './components/BaseInput'
import { Preview } from '../Preview/Preveiw'
import { FormSystemInput } from '@island.is/api/schema'
import { InputSettings } from './components/InputSettings/InputSettings'
import { ListBuilder } from './components/ListBuilder/ListBuilder'

export const InputContent = () => {
  const { control, inListBuilder } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemInput

  if (inListBuilder) {
    return <ListBuilder />
  }
  return (
    <Stack space={2}>
      <BaseInput />
      <InputSettings />
      <Preview data={currentItem} />
    </Stack>
  )
}
