import { Box, Icon } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'
import FormBuilderContext from '../../../../../context/FormBuilderContext'

type Props = {
  add(type: 'Step' | 'Group', parentId: number): void
  remove(
    type: 'Step' | 'Group' | 'Input',
    guid: UniqueIdentifier,
    id: number,
  ): void
}

export default function NavButtons({ add, remove }: Props) {
  const { lists } = useContext(FormBuilderContext)
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
}
