import { Box, Button, Input, Text, toast } from '@island.is/island-ui/core'
import { useUserProfile } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useReplyMutation } from '../../queries/Reply.generated'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'

interface Props {
  hasEmail: boolean
  successfulSubmit: () => void
}

interface FormData {
  reply: string
}

const ReplyForm: React.FC<Props> = ({ successfulSubmit }) => {
  const [reply, setReply] = useState<string | undefined>('')
  const methods = useForm<FormData>()
  const { activeDocument } = useDocumentContext()
  const { data: userProfile } = useUserProfile()
  const { profile } = useUserInfo()

  const [postReply, { loading: postReplyLoading }] = useReplyMutation({
    onError: () => {
      toast.error('Skilaboð tókst ekki að senda')
      methods.setError('reply', {
        message: 'Skilaboð tókst ekki að senda',
      })
    },
    onCompleted: (response) => {
      toast.success('Skilaboð send')
      alert(response.documentsV2Reply?.id)
      setReply(undefined)
      methods.resetField('reply')
      successfulSubmit()
    },
  })

  const handleSubmitForm = (data: FormData) => {
    console.log('post action', data)
    if (data.reply === '') {
      methods.setError('reply', { message: 'Skilaboð mega ekki vera tóm' })
    } else {
      postReply({
        variables: {
          input: {
            // TODO make sure data is not missing
            documentId: activeDocument?.id ?? '123',
            body: data.reply,
            reguesterEmail: profile.email ?? userProfile?.email ?? '',
            subject: activeDocument?.subject,
            reguesterName: profile.name,
          },
        },
      })
    }
  }

  return (
    <FormProvider {...methods}>
      {methods.formState.isSubmitSuccessful ? (
        // <ReplySent
        //   sentTo={tempAnswer.emailTo}
        //   id={tempAnswer.caseId}
        //   reply={tempAnswer.reply}
        //   date={tempAnswer.date}
        //   intro={
        //     'Skilaboðin eru móttekin og mál hefur verið stofnað. Þú getur haldið áfram samskiptunum hér eða í gegnum þitt persónulega netfang. '
        //   }
        // />
        <Text>"Skilaboð send" </Text>
      ) : (
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          <Controller
            name="reply"
            control={methods.control}
            render={({ field: { value = reply, onChange } }) => (
              <Box>
                <Input
                  autoFocus
                  textarea
                  rows={6}
                  name="reply-message"
                  label="Skilaboð"
                  backgroundColor="blue"
                  placeholder="Skilaboð hér"
                  maxLength={500} // Todo - check what the max length should be
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  errorMessage={methods.formState.errors.reply?.message}
                />
                <Box display="flex" justifyContent="flexEnd" marginTop={3}>
                  <Button
                    type="submit"
                    size="small"
                    disabled={methods.formState.isSubmitting}
                  >
                    Senda skilaboð
                  </Button>
                </Box>
              </Box>
            )}
          />
        </form>
      )}
    </FormProvider>
  )
}

export default ReplyForm
