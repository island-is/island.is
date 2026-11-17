import { useMutation } from '@apollo/client'
import { FormSystemScreen, FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import {
  DELETE_FIELD,
  DELETE_SCREEN,
  DELETE_SECTION,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { Box, Button, DialogPrompt } from '@island.is/island-ui/core'
import cn from 'classnames'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../context/ControlContext'
import { MainContent } from '../../MainContent/MainContent'
import { DeleteButton } from './DeleteButton'
import * as styles from './MainColumn.css'

export const MainContentColumn = () => {
  const {
    control,
    controlDispatch,
    inSettings,
    inListBuilder,
    updateActiveItem,
  } = useContext(ControlContext)
  const { activeItem, form, isReadOnly } = control
  const { sections, screens, fields } = form
  const { type } = activeItem
  const { formatMessage } = useIntl()
  const deleteScreen = useMutation(DELETE_SCREEN)
  const deleteField = useMutation(DELETE_FIELD)
  const deleteSection = useMutation(DELETE_SECTION)
  const [openPreview, setOpenPreview] = useState(false)
  const [enforcePreviewRestrictions, setEnforcePreviewRestrictions] =
    useState(false)
  const staticSection =
    activeItem.type === 'Section' &&
    ((activeItem.data as { sectionType?: string })?.sectionType === 'PARTIES' ||
      (activeItem.data as { sectionType?: string })?.sectionType === 'PAYMENT')
  const staticScreen =
    activeItem.type === 'Screen' &&
    sections?.find(
      (section) =>
        section?.id === (activeItem?.data as FormSystemScreen)?.sectionId,
    )?.sectionType === 'PAYMENT'

  const showPreview =
    !!activeItem.data &&
    (type === 'Field' ||
      type === 'Screen' ||
      (type === 'Section' &&
        !['BaseSettings', 'Urls', 'Lifetime', 'Deadline'].includes(
          activeItem.data.id,
        ) &&
        ![
          SectionTypes.PREMISES,
          SectionTypes.PARTIES,
          SectionTypes.COMPLETED,
          SectionTypes.PAYMENT,
        ].some(
          (sectionType) =>
            sectionType === (activeItem.data as FormSystemSection).sectionType,
        )))
  const showDelete =
    !isReadOnly &&
    !inSettings &&
    !staticSection &&
    !staticScreen &&
    !inListBuilder

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
        controlDispatch({
          type: 'REMOVE_FIELD',
          payload: { id: id, update: updateActiveItem },
        })
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  return (
    <Box className={cn(styles.mainColumn)} padding={2}>
      {!openPreview && (showPreview || showDelete) && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={2}
        >
          <Box display="flex" flexWrap="wrap" columnGap={2} rowGap={1}>
            {showPreview && (
              <>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setEnforcePreviewRestrictions(false)
                    setOpenPreview(true)
                  }}
                >
                  {formatMessage(m.preview)}
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setEnforcePreviewRestrictions(true)
                    setOpenPreview(true)
                  }}
                >
                  {formatMessage(m.previewWithRestrictions)}
                </Button>
              </>
            )}
          </Box>
          {showDelete &&
            (containsGroupOrInput() ? (
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
            ))}
        </Box>
      )}

      <Box
        width="full"
        style={{
          minHeight: 'clamp(300px, 50vh, 500px)',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <MainContent
          openPreview={openPreview}
          setOpenPreview={setOpenPreview}
          enforcePreviewRestrictions={enforcePreviewRestrictions}
        />
      </Box>
    </Box>
  )
}
