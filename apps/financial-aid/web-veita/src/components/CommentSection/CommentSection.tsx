import React, { useContext, useState } from 'react'

import { useRouter } from 'next/router'

import { Box, Input, Button } from '@island.is/island-ui/core'

import { useMutation } from '@apollo/client'
import { ApplicationEventMutation } from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import {
  Application,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'
import { AdminContext } from '../AdminProvider/AdminProvider'
import AnimateHeight from 'react-animate-height'

interface Props {
  className?: string
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
}

const CommentSection = ({ className, setApplication }: Props) => {
  const router = useRouter()

  const { admin } = useContext(AdminContext)
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
            staffNationalId: admin?.nationalId,
            staffName: admin?.name,
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
            onClick={() => {
              saveStaffComment(comment)
            }}
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
