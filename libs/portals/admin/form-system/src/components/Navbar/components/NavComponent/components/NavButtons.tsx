import { Box, Icon } from '@island.is/island-ui/core'
import { useContext } from 'react'
import ControlContext from '../../../../../context/ControlContext'
import { FormSystemGroup, FormSystemInput } from '@island.is/api/schema'
import {
  useFormSystemCreateGroupMutation,
  useFormSystemDeleteGroupMutation,
} from '../../../../../gql/Group.generated'
import {
  useFormSystemCreateInputMutation,
  useFormSystemDeleteInputMutation,
} from '../../../../../gql/Input.generated'
import { useFormSystemDeleteStepMutation } from '../../../../../gql/Step.generated'
import { removeTypename } from '../../../../../lib/utils/removeTypename'

export default function NavButtons() {
  const { control, controlDispatch } = useContext(ControlContext)
  const { activeItem, form } = control
  const { groupsList: groups, inputsList: inputs } = form

  const [addGroup] = useFormSystemCreateGroupMutation()
  const [addInput] = useFormSystemCreateInputMutation()
  const [removeStep, removeStepStatus] = useFormSystemDeleteStepMutation()
  const [removeGroup, removeGroupStatus] = useFormSystemDeleteGroupMutation()
  const [removeInput, removeInputStatus] = useFormSystemDeleteInputMutation()

  const addItem = async () => {
    if (activeItem.type === 'Step') {
      const newGroup = await addGroup({
        variables: {
          input: {
            groupCreationDto: {
              stepId: activeItem?.data?.id,
              displayOrder: groups?.length,
            },
          },
        },
      })
      if (newGroup) {
        controlDispatch({
          type: 'ADD_GROUP',
          payload: {
            group: removeTypename(
              newGroup.data?.formSystemCreateGroup,
            ) as FormSystemGroup,
          },
        })
      }
    } else if (activeItem.type === 'Group') {
      const newInput = await addInput({
        variables: {
          input: {
            inputCreationDto: {
              groupId: activeItem?.data?.id,
              displayOrder: inputs?.length,
            },
          },
        },
      })
      if (newInput) {
        controlDispatch({
          type: 'ADD_INPUT',
          payload: {
            input: removeTypename(
              newInput.data?.formSystemCreateInput,
            ) as FormSystemInput,
          },
        })
      }
    }
  }

  const remove = async () => {
    const id = activeItem?.data?.id as number
    if (activeItem.type === 'Step') {
      await removeStep({
        variables: {
          input: {
            stepId: id,
          },
        },
      })
      if (!removeStepStatus.loading) {
        controlDispatch({ type: 'REMOVE_STEP', payload: { stepId: id } })
      }
    } else if (activeItem.type === 'Group') {
      await removeGroup({
        variables: {
          input: {
            groupId: id,
          },
        },
      })
      if (!removeGroupStatus.loading) {
        controlDispatch({ type: 'REMOVE_GROUP', payload: { groupId: id } })
      }
    } else if (activeItem.type === 'Input') {
      await removeInput({
        variables: {
          input: {
            inputId: id,
          },
        },
      })
      if (!removeInputStatus.loading) {
        controlDispatch({ type: 'REMOVE_INPUT', payload: { inputId: id } })
      }
    }
  }

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
      <Box style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={remove}>
        <Icon icon="trash" size="medium" />
      </Box>
    </Box>
  )
}
