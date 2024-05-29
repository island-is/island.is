import React, { useState } from 'react'

import { Box, Input, Button } from '@island.is/island-ui/core'

import {
  Application,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'
import AnimateHeight from 'react-animate-height'
import { useApplicationEvent } from '../../utils/useApplicationEvent'

interface Props {
  applicationId: string
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  className?: string
  adminNationalId?: string
  adminName?: string
}

const CommentSection = ({
  className,
  setApplication,
  applicationId,
  adminNationalId,
  adminName,
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(false)
  const [comment, setComment] = useState<string>()

  const { isCreatingApplicationEvent, creatApplicationEvent } =
    useApplicationEvent()

  const onClickComment = async () => {
    const updateApplication = await creatApplicationEvent(
      applicationId,
      ApplicationEventType.STAFFCOMMENT,
      adminNationalId,
      adminName,
      comment,
    )

    if (updateApplication) {
      setApplication(updateApplication)
      setComment('')
      setShowInput(false)
    }
  }

  return (
    <Box marginBottom={3} className={`${className} `}>
      <Box marginBottom={3}>
        <Button
          icon={showInput ? 'close' : 'pencil'}
          size="small"
          iconType="outline"
          onClick={() => {
            setShowInput((showInput) => !showInput)
          }}
        >
          {showInput ? 'Loka' : 'Skrifa athugasemd'}
        </Button>
      </Box>

      <AnimateHeight duration={250} height={showInput ? 'auto' : 0}>
        <Input
          backgroundColor="blue"
          label="Athugasemd"
          name="comment"
          value={comment}
          rows={4}
          textarea
          onChange={(event) => {
            setComment(event.currentTarget.value)
          }}
        />
        <Box marginTop={2} display="flex" justifyContent="flexEnd">
          <Button
            icon="checkmark"
            size="small"
            iconType="outline"
            onClick={onClickComment}
            disabled={isCreatingApplicationEvent}
          >
            Vista athugasemd
          </Button>
        </Box>
      </AnimateHeight>
    </Box>
  )
}

export default CommentSection
