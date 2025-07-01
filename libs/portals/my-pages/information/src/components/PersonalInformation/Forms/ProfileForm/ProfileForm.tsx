import { useEffect, useMemo, useState } from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  PhoneInput,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { LoadModal, m, parseNumber } from '@island.is/portals/my-pages/core'
import {
  useDeleteEmailOrPhoneValue,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'

import { useUserInfo } from '@island.is/react-spa/bff'
import orderBy from 'lodash/orderBy'
import { FormattedMessage } from 'react-intl'
import { useDelegationTypeFeatureFlag } from '../../../../hooks/useDelegationTypeFeatureFlag'
import { useScopeAccess } from '../../../../hooks/useScopeAccess'
import { emailsMsg, msg } from '../../../../lib/messages'
import { InformationPaths } from '../../../../lib/paths'
import { bankInfoObject } from '../../../../utils/bankInfoHelper'
import { EmailsList } from '../../../emails/EmailsList/EmailsList'
import { ProfileEmailForm } from '../../../emails/ProfileEmailForm/ProfileEmailForm'
import { DropModal } from './components/DropModal'
import { InputSection } from './components/InputSection'
import { BankInfoForm } from './components/Inputs/BankInfoForm'
import { InputPhone } from './components/Inputs/Phone'
import { WithLinkWrapper } from './components/Inputs/WithLinkWrapper'
import { OnboardingIntro } from './components/Intro'
import { useConfirmNudgeMutation } from './confirmNudge.generated'
import { DropModalType } from './types/form'
import { InputEmail } from './components/Inputs/Email'
import { AccessDenied } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'

enum IdsUserProfileLinks {
  EMAIL = '/app/user-profile/email',
  PHONE_NUMBER = '/app/user-profile/phone',
}

interface ProfileFormProps {
  onCloseOverlay?: () => void
  onCloseDropModal?: () => void
  canDrop?: boolean
  title: string
  showIntroTitle?: boolean
  showIntroText?: boolean
  setFormLoading?: (isLoading: boolean) => void
}

export const ProfileForm = ({
  onCloseOverlay,
  onCloseDropModal,
  canDrop,
  title,
  setFormLoading,
  showIntroTitle,
  showIntroText = true,
}: ProfileFormProps) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { hasUserProfileWriteScope } = useScopeAccess()

  const [telDirty, setTelDirty] = useState(true)
  const [emailDirty, setEmailDirty] = useState(true)
  const [internalLoading, setInternalLoading] = useState(false)
  const [showDropModal, setShowDropModal] = useState<DropModalType>()
  const { deleteEmailOrPhoneValue, loading: deleteLoading } =
    useDeleteEmailOrPhoneValue()
  const [showEmailForm, setShowEmailForm] = useState(false)

  const userInfo = useUserInfo()

  const { data: userProfile, loading: userLoading, refetch } = useUserProfile()

  const { isDelegationTypeEnabled, isCheckingFeatureFlag } =
    useDelegationTypeFeatureFlag()

  // Filter out emails that are not set
  const emails = useMemo(() => {
    return (
      orderBy(
        userProfile?.emails?.filter((item) => item.email),
        ['email'],
      ) ?? []
    )
  }, [userProfile?.emails])

  const [confirmNudge] = useConfirmNudgeMutation()
  const isCompany = userInfo?.profile?.subjectType === 'legalEntity'

  /**
   * Creates a link to the IDS user profile page.
   * By setting the state to update, the user will exit the onboarding process after updating the desired field.
   */
  const getIDSLink = (linkPath: IdsUserProfileLinks) => {
    return `${
      userInfo.profile.iss
    }${linkPath}?state=update&returnUrl=${encodeURIComponent(
      window.location.toString(),
    )}`
  }

  useEffect(() => {
    if (setFormLoading) {
      setFormLoading(deleteLoading)
    }
  }, [deleteLoading])

  useEffect(() => {
    if (canDrop && onCloseOverlay) {
      const showAll = telDirty && 'all'
      const showEmail = emailDirty && 'mail'
      const showTel = telDirty && 'tel'
      const showDropModal = showAll || showEmail || showTel || undefined
      if (showDropModal) {
        setShowDropModal(showDropModal)
      } else {
        setInternalLoading(true)
        confirmNudge().then(() => closeAllModals())
      }
    }
  }, [canDrop])

  const closeAllModals = () => {
    if (onCloseOverlay && setFormLoading) {
      onCloseOverlay()
      setInternalLoading(false)
      setFormLoading(false)
    }
  }

  const submitEmptyTel = async () => {
    try {
      const refetchUserProfile = await refetch()
      const userProfileData = refetchUserProfile?.data?.getUserProfile

      const emptyProfile =
        !userProfileData || userProfileData.needsNudge === null
      if (emptyProfile && telDirty && emailDirty) {
        /**
         * If the user has no email or tel data, and the inputs are empty,
         * We will save the email and mobilePhoneNumber as undefined
         * With a status of 'EMPTY'. This implies empty values by the user's choice.
         * After asking the user to verify that they are updating their profile with empty fields.
         */

        await deleteEmailOrPhoneValue({
          email: true,
          mobilePhoneNumber: true,
        }).then(() => closeAllModals())
      } else {
        closeAllModals()
      }
    } catch {
      // do nothing
      closeAllModals()
    }
  }

  const dropSideEffects = async () => {
    try {
      if (setFormLoading) {
        setFormLoading(true)
        setInternalLoading(true)
      }
      if (telDirty) {
        await submitEmptyTel()
      } else {
        await confirmNudge().then(() => closeAllModals())
      }
    } catch (e) {
      closeAllModals()
    }
  }

  if (!isDelegationTypeEnabled && !hasUserProfileWriteScope) {
    return <AccessDenied />
  }

  return (
    <GridContainer>
      <GridRow marginBottom={10}>
        <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
          <OnboardingIntro
            name={title || ''}
            showIntroTitle={showIntroTitle}
            showIntroText={showIntroText}
          />
          {!isCheckingFeatureFlag &&
            (isDelegationTypeEnabled ? (
              <InputSection
                title={formatMessage(emailsMsg.emails)}
                text={
                  <FormattedMessage
                    {...emailsMsg.emailListText}
                    values={{
                      link: (
                        <Link
                          color="blue400"
                          href={InformationPaths.Notifications}
                          underlineVisibility="always"
                          underline="small"
                        >
                          {formatMessage(emailsMsg.emailListTextLink)}
                        </Link>
                      ),
                    }}
                  />
                }
                divider={hasUserProfileWriteScope}
              >
                {userLoading && emails ? (
                  <SkeletonLoader
                    repeat={3}
                    height={80}
                    space={2}
                    borderRadius="large"
                  />
                ) : (
                  <Box display="flex" flexDirection="column" rowGap={2}>
                    {emails.length > 0 && <EmailsList items={emails} />}
                    {emails.length === 0 || showEmailForm ? (
                      <ProfileEmailForm
                        onAddSuccess={() => setShowEmailForm(false)}
                      />
                    ) : (
                      <Box marginTop={1}>
                        <Button
                          variant="text"
                          size="small"
                          icon="add"
                          onClick={() => setShowEmailForm(true)}
                        >
                          {formatMessage(emailsMsg.addEmail)}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </InputSection>
            ) : (
              hasUserProfileWriteScope && (
                <Box marginTop={2}>
                  <InputEmail
                    buttonText={formatMessage(msg.saveEmail)}
                    email={userProfile?.email || ''}
                    emailDirty={(isDirty) => setEmailDirty(isDirty)}
                    emailVerified={userProfile?.emailVerified}
                    disabled={deleteLoading}
                  />
                </Box>
              )
            ))}
          {hasUserProfileWriteScope && (
            <>
              <InputSection
                title={formatMessage(m.telNumber)}
                text={formatMessage(msg.editTelText)}
                loading={userLoading}
              >
                {!userLoading &&
                  (!isCompany ? (
                    <WithLinkWrapper
                      input={
                        <PhoneInput
                          name="phoneNumber"
                          label={formatMessage(msg.tel)}
                          placeholder="000-0000"
                          value={parseNumber(
                            userProfile?.mobilePhoneNumber || '',
                          )}
                          size="xs"
                          readOnly
                          {...(userProfile?.mobilePhoneNumberVerified && {
                            icon: { name: 'checkmark' },
                          })}
                        />
                      }
                      link={{
                        href: getIDSLink(IdsUserProfileLinks.PHONE_NUMBER),
                        title: formatMessage(
                          userProfile?.mobilePhoneNumber ? msg.change : msg.add,
                        ),
                      }}
                    />
                  ) : (
                    <InputPhone
                      buttonText={formatMessage(msg.saveTel)}
                      mobile={parseNumber(userProfile?.mobilePhoneNumber || '')}
                      telVerified={userProfile?.mobilePhoneNumberVerified}
                      telDirty={(isDirty) => setTelDirty(isDirty)}
                      disabled={deleteLoading}
                    />
                  ))}
              </InputSection>
              <InputSection
                title={formatMessage(m.bankAccountInfo)}
                text={formatMessage(msg.editBankInfoText)}
                loading={userLoading}
                divider={false}
              >
                {!userLoading && !userProfile?.bankInfoError && (
                  <BankInfoForm
                    bankInfo={bankInfoObject(userProfile?.bankInfo || '')}
                  />
                )}
                {!userLoading && userProfile?.bankInfoError && (
                  <Problem size="small" />
                )}
              </InputSection>
            </>
          )}
          {showDropModal && onCloseOverlay && !internalLoading && (
            <DropModal
              type={showDropModal}
              onDrop={dropSideEffects}
              loading={deleteLoading || userLoading}
              onClose={() => {
                onCloseDropModal && onCloseDropModal()
                setShowDropModal(undefined)
              }}
            />
          )}
          {internalLoading && <LoadModal />}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ProfileForm
