import { Box, DialogPrompt, Icon, Tooltip } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { FormSystemGroup, FormSystemInput } from '@island.is/api/schema'
import {
  useFormSystemCreateGroupMutation,
  useFormSystemDeleteGroupMutation,
} from './Group.generated'
import {
  useFormSystemCreateInputMutation,
  useFormSystemDeleteInputMutation,
} from './Input.generated'
import { useFormSystemDeleteStepMutation } from './Step.generated'
import { ControlContext } from '../../../context/ControlContext'
import { removeTypename } from '../../../lib/utils/removeTypename'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'

export const NavButtons = () => {
  const { control, controlDispatch } = useContext(ControlContext)
  const { activeItem, form } = control
  const { groupsList: groups, inputsList: inputs } = form
  const { formatMessage } = useIntl()
  const hoverText =
    activeItem.type === 'Step'
      ? formatMessage(m.addGroupHover)
      : formatMessage(m.addInputHover)

  const [addGroup] = useFormSystemCreateGroupMutation()
  const [addInput] = useFormSystemCreateInputMutation()
  const [removeStep, removeStepStatus] = useFormSystemDeleteStepMutation()
  const [removeGroup, removeGroupStatus] = useFormSystemDeleteGroupMutation()
  const [removeInput, removeInputStatus] = useFormSystemDeleteInputMutation()

  const containsGroupOrInput = (): boolean | undefined => {
    const { type } = activeItem
    if (type === 'Step') {
      return groups?.some((group) => group?.stepGuid === activeItem?.data?.guid)
    }
    if (type === 'Group') {
      return inputs?.some(
        (input) => input?.groupGuid === activeItem?.data?.guid,
      )
    }
    return false
  }

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
          <Tooltip text={hoverText} color="yellow200">
            <span>
              <Icon icon="add" color="blue400" size="medium" />
            </span>
          </Tooltip>
        </Box>
      )}
      {containsGroupOrInput() ? (
        <DialogPrompt
          baseId="remove"
          title={formatMessage(m.areYouSure)}
          description={formatMessage(m.completelySure)}
          ariaLabel="Remove item"
          buttonTextConfirm={formatMessage(m.confirm)}
          buttonTextCancel={formatMessage(m.cancel)}
          onConfirm={remove}
          disclosureElement={
            <Box style={{ paddingTop: '5px', cursor: 'pointer' }}>
              <Tooltip text={formatMessage(m.delete)}>
                <span>
                  <Icon icon="trash" size="medium" />
                </span>
              </Tooltip>
            </Box>
          }
        />
      ) : (
        <Box style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={remove}>
          <Tooltip text={formatMessage(m.delete)}>
            <span>
              <Icon icon="trash" size="medium" />
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  )
}
