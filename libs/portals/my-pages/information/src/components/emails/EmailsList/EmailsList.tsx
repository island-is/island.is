import { Email } from '@island.is/api/schema'
import { Box, toast } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { emailsMsg } from '../../../lib/messages'
import { EmailCard, EmailCardTag, EmailCta } from '../EmailCard/EmailCard'
import { useDeleteEmailMutation } from './DeleteEmail.mutation.generated'
import { useSetPrimaryEmailMutation } from './SetPrimaryEmail.mutation.generated'
import {
  DataStatus,
  USER_PROFILE,
  client,
} from '@island.is/portals/my-pages/graphql'

type EmailsListProps = {
  items: Email[]
}

export const EmailsList = ({ items }: EmailsListProps) => {
  const { formatMessage } = useIntl()

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

  const createCtaList = (id: string): EmailCta[] => [
    {
      label: formatMessage(emailsMsg.emailMakePrimary),
      emailId: id,
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
    {
      emailId: id,
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

  const getTag = (email: Email): EmailCardTag | undefined => {
    if (email.primary) {
      return 'primary'
    } else if (email.emailStatus === DataStatus.NotVerified) {
      return 'not_verified'
    } else if (email.isConnectedToActorProfile) {
      return 'connected_to_delegation'
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
          ctaList={!item.primary ? createCtaList(item.id) : undefined}
        />
      ))}
    </Box>
  )
}
