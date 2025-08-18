import { Box, toast, Option } from '@island.is/island-ui/core'
import { USER_PROFILE, client } from '@island.is/portals/my-pages/graphql'
import { DataStatus, Email } from '@island.is/api/schema'
import { useUserInfo } from '@island.is/react-spa/bff'
import { useIntl } from 'react-intl'
import { useActorProfile } from '../../../hooks/useActorProfile'
import { emailsMsg } from '../../../lib/messages'
import { EmailCard, EmailCardTag, EmailCta } from '../EmailCard/EmailCard'
import { useDeleteEmailMutation } from './DeleteEmail.mutation.generated'
import { useSetActorProfileEmailMutation } from './setActorProfileEmail.mutation.generated'
import { useSetPrimaryEmailMutation } from './SetPrimaryEmail.mutation.generated'
import { useCallback, useState } from 'react'
import { VerifyEmailModal } from '../../verify/VerifyEmailModal'

type EmailsListProps = {
  items: Email[]
}

type EmailOption = Option<string> & Pick<Email, 'id' | 'emailStatus'>

export const EmailsList = ({ items }: EmailsListProps) => {
  const { formatMessage } = useIntl()
  const userInfo = useUserInfo()
  const { data: actorProfile, refetch: refetchActorProfile } = useActorProfile()
  const actorProfileEmail = actorProfile?.email
  const isActor = !!userInfo?.profile?.actor?.nationalId
  const [previousOption, _setPreviousOption] = useState<EmailOption | null>(
    null,
  )
  const [_selectedOption, setSelectedOption] = useState<EmailOption | null>(
    null,
  )
  const [verifyEmailModalEmail, setVerifyEmailModalEmail] = useState<
    string | undefined
  >()

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
        // Check if email is verified
        if (item.emailStatus === DataStatus.NOT_VERIFIED) {
          setVerifyEmailModalEmail(item.email ?? '')
          return
        }

        setPrimaryEmail({
          variables: { input: { emailId } },
        })
      },
    }

    const connectToDelegationCta: EmailCta = {
      emailId: item.id,
      label: formatMessage(emailsMsg.connectEmailToDelegation),
      onClick(emailId: string) {
        if (item.emailStatus === DataStatus.NOT_VERIFIED) {
          setVerifyEmailModalEmail(item.email ?? '')
          return
        }

        const fromNationalId = userInfo.profile?.actor?.nationalId

        if (!fromNationalId) {
          return
        }

        setActorProfileEmail({
          variables: { input: { emailId } },
        })
      },
    }

    const ctaList: EmailCta[] = []

    if (isActor) {
      ctaList.push(connectToDelegationCta)
    } else if (!item.primary) {
      ctaList.push(makePrimaryCta)
    }

    ctaList.push(deleteEmailCta)

    return ctaList
  }

  const getTags = (email: Email): EmailCardTag[] => {
    const tags: EmailCardTag[] = []

    if (email.emailStatus === DataStatus.NOT_VERIFIED) {
      tags.push('not_verified')
    }

    if (isActor) {
      if (
        email.isConnectedToActorProfile &&
        email.email === actorProfileEmail
      ) {
        tags.push('connected_to_delegation')
      }

      return tags
    }

    if (email.primary) {
      tags.push('primary')
    }

    if (email.isConnectedToActorProfile) {
      tags.push('connected_to_delegation')
    }

    return tags
  }
  const onSuccess = useCallback(
    (emailId: string) => {
      const payload = { input: { emailId } }

      if (!isActor) {
        setPrimaryEmail({ variables: payload })
      } else {
        setActorProfileEmail({ variables: payload })
      }
    },
    [isActor, setPrimaryEmail, setActorProfileEmail],
  )

  const onModalClose = useCallback(() => {
    setVerifyEmailModalEmail(undefined)
    setSelectedOption(previousOption)
  }, [previousOption])

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      {items.map((item, index) => (
        <EmailCard
          key={`${item.id}-${index}`}
          title={item.email ?? ''}
          tags={getTags(item)}
          ctaList={createCtaList(item)}
        />
      ))}
      {verifyEmailModalEmail && (
        <VerifyEmailModal
          type="add"
          open={!!verifyEmailModalEmail}
          email={verifyEmailModalEmail}
          onClose={onModalClose}
          onSuccess={onSuccess}
        />
      )}
    </Box>
  )
}
