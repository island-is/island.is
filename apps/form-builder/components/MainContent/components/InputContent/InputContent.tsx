import { useContext, useState } from 'react'
import {
  GridRow as Row,
  GridColumn as Column,
  Stack,
  Input,
  Checkbox,
  ToggleSwitchCheckbox,
  Text,
  Button,
} from '@island.is/island-ui/core'
import ListContent from '../ListContent/ListContent'
import Preview from '../Preview/Preview'
import ListBuilder from '../ListBuilder/ListBuilder'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import { IInput, NavbarSelectStatus } from '../../../../types/interfaces'
import BaseInput from './components/BaseInput'
import TimeInput from './components/TimeInput'
import MessageWithLink from './components/MessageWithLink'
import FileUpload from './components/FileUpload/FileUpload'
import NumberInput from './components/NumberInput'

export default function InputContent() {
  const { formBuilder, lists, selectStatus, setSelectStatus } =
    useContext(FormBuilderContext)

  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const { inputSettings } = currentItem
  const [inListBuilder, setInListBuilder] = useState(false)
  const [isLarge, setIsLarge] = useState(false)

  const hasConnections =
    formBuilder.form.dependencies[activeItem.data.guid] !== undefined &&
    formBuilder.form.dependencies[activeItem.data.guid].length > 0

  if (
    (inListBuilder && currentItem.type === 'Fellilisti') ||
    (inListBuilder && currentItem.type === 'Valhnappar')
  ) {
    return <ListBuilder setInListBuilder={setInListBuilder} />
  }
  return (
    <Stack space={2}>
      <BaseInput />

      {/* Additional settings depending on chosen input type  */}
      {['Hakbox'].includes(currentItem.type) && (
        <Row>
          <Column>
            <ToggleSwitchCheckbox
              name="Tengja"
              label="Tengja"
              checked={selectStatus === NavbarSelectStatus.NORMAL}
              onChange={(e) =>
                setSelectStatus(
                  e ? NavbarSelectStatus.NORMAL : NavbarSelectStatus.OFF,
                )
              }
            />
          </Column>
          {hasConnections && (
            <Column>
              <Text variant="eyebrow"> Hefur tengingar</Text>
            </Column>
          )}
        </Row>
      )}
      {/* List */}
      {currentItem.type === 'Fellilisti' && (
        <>
          <ListContent setInListBuilder={setInListBuilder} />
        </>
      )}
      {/* Radio buttons */}
      {currentItem.type === 'Valhnappar' && (
        <Button variant="ghost" onClick={() => setInListBuilder(true)}>
          Listasmiður
        </Button>
      )}
      {/* Textlinubox */}
      {currentItem.type === 'Textalínubox' && (
        <Checkbox
          label="Stórt textabox"
          onChange={(e) => setIsLarge(e.target.checked)}
        />
      )}
      {/* "Klukkuinnsláttur" */}
      {currentItem.type === 'Klukkuinnsláttur' && <TimeInput />}
      {/* Heimagistingarnúmer */}
      {currentItem.type === 'Heimagistingarnúmer' && (
        <Row>
          <Column span="5/10">
            <Input
              label="Ártal"
              name="yearStart"
              type="number"
              backgroundColor="blue"
              maxLength={4}
            />
          </Column>
        </Row>
      )}
      {/* Testing text with linked button */}
      {currentItem.type === 'Textalýsing' && <MessageWithLink />}
      {/* File upload */}
      {currentItem.type === 'Skjal' && <FileUpload />}
      {currentItem.type === 'Tölustafir' && <NumberInput />}
      <Preview
        data={activeItem.data as IInput}
        isLarge={isLarge}
        inputSettings={inputSettings}
      />
    </Stack>
  )
}
