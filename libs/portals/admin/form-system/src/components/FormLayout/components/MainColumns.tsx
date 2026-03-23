import { useMutation } from '@apollo/client'
import {
  DELETE_FIELD,
  DELETE_SCREEN,
  DELETE_SECTION,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { Box, DialogPrompt } from '@island.is/island-ui/core'
import cn from 'classnames'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../context/ControlContext'
import { MainContent } from '../../MainContent/MainContent'
import { DeleteButton } from './DeleteButton'
import * as styles from './MainColumn.css'

export const MainContentColumn = () => {
  const { control, controlDispatch, inSettings } = useContext(ControlContext)
  const { activeItem, form, isPublished } = control
  const { screens, fields } = form
  const { type } = activeItem
  const { formatMessage } = useIntl()
  const deleteScreen = useMutation(DELETE_SCREEN)
  const deleteField = useMutation(DELETE_FIELD)
  const deleteSection = useMutation(DELETE_SECTION)
  const partiesSection =
    activeItem.type === 'Section' &&
    (activeItem.data as { sectionType?: string })?.sectionType === 'PARTIES'

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
    <Box className={cn(styles.mainColumn)} padding={2}>
      {!isPublished && !inSettings && !partiesSection ? (
        containsGroupOrInput() ? (
          <DialogPrompt
            baseId="remove"
            title={formatMessage(m.areYouSure)}
            description={formatMessage(m.completelySure)}
            ariaLabel="Remove item"
            buttonTextConfirm={formatMessage(m.confirm)}
            buttonTextCancel={formatMessage(m.cancel)}
            onConfirm={remove}
            disclosureElement={
              <DeleteButton
                label={formatMessage(m.delete)}
                onClick={() => null}
              />
            }
          />
        ) : (
          <DeleteButton onClick={remove} label={formatMessage(m.delete)} />
        )
      ) : null}

      <Box
        width="full"
        style={{
          minHeight: '500px',
        }}
      >
        <MainContent />
      </Box>
    </Box>
  )
}
