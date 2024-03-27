import { Box, Icon } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { addGroup, addInput } from '../../../../../services/apiService'
import { ItemType } from '../../../../../types/interfaces'

type Props = {
  remove(type: ItemType, guid: UniqueIdentifier, id: number): void
}

export default function NavButtons({ remove }: Props) {
  const { lists, listsDispatch } = useContext(FormBuilderContext)
  const { activeItem } = lists
  return (
    <Box display="flex" flexDirection="row">
      {activeItem.type !== 'Input' && (
        <Box
          style={{ paddingTop: '5px', cursor: 'pointer' }}
          marginRight={1}
          onClick={addItem}
        >
          <Icon icon="add" color="blue400" size="medium" />
        </Box>
      )}
      <Box
        style={{ paddingTop: '5px', cursor: 'pointer' }}
        onClick={() => {
          remove(activeItem.type, activeItem.data.guid, activeItem.data.id)
        }}
      >
        <Icon icon="trash" size="medium" />
      </Box>
    </Box>
  )

  async function addItem() {
    if (activeItem.type === 'Step') {
      const newGroup = await addGroup(lists.groups.length, activeItem.data.id)
      if (newGroup) {
        listsDispatch({ type: 'addGroup', payload: { data: newGroup } })
      }
    } else if (activeItem.type === 'Group') {
      const newInput = await addInput(lists.inputs.length, activeItem.data.id)
      if (newInput) {
        listsDispatch({ type: 'addInput', payload: { data: newInput } })
      }
    }
  }
}
