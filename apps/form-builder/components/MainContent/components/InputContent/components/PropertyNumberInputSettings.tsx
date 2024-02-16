import { Checkbox, Stack } from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IInput } from '../../../../../types/interfaces'

export default function PropertyNumberInputSettings() {
  const { lists, listsDispatch } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const { inputSettings: settings } = currentItem

  const handleInputChange = (name: string, value: boolean) => {
    listsDispatch({
      type: 'setInputSettings',
      payload: {
        inputSettings: {
          ...settings,
          [name]: value,
        },
      },
    })
  }

  return (
    <Stack space={2}>
      <Checkbox
        label="Fasteignalisti (innskráðs notanda eða lögaðila)"
        name="isPropertyNumberList"
        checked={settings.erListi}
        onChange={(e) => handleInputChange('erListi', e.target.checked)}
      />
      <Checkbox
        label="Innsláttur fasteignanúmers"
        name="isPropertyNumber"
        checked={settings.erInnslattur}
        onChange={(e) => handleInputChange('erInnslattur', e.target.checked)}
      />
    </Stack>
  )
}
