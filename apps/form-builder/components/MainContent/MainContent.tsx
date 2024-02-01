import {
  Box,
  Input,
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Button,
  Checkbox,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import InputContent from './components/InputContent/InputContent'
import BaseSettings from './components/BaseSettings/BaseSettings'
import Premises from './components/Premises/Premises'
import RelevantParties from './components/RelevantParties/RelevantParties'
import Payments from './components/Payments/Payments'
import PreviewStepOrGroup from './components/PreviewStepOrGroup/PreviewStepOrGroup'
import { IGroup, IStep } from '../../types/interfaces'
import FormBuilderContext from '../../context/FormBuilderContext'
import { translationStation } from '../../services/translationStation'

export default function MainContent() {
  const { lists, listsDispatch, changeHandler, blur, onFocus } =
    useContext(FormBuilderContext)
  const { activeItem } = lists
  const [openPreview, setOpenPreview] = useState(false)

  return (
    <Box padding={2}>
      {activeItem.type === 'Input' ? (
        <InputContent />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as IStep).type === 'BaseSetting' ? ( // Grunnstillingar
        <BaseSettings />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as IStep).type === 'Forsendur' ? ( // Forsendur / PremisesStep
        <Premises />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as IStep).type === 'Aðilar' ? ( // RelevantPartiesStep
        <RelevantParties />
      ) : activeItem.type === 'Step' &&
        (activeItem.data as IStep).type === 'Greiðsla' ? ( // Payment step
        <Payments />
      ) : // Input step or group
      openPreview ? (
        <PreviewStepOrGroup setOpenPreview={setOpenPreview} />
      ) : (
        <Stack space={2}>
          <Row>
            <Column span="10/10">
              <Input
                label="Heiti"
                name="name"
                value={activeItem.data.name.is}
                backgroundColor="blue"
                onChange={(e) => changeHandler(e, 'name')}
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label="Heiti (enska)"
                name="nameEn"
                value={activeItem.data.name.en}
                backgroundColor="blue"
                onChange={(e) => changeHandler(e, 'nameEn')}
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
                buttons={[
                  {
                    label: 'translate',
                    name: 'reader',
                    onClick: async () => {
                      const translation = await translationStation(
                        activeItem.data.name.is,
                      )
                      listsDispatch({
                        type: 'changeName',
                        lang: 'en',
                        newValue: translation.translations[0].translatedText,
                      })
                    },
                  },
                ]}
              />
            </Column>
          </Row>
          {activeItem.type === 'Group' && (
            <Row>
              <Column>
                <Checkbox
                  name="multi"
                  label="Er fjölval"
                  checked={(activeItem.data as IGroup).multiSet !== 0}
                  onChange={(e) =>
                    listsDispatch({
                      type: 'setMultiSet',
                      payload: {
                        checked: e.target.checked,
                      },
                    })
                  }
                />
              </Column>
            </Row>
          )}
          <Row>
            <Column>
              <Button variant="ghost" onClick={() => setOpenPreview(true)}>
                Skoða
              </Button>
            </Column>
          </Row>
        </Stack>
      )}
    </Box>
  )
}
