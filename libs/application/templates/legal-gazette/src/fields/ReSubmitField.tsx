import { Button, Inline, toast } from '@island.is/island-ui/core'
import { LGFieldBaseProps } from '../lib/types'
import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useState } from 'react'

export const ReSubmitField = ({ application, refetch }: LGFieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {},
  )

  const [disabled, setDisabled] = useState(false)

  const handleSubmit = async () => {
    setDisabled(true)

    await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: 'SUBMIT',
          answers: application.answers,
        },
      },
      onCompleted: ({ externalData }) => {
        setTimeout(() => {
          setDisabled(false)
        }, 5000)

        const success = getValueViaPath<boolean>(
          externalData,
          'successfullyPosted.data.success',
          false,
        )

        if (!success) {
          toast.error(formatMessage(m.errors.failedToSubmitTitle), {
            toastId: 'submit-application-error',
          })

          return
        }

        refetch?.()
      },
      onError: () => {
        setTimeout(() => {
          setDisabled(false)
        }, 5000)

        toast.error(formatMessage(m.errors.internalError), {
          toastId: 'submit-application-error',
        })
      },
    })
  }

  return (
    <Inline align="right">
      <Button
        disabled={disabled}
        size="small"
        icon="reload"
        loading={loadingSubmit}
        onClick={handleSubmit}
      >
        {formatMessage(m.submitted.failed.tryAgain)}
      </Button>
    </Inline>
  )
}

export default ReSubmitField
