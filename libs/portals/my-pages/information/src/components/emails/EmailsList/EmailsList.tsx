import { Email } from '@island.is/api/schema'
import { Box, toast } from '@island.is/island-ui/core'
import {
  DataStatus,
  USER_PROFILE,
  client,
} from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useIntl } from 'react-intl'
import { emailsMsg } from '../../../lib/messages'
import { EmailCard, EmailCardTag, EmailCta } from '../EmailCard/EmailCard'
import { useDeleteEmailMutation } from './deleteEmail.mutation.generated'
import { useSetActorProfileEmailMutation } from './setActorProfileEmail.mutation.generated'
import { useSetPrimaryEmailMutation } from './setPrimaryEmail.mutation.generated'

type EmailsListProps = {
  items: Email[]
}

export const EmailsList = ({ items }: EmailsListProps) => {
  const { formatMessage } = useIntl()
  const userInfo = useUserInfo()

  const isActor = !!userInfo?.profile?.actor?.nationalId

  const refreshEmailList = () => {
    client.refetchQueries({
      include: [USER_PROFILE],
    })
  }

  const [deleteEmail] = useDeleteEmailMutation({
    onCompleted: (data) => {
      if (data.userEmailsDeleteEmail) {
        refreshEmailList()
        toast.success(formatMessage(emailsMsg.emailDeleteSuccess))
      }
    },
    onError: () => {
      toast.error(formatMessage(emailsMsg.emailDeleteError))
    },
  })

  const [setPrimaryEmail] = useSetPrimaryEmailMutation({
    onCompleted: (data) => {
      if (data.userEmailsSetPrimaryEmail) {
        refreshEmailList()
        toast.success(formatMessage(emailsMsg.emailMakePrimarySuccess))
      }
    },
    onError: () => {
      toast.error(formatMessage(emailsMsg.emailMakePrimaryError))
    },
  })

  const [setActorProfileEmail] = useSetActorProfileEmailMutation({
    onCompleted: (data) => {
      if (data.setActorProfileEmail) {
        refreshEmailList()
        toast.success(formatMessage(emailsMsg.emailSetActorProfileSuccess))
      }
    },
    onError: () => {
      toast.error(formatMessage(emailsMsg.emailSetActorProfileError))
    },
  })

  const createCtaList = (item: Email): EmailCta[] => {
    const commonList = [
      {
        emailId: item.id,
        label: formatMessage(emailsMsg.emailDelete),
        isDestructive: true,
        onClick(emailId: string) {
          deleteEmail({
            variables: {
              input: {
                emailId,
              },
            },
          })
        },
      },
    ]

    if (
      (isActor && item?.isConnectedToActorProfile) ||
      (!isActor && item.primary)
    ) {
      return commonList
    } else if (isActor) {
      return [
        {
          label: formatMessage(emailsMsg.connectEmailToDelegation),
          emailId: item.id,
          onClick(emailId: string) {
            const fromNationalId = userInfo.profile?.actor?.nationalId

            if (!fromNationalId) {
              return
            }

            setActorProfileEmail({
              variables: {
                input: {
                  emailId,
                },
              },
            })
          },
        },
        ...commonList,
      ]
    }

    return [
      {
        label: formatMessage(emailsMsg.emailMakePrimary),
        emailId: item.id,
        onClick(emailId: string) {
          setPrimaryEmail({
            variables: {
              input: {
                emailId,
              },
            },
          })
        },
      },
      ...commonList,
    ]
  }

  const getTag = (email: Email): EmailCardTag | undefined => {
    if (isActor && email.isConnectedToActorProfile) {
      return 'connected_to_delegation'
    } else if (!isActor && email.primary) {
      return 'primary'
    } else if (email.emailStatus === DataStatus.NotVerified) {
      return 'not_verified'
    }

    return undefined
  }

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      {items.map((item) => (
        <EmailCard
          key={item.id}
          title={item.email}
          tag={getTag(item)}
          ctaList={createCtaList(item)}
        />
      ))}
    </Box>
  )
}
