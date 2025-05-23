import {
  Box,
  Button,
  Option,
  Select,
  SkeletonLoader,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Email,
  UserProfileActorProfile,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'
import { useCallback, useMemo, useState } from 'react'
import { emailsMsg } from '../../../lib/messages'
import { ProfileEmailForm } from '../../emails/ProfileEmailForm/ProfileEmailForm'
import * as styles from './ActorProfileEmails.css'
import { useUserProfileSetActorProfileEmailMutation } from './userProfileSetActorProfileEmail.mutation.generated'

type EmailOption = Option<string> & { id: string }

const mapEmailsToOptions = (email: Email): EmailOption => ({
  id: email.id,
  label: email.email ?? '',
  value: email.email ?? '',
})

type ActorProfileEmailsProps = {
  profile: UserProfileActorProfile
}

export const ActorProfileEmails = ({ profile }: ActorProfileEmailsProps) => {
  const { formatMessage } = useLocale()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const { data: userProfile, loading: userLoading, refetch } = useUserProfile()

  const { options, connectedOption } = useMemo(() => {
    const emails = userProfile?.emails ?? []
    const connected = emails.find((email) => email.id === profile.emailsId)

    return {
      options: emails.filter(({ email }) => email).map(mapEmailsToOptions),
      connectedOption: connected ? mapEmailsToOptions(connected) : undefined,
    }
  }, [userProfile, profile.emailsId])

  const [userProfileSetActorProfileEmail] =
    useUserProfileSetActorProfileEmailMutation({
      onCompleted: (data) => {
        if (data.userProfileSetActorProfileEmail) {
          toast.success(formatMessage(emailsMsg.emailSetActorProfileSuccess))
          refetch()
        }
      },
      onError: () => {
        toast.error(formatMessage(emailsMsg.emailMakePrimaryError))
      },
    })

  const handleEmailChange = (option: EmailOption | null) => {
    if (!option?.id || !userProfile?.nationalId) {
      return
    }

    userProfileSetActorProfileEmail({
      variables: {
        input: {
          emailId: option.id,
          fromNationalId: profile.fromNationalId,
        },
      },
    })
  }

  const hideEmailForm = useCallback(() => {
    setShowEmailForm(false)
  }, [])

  if (userLoading) {
    return <SkeletonLoader borderRadius="large" height={88} />
  }

  const hasEmails = options.length > 0

  return (
    <Box>
      {showEmailForm ? (
        <ProfileEmailForm
          onCancel={hideEmailForm}
          onAddSuccess={hideEmailForm}
        />
      ) : (
        <div className={styles.selectWrapper}>
          {hasEmails && (
            <Select
              options={options}
              defaultValue={connectedOption}
              size="sm"
              onChange={(option) => handleEmailChange(option as EmailOption)}
            />
          )}
          <Box marginTop={hasEmails ? 2 : 0}>
            <Button
              variant="text"
              size="small"
              icon="add"
              onClick={() => setShowEmailForm(true)}
            >
              {formatMessage(emailsMsg.addEmail)}
            </Button>
          </Box>
        </div>
      )}
    </Box>
  )
}
