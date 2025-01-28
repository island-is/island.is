import { useMutation } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { FC, useState } from 'react'
import { Routes } from '../../lib/constants'
import { review } from '../../lib/messages'
import { RejectConfirmationModal } from './RejectConfirmationModal'

export const RejectApproveButtons: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { formatMessage } = useLocale()
  const { application, refetch, goToScreen } = props
  const userInfo = useUserInfo()
  const [rejectModalVisibility, setRejectModalVisibility] =
    useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const userNationalId = userInfo?.profile.nationalId || null
  const reviewerNationalId = getValueViaPath(
    application.answers,
    `${Routes.SECONDGUARDIANINFORMATION}.nationalId`,
    '',
  ) as string

  const [submitApplication, { error }] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })

  const onBackButtonClick = () => {
    goToScreen?.('reviewStateMultiField')
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
          answers: {
            ...application.answers,
            'secondGuardianInformation.approved': true,
          },
        },
      },
    })

    if (res?.data) {
      setLoading(false)
      refetch?.()
    }
  }

  if (application.state === 'draft') {
    return
  }

  return (
    <>
      <Box marginTop={14}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button>

          {userNationalId === reviewerNationalId && (
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
          )}
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
