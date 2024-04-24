import { useContext } from 'react'
import ControlContext from '../../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'
import MessageWithLinkSettings from './components/MessageWithLinkSettings'
import FileUploadSettings from './components/FIleUploadSettings'
import TextInputSettings from './components/TextInputSettings'
import ListSettings from './components/ListSettings'
import ToggleConnection from './components/ToggleConnection'

const InputSettings = () => {
  const { control } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemInput
  return (
    <>
      {currentItem.type === 'Textalýsing' && <MessageWithLinkSettings />}
      {currentItem.type === 'Skjal' && <FileUploadSettings />}
      {currentItem.type === 'Textalínubox' ||
        (currentItem.type === 'TextaInnsláttur' && <TextInputSettings />)}
      {currentItem.type === 'Fellilisti' && <ListSettings />}
      {currentItem.type === 'Valhnappar' && <ListSettings />}
      {['Hakbox'].includes(currentItem.type as string) && <ToggleConnection />}
    </>
  )
}

export default InputSettings
