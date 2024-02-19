import { Box, Icon } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { addGroup, addInput, deleteItem } from '../../../../../services/apiService'
import { IGroup, IInput, ItemType } from '../../../../../types/interfaces'

export default function NavButtons() {
  const { lists, listsDispatch } = useContext(FormBuilderContext)
  const { activeItem } = lists
  return (
    <Box display="flex" flexDirection="row">
      {activeItem.type !== 'Input' && (
        <Box
          style={{ paddingTop: '5px', cursor: 'pointer' }}
          marginRight={1}
          onClick={() => {
            add(
              activeItem.type == 'Group' || activeItem.type === 'Step'
                ? activeItem.type
                : null,
              activeItem.data.id,
            )
          }}
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

  async function add(parentType: 'Step' | 'Group' | null, parentId: number) {
    try {
      let data

      if (parentType === 'Step') {
        data = await addGroup(lists.groups.length, parentId)
        listsDispatch({ type: 'addGroup', payload: { data: data } })
      }

      if (parentType === 'Group') {
        data = await addInput(lists.inputs.length, parentId)
        listsDispatch({ type: 'addInput', payload: { data: data } })
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  async function remove(type: ItemType, guid: UniqueIdentifier, id: number) {
    await deleteItem(type, id)
    const actionTypes: { [key: string]: string } = {
      Step: 'removeStep',
      Group: 'removeGroup',
      Input: 'removeInput',
    }
    listsDispatch({
      type: actionTypes[type],
      payload: {
        guid: guid,
      },
    })
    console.log('currentActiveItem', activeItem)
  }
}
