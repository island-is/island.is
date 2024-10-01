import { Box, DialogPrompt, Icon, Tooltip } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { FormSystemScreen, FormSystemField } from '@island.is/api/schema'
import { ControlContext } from '../../../context/ControlContext'
import { removeTypename } from '../../../lib/utils/removeTypename'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { useFormMutations } from '../../../hooks/formProviderHooks'

export const NavButtons = () => {
  const { control, controlDispatch } = useContext(ControlContext)
  const { activeItem, form } = control
  const { screens, fields } = form
  const { formatMessage } = useIntl()
  const hoverText =
    activeItem.type === 'Section'
      ? formatMessage(m.addGroupHover)
      : formatMessage(m.addInputHover)

  const containsGroupOrInput = (): boolean | undefined => {
    const { type } = activeItem
    if (type === 'Section') {
      return screens?.some((screen) => screen?.sectionId === activeItem?.data?.id)
    }
    if (type === 'Screen') {
      return fields?.some(
        (field) => field?.screenId === activeItem?.data?.id,
      )
    }
    return false
  }

  const { createScreen, createField, deleteSection, deleteScreen, deleteField } = useFormMutations()

  const addItem = async () => {
    if (activeItem.type === 'Section') {
      const newScreen = await createScreen({
        variables: {
          input: {
            id: activeItem?.data?.id,
          },
        },
      })
      if (newScreen) {
        controlDispatch({
          type: 'ADD_SCREEN',
          payload: {
            screen: removeTypename(
              newScreen.data?.formSystemCreateGroup,
            ) as FormSystemScreen,
          },
        })
      }
    } else if (activeItem.type === 'Screen') {
      const newField = await createField({
        variables: {
          input: {
            id: activeItem?.data?.id,
          },
        },
      })
      if (newField) {
        controlDispatch({
          type: 'ADD_FIELD',
          payload: {
            field: removeTypename(
              newField.data?.formSystemCreateInput,
            ) as FormSystemField,
          },
        })
      }
    }
  }

  const remove = async () => {
    const id = activeItem?.data?.id as string
    if (activeItem.type === 'Section') {
      await deleteScreen({
        variables: {
          input: {
            id: id,
          },
        },
      })
      controlDispatch({ type: 'REMOVE_SECTION', payload: { id: id } })
    } else if (activeItem.type === 'Screen') {
      await deleteScreen({
        variables: {
          input: {
            id: id,
          },
        },
      })
      controlDispatch({ type: 'REMOVE_SCREEN', payload: { id: id } })
    } else if (activeItem.type === 'Field') {
      await deleteField({
        variables: {
          input: {
            id: id,
          },
        },
      })
      controlDispatch({ type: 'REMOVE_FIELD', payload: { id: id } })
    }
  }

  return (
    <Box display="flex" flexDirection="row">
      {activeItem.type !== 'Field' && (
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
