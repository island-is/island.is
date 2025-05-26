import { Email } from '@island.is/api/schema'
import { Box, toast } from '@island.is/island-ui/core'
import {
  DataStatus,
  USER_PROFILE,
  client,
} from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useIntl } from 'react-intl'
import { useActorProfile } from '../../../hooks/useActorProfile'
import { emailsMsg } from '../../../lib/messages'
import { EmailCard, EmailCardTag, EmailCta } from '../EmailCard/EmailCard'
import { useDeleteEmailMutation } from './deleteEmail.mutation.generated'
import { useSetActorProfileEmailMutation } from './setActorProfileEmail.mutation.generated'
import { useSetPrimaryEmailMutation } from './setPrimaryEmail.mutation.generated'
import { useScopeAccess } from '../../../hooks/useScopeAccess'

type EmailsListProps = {
  items: Email[]
}

export const EmailsList = ({ items }: EmailsListProps) => {
  const { formatMessage } = useIntl()
  const userInfo = useUserInfo()
  const { data: actorProfile, refetch: refetchActorProfile } = useActorProfile()
  const actorProfileEmail = actorProfile?.email
  const { hasUserProfileWrite } = useScopeAccess()
  const isActor = !!userInfo?.profile?.actor?.nationalId

  const refreshEmailList = () => {
    if (isActor) {
      refetchActorProfile()
    }

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
    const deleteEmailCta: EmailCta = {
      emailId: item.id,
      label: formatMessage(emailsMsg.emailDelete),
      isDestructive: true,
      onClick(emailId: string) {
        deleteEmail({
          variables: { input: { emailId } },
        })
      },
    }

    const makePrimaryCta: EmailCta = {
      emailId: item.id,
      label: formatMessage(emailsMsg.emailMakePrimary),
      onClick(emailId: string) {
        setPrimaryEmail({
          variables: { input: { emailId } },
        })
      },
    }

    const connectToDelegationCta: EmailCta = {
      emailId: item.id,
      label: formatMessage(emailsMsg.connectEmailToDelegation),
      onClick(emailId: string) {
        const fromNationalId = userInfo.profile?.actor?.nationalId

        if (!fromNationalId) {
          return
        }

        setActorProfileEmail({
          variables: { input: { emailId } },
        })
      },
    }

    const ctaList: EmailCta[] = [deleteEmailCta]

    if (isActor) {
      ctaList.push(connectToDelegationCta)
    } else if (!item.primary) {
      ctaList.push(makePrimaryCta)
    }

    return ctaList
  }

  const getTag = (email: Email): EmailCardTag | undefined => {
    if (isActor) {
      if (
        email.isConnectedToActorProfile &&
        email.email === actorProfileEmail
      ) {
        return 'connected_to_delegation'
      }

      return undefined
    }

    if (email.primary) {
      return 'primary'
    } else if (email.isConnectedToActorProfile) {
      return 'connected_to_delegation'
    } else if (email.emailStatus === DataStatus.NotVerified) {
      return 'not_verified'
    }
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
