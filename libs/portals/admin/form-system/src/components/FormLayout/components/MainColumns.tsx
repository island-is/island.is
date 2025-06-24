import { Box, Button, DialogPrompt } from '@island.is/island-ui/core'
import { MainContent } from '../../MainContent/MainContent'
import React, { useContext } from 'react'
import { ControlContext } from '../../../context/ControlContext'
import { m } from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import {
  DELETE_SCREEN,
  DELETE_FIELD,
  DELETE_SECTION,
} from '@island.is/form-system/graphql'
import { DeleteButton } from './DeleteButton'

export const MainContentColumn = () => {
  const { control, controlDispatch } = useContext(ControlContext)
  const { activeItem, form } = control
  const { screens, fields } = form
  const { type } = activeItem
  const { formatMessage } = useIntl()
  const deleteScreen = useMutation(DELETE_SCREEN)
  const deleteField = useMutation(DELETE_FIELD)
  const deleteSection = useMutation(DELETE_SECTION)

  const containsGroupOrInput = (): boolean => {
    if (type === 'Section') {
      return (
        screens?.some((screen) => screen?.sectionId === activeItem?.data?.id) ||
        false
      )
    }
    if (type === 'Screen') {
      return (
        fields?.some((field) => field?.screenId === activeItem?.data?.id) ||
        false
      )
    }
    return false
  }

  const remove = async () => {
    const id = activeItem?.data?.id as string
    try {
      if (activeItem.type === 'Section') {
        await deleteSection[0]({
          variables: {
            input: {
              id: id,
            },
          },
        })
        controlDispatch({ type: 'REMOVE_SECTION', payload: { id: id } })
      } else if (activeItem.type === 'Screen') {
        await deleteScreen[0]({
          variables: {
            input: {
              id: id,
            },
          },
        })
        controlDispatch({ type: 'REMOVE_SCREEN', payload: { id: id } })
      } else if (activeItem.type === 'Field') {
        await deleteField[0]({
          variables: {
            input: {
              id: id,
            },
          },
        })
        controlDispatch({ type: 'REMOVE_FIELD', payload: { id: id } })
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  return (
    <Box
      style={{
        maxWidth: '1200px',
        width: '64%',
        position: 'fixed',
      }}
    >
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
            <DeleteButton onClick={() => {}} label={formatMessage(m.delete)} />
          }
        />
      ) : (
        <DeleteButton onClick={remove} label={formatMessage(m.delete)} />
      )}

      <Box
        border="standard"
        borderRadius="standard"
        width="full"
        style={{
          minHeight: '500px',
          overflow: 'auto',
          maxHeight: '70vh',
        }}
      >
        <MainContent />
      </Box>
    </Box>
  )
}
