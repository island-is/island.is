import { FC, useState } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { useUserInfo } from '@island.is/react-spa/bff'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  APPLICATION_APPLICATION,
  SUBMIT_APPLICATION,
} from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { Box, Button, Divider, toast } from '@island.is/island-ui/core'
import { RejectConfirmationModal } from '../Components/RejectConfirmationModal'
import { overview } from '../../lib/messages'
import { isLastApprovee } from '../../utils/isLastApprovee'

export const HandleApproveOrReject: FC<FieldBaseProps> = ({
  application,
  goToScreen,
  refetch,
}) => {
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const [rejectModalVisibility, setRejectModalVisibility] =
    useState<boolean>(false)
  const [getApplicationInfo] = useLazyQuery(APPLICATION_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })
  const [submitApplication, { loading }] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })

  const onBackButtonClick = () => {
    goToScreen?.('applicationStatusSection.multiField')
  }

  const canApprove = () => {
    const approved =
      getValueViaPath<string[]>(application.answers, 'approved') ?? []
    return !approved.includes(userInfo?.profile?.nationalId ?? '')
  }

  const onApproveButtonClick = async () => {
    const applicationInfo = await getApplicationInfo({
      variables: {
        input: {
          id: application.id,
        },
        locale: 'is',
      },
      fetchPolicy: 'no-cache',
    })
    const updatedApplication = applicationInfo?.data?.applicationApplication
    const approved =
      getValueViaPath<string[]>(updatedApplication.answers, 'approved') ?? []
    approved.push(userInfo?.profile?.nationalId ?? '')
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: isLastApprovee(approved, updatedApplication.assignees)
            ? DefaultEvents.SUBMIT
            : DefaultEvents.APPROVE,
          answers: {
            approved,
          },
        },
      },
    })

    if (!res?.data) {
      toast.error(formatMessage(overview.general.submitError))
    } else if (res?.data) {
      refetch?.()
    }
  }

  return (
    <Box marginTop={14}>
      <Divider />
      <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
        <Button variant="ghost" onClick={onBackButtonClick}>
          {formatMessage(overview.general.backButton)}
        </Button>
        {canApprove() && (
          <Box display="flex" justifyContent="flexEnd" flexWrap="wrap">
            <Box marginLeft={3}>
              <Button
                icon="close"
                colorScheme="destructive"
                onClick={() => setRejectModalVisibility(true)}
              >
                {formatMessage(overview.general.rejectButton)}
              </Button>
            </Box>
            <Box marginLeft={3}>
              <Button
                icon="checkmark"
                loading={loading}
                type="submit"
                onClick={onApproveButtonClick}
              >
                {formatMessage(overview.general.approveButton)}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <RejectConfirmationModal
        visibility={rejectModalVisibility}
        setVisibility={setRejectModalVisibility}
        application={application}
        refetch={refetch}
      />
    </Box>
  )
}
