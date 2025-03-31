import { Box, Button, Input } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/portals/my-pages/core'
import { dateFormatWithTime } from '@island.is/shared/constants'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import ReplySent from './ReplyBody'

interface Props {
  hasEmail: boolean
  successfulSubmit: (date: string) => void
}

interface FormData {
  reply: string
}

interface TempAnswer {
  caseId: string
  emailTo: string
  reply: string
  date: Date
}

const ReplyForm: React.FC<Props> = ({ successfulSubmit }) => {
  const [reply, setReply] = useState('')
  const [tempAnswer, setTempAnswer] = useState<TempAnswer>()
  const methods = useForm<FormData>()

  //const [postAction, { loading: postActionLoading }] =
  //   usePostDefenseChoiceMutation({
  //     onError: () => {
  //       toast.error(formatMessage(messages.registrationError))
  //       methods.setError(CHOICE, {
  //         message: formatMessage(messages.registrationError),
  //       })
  //     },
  //     onCompleted: () => {
  //       popUp && popUp.setPopUp(false)
  //       toast.success(formatMessage(messages.registrationCompleted))
  //       refetch && refetch()
  //     },
  //   })

  const handleSubmitForm = (data: FormData) => {
    console.log('post action', data)
    if (data.reply === '') {
      methods.setError('reply', { message: 'Skilaboð mega ekki vera tóm' })
    } else {
      setTempAnswer({
        caseId: '123',
        emailTo: 'lisa@skb.is',
        reply: data.reply,
        date: new Date(),
      })
      methods.resetField('reply')
    }
    //   postAction({
    //     variables: {
    //       input: {
    //         caseId: id,
    //         choice: data.choice ?? LawAndOrderDefenseChoiceEnum.DELAY,
    //         lawyersNationalId: data.lawyersNationalId,
    //       },
    //       locale: lang,
    //     },
    //   })
    setReply('')
  }

  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      successfulSubmit(formatDate(tempAnswer?.date, dateFormatWithTime.is))
    }
  }, [methods.formState.isSubmitSuccessful]) // TODO: Add check for successful submit from service

  return (
    <FormProvider {...methods}>
      {methods.formState.isSubmitSuccessful && tempAnswer ? (
        <ReplySent
          email={tempAnswer.emailTo}
          id={tempAnswer.caseId}
          reply={tempAnswer.reply}
          date={tempAnswer.date}
          intro={
            'Skilaboðin eru móttekin og mál hefur verið stofnað. Þú getur haldið áfram samskiptunum hér eða í gegnum þitt persónulega netfang. '
          }
        />
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
