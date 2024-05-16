import { FC, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { Box, Divider, Button } from '@island.is/island-ui/core'
import { RejectConfirmationModal } from './RejectConfirmationModal'
import { review } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

export const RejectApproveButtons: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { formatMessage } = useLocale()
  const { application, refetch } = props
  const [rejectModalVisibility, setRejectModalVisibility] =
    useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const [submitApplication, { error }] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })

  const onBackButtonClick = () => {
    console.log('click back')
  }

  const onRejectButtonClick = () => {
    setRejectModalVisibility(true)
  }

  const onApproveButtonClick = async () => {
    // Maybe need to submit some answers?
    setLoading(true)

    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: DefaultEvents.SUBMIT,
          answers: {},
        },
      },
    })

    if (res?.data) {
      setLoading(false)
      refetch?.()
    }
  }

  return (
    <>
      <Box marginTop={14}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button>

          <Box display="flex" justifyContent="flexEnd" flexWrap="wrap">
            <Box marginLeft={3}>
              <Button
                icon="close"
                colorScheme="destructive"
                onClick={onRejectButtonClick}
              >
                {formatMessage(review.buttons.reject)}
              </Button>
            </Box>
            <Box marginLeft={3}>
              <Button
                icon="checkmark"
                loading={loading}
                onClick={onApproveButtonClick}
              >
                {formatMessage(review.buttons.approve)}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <RejectConfirmationModal
        visibility={rejectModalVisibility}
        setVisibility={setRejectModalVisibility}
        application={application}
        refetch={refetch}
      />
    </>
  )
}
