import React, { useState } from 'react'

import { useRouter } from 'next/router'

import { Box, Input, Button } from '@island.is/island-ui/core'
import cn from 'classnames'

import * as styles from './CommentSection.treat'
import { useMutation } from '@apollo/client'
import { ApplicationEventMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import {
  Application,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  className?: string
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
}

const CommentSection = ({ className, setApplication }: Props) => {
  const router = useRouter()

  const [showInput, setShowInput] = useState<boolean>(false)
  const [comment, setComment] = useState<string>()

  const [
    createApplicationEventMutation,
    { loading: isCreatingApplicationEvent },
  ] = useMutation(ApplicationEventMutation)

  const saveStaffComment = async (staffComment: string | undefined) => {
    if (staffComment) {
      const { data } = await createApplicationEventMutation({
        variables: {
          input: {
            applicationId: router.query.id,
            comment: staffComment,
            eventType: ApplicationEventType.STAFFCOMMENT,
          },
        },
      })

      if (data) {
        setApplication(data.createApplicationEvent)
        setComment('')
        setShowInput(false)
      }
    }
  }

  return (
    <Box marginBottom={3} className={`${className} `}>
      <Button
        icon={showInput ? 'close' : 'open'}
        size="small"
        iconType="outline"
        onClick={() => {
          setShowInput(!showInput)
        }}
      >
        {showInput ? 'Loka' : 'Skrifa athugasemd'}
      </Button>

      <div
        className={cn({
          [`${styles.inputFieldContainer}`]: true,
          [`${styles.showInput}`]: showInput,
        })}
      >
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
            onClick={() => {
              saveStaffComment(comment)
            }}
            disabled={isCreatingApplicationEvent}
          >
            Vista athugasemd
          </Button>
        </Box>
      </div>
    </Box>
  )
}

export default CommentSection
