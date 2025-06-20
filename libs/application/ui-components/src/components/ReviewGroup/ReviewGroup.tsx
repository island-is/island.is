import React, { FC, ReactNode, useState } from 'react'
import cn from 'classnames'

import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'

import * as styles from './ReviewGroup.css'

interface ReviewGroupProps {
  editChildren?: ReactNode
  editAction?(): void
  saveAction?(): void
  isEditable?: boolean
  isLast?: boolean
  canCloseEdit?: boolean
  triggerValidation?: boolean
  hideTopDivider?: boolean
}

export const ReviewGroup: FC<React.PropsWithChildren<ReviewGroupProps>> = ({
  children,
  editChildren,
  editAction,
  saveAction,
  isEditable = true,
  isLast,
  canCloseEdit = true,
  triggerValidation = false,
  hideTopDivider,
}) => {
  const [editable, setEditable] = useState(false)
  const { formatMessage } = useLocale()

  const handleClick = () => {
    if (!canCloseEdit) {
      return
    }

    if (editAction) {
      editAction()
    } else {
      setEditable(!editable)
      if (editable && saveAction) {
        saveAction()
      }
    }
  }

  const renderEditSection = () => {
    const layout = (
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          {editChildren}
        </GridColumn>
      </GridRow>
    )

    /**
     * To be able to trigger the validation, we need the fields to be part
     * of the DOM to be registered through the react-hook-form.
     */
    if (triggerValidation) {
      return <Box className={cn({ [styles.hidden]: !editable })}>{layout}</Box>
    }

    if (!editable) {
      return null
    }

    return layout
  }

  return (
    <Box>
      {!hideTopDivider && <Divider />}

      <Box position="relative" paddingY={4}>
        {isEditable && (editChildren || editAction) && (
          <Box position="absolute" top={4} right={0} style={{ zIndex: 10 }}>
            <Button
              variant="utility"
              icon={editable ? 'checkmark' : 'pencil'}
              onClick={handleClick}
            >
              {formatMessage(
                editable
                  ? coreMessages.reviewButtonSubmit
                  : coreMessages.buttonEdit,
              )}
            </Button>
          </Box>
        )}

        {renderEditSection()}
        {!editable && children}
      </Box>

      {!isLast && <Divider />}
    </Box>
  )
}
