import React, { FC, ReactNode, useState } from 'react'

import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreMessages } from '@island.is/application/core'

interface ReviewGroupProps {
  editChildren?: ReactNode
  editAction?(): void
  isEditable?: boolean
  isLast?: boolean
}

export const ReviewGroup: FC<ReviewGroupProps> = ({
  children,
  editChildren,
  editAction,
  isEditable = true,
  isLast,
}) => {
  const [editable, setEditable] = useState(false)
  const { formatMessage } = useLocale()

  const handleClick = () => {
    if (editAction) {
      editAction()
    } else {
      setEditable(!editable)
    }
  }

  return (
    <Box>
      <Divider />

      <Box position="relative" paddingY={4}>
        {isEditable && (editChildren || editAction) && (
          <Box position="absolute" top={4} right={0} style={{ zIndex: 10 }}>
            <Button
              variant="utility"
              icon={editable ? 'checkmark' : 'pencil'}
              onClick={handleClick}
            >
              {formatMessage(
                editable ? coreMessages.buttonSubmit : coreMessages.buttonEdit,
              )}
            </Button>
          </Box>
        )}

        {editable ? (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
              {editChildren}
            </GridColumn>
          </GridRow>
        ) : (
          children
        )}
      </Box>

      {!isLast && <Divider />}
    </Box>
  )
}
