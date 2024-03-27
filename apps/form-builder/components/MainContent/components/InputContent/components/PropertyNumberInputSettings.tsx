import {
  GridRow as Row,
  GridColumn as Column,
  Checkbox,
  Stack,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IInput } from '../../../../../types/interfaces'

export default function PropertyNumberInputSettings() {
  const { lists, listsDispatch } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const { inputSettings: settings } = currentItem

  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            label="Fasteignalisti (innskráðs notanda eða lögaðila)"
            name="isPropertyNumberList"
            checked={settings.erListi}
            onChange={(e) =>
              listsDispatch({
                type: 'setInputSettings',
                payload: {
                  inputSettings: {
                    ...settings,
                    erListi: e.target.checked,
                  },
                },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label="Innsláttur fasteignanúmers"
            name="isPropertyNumber"
            checked={settings.erInnslattur}
            onChange={(e) =>
              listsDispatch({
                type: 'setInputSettings',
                payload: {
                  inputSettings: {
                    ...settings,
                    erInnslattur: e.target.checked,
                  },
                },
              })
            }
          />
        </Column>
      </Row>
    </Stack>
  )
}
