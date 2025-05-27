import { Box, Button, Option, Select, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Email,
  UserProfile,
  UserProfileActorProfile,
} from '@island.is/portals/my-pages/graphql'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { emailsMsg } from '../../../lib/messages'
import { ProfileEmailForm } from '../../emails/ProfileEmailForm/ProfileEmailForm'
import { AddEmailMutation } from '../../emails/ProfileEmailForm/addEmail.mutation.generated'
import * as styles from './ActorProfileEmails.css'
import { useUserProfileSetActorProfileEmailMutation } from './userProfileSetActorProfileEmail.mutation.generated'

type EmailOption = Option<string> & { id: string }

const mapEmailsToOptions = (email: Email): EmailOption => ({
  id: email.id,
  label: email.email ?? '',
  value: email.email ?? '',
})

type IdFilter = { id: string; email?: never }
type EmailFilter = { email: string; id?: never }

/**
 * Get the selected option from a list of emails based on the filter
 * @param emails - List of emails to search through
 * @param filter - Filter to use to find the selected option
 */
const getSelectedOption = (emails: Email[], filter: IdFilter | EmailFilter) => {
  const option = emails.find(
    (email) => email.id === filter.id || email.email === filter.email,
  )

  if (!option) {
    return null
  }

  return mapEmailsToOptions(option)
}

type ActorProfileEmailsProps = {
  actorProfile: UserProfileActorProfile
  userProfile: UserProfile
}

export const ActorProfileEmails = ({
  actorProfile,
  userProfile,
}: ActorProfileEmailsProps) => {
  const { formatMessage } = useLocale()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const emails = userProfile.emails
  const [selectedOption, setSelectedOption] = useState<EmailOption | null>(null)

  const [userProfileSetActorProfileEmail, { data: setActorProfileEmailData }] =
    useUserProfileSetActorProfileEmailMutation({
      onCompleted: (data) => {
        if (data.userProfileSetActorProfileEmail) {
          toast.success(formatMessage(emailsMsg.emailSetActorProfileSuccess))
        }
      },
      onError: () => {
        toast.error(formatMessage(emailsMsg.emailMakePrimaryError))
      },
    })

  const currentEmailId =
    setActorProfileEmailData?.userProfileSetActorProfileEmail?.email

  const options = useMemo(
    () => emails?.filter(({ email }) => email).map(mapEmailsToOptions),
    [emails],
  )

  useEffect(() => {
    const emailsFilter = currentEmailId
      ? { email: currentEmailId }
      : actorProfile.emailsId
      ? { id: actorProfile.emailsId }
      : null

    if (!emails || !emailsFilter) {
      return
    }

    // Set the selected option based on the filter (either email id or email address)
    setSelectedOption(getSelectedOption(emails, emailsFilter))
  }, [emails, currentEmailId, actorProfile.emailsId])

  /**
   * Sets the selected option state and updates actor profile email.
   */
  const handleEmailChange = (option: EmailOption | null) => {
    if (!option?.id || !userProfile?.nationalId) {
      return
    }

    setSelectedOption(option)
    userProfileSetActorProfileEmail({
      variables: {
        input: {
          emailId: option.id,
          fromNationalId: actorProfile.fromNationalId,
        },
      },
    })
  }

  const hideEmailForm = useCallback(() => {
    setShowEmailForm(false)
  }, [])

  const onAddSuccess = useCallback(
    (data: AddEmailMutation['userEmailsAddEmail']) => {
      userProfileSetActorProfileEmail({
        variables: {
          input: {
            emailId: data.id,
            fromNationalId: actorProfile.fromNationalId,
          },
        },
      }).finally(hideEmailForm)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actorProfile.fromNationalId],
  )

  const hasEmails = options && options.length > 0

  return (
    <Box>
      {showEmailForm ? (
        <ProfileEmailForm
          onCancel={hideEmailForm}
          onAddSuccess={onAddSuccess}
        />
      ) : (
        <div className={styles.selectWrapper}>
          {hasEmails && (
            <Select
              options={options}
              value={selectedOption}
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
