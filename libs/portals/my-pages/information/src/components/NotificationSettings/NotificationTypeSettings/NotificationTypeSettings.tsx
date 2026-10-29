import {
  AccordionCard,
  AlertMessage,
  Box,
  Input,
  SkeletonLoader,
  Stack,
  Tag,
  Text,
  toast,
  ToggleSwitchButton,
} from '@island.is/island-ui/core'
import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { mNotifications } from '../../../lib/messages'
import {
  UserNotificationSettingsDocument,
  useUserNotificationSettingsQuery,
} from './userNotificationSettings.query.generated'
import { useUpdateNotificationCategorySettingsMutation } from './updateNotificationCategorySettings.mutation.generated'
import { useUpdateUserProfileSettingsMutation } from './updateUserProfileSettings.mutation.generated'
import { useUserProfileSettingsQuery } from './getUserProfile.query.generated'
import { Problem } from '@island.is/react-spa/shared'
import * as styles from '../cards/SettingsCard/SettingsCard.css'
import { ActionableOnlySettingsCard } from '../cards/ActionableOnlySettingsCard'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'

export const NotificationTypeSettings = () => {
  const { formatMessage } = useLocale()
  const [query, setQuery] = useState('')
  const { locale } = useLocale()

  const { value: isServicePortalOnlyActionablePriorityNotificationsEnabled } =
    useFeatureFlag(
      Features.isServicePortalOnlyActionablePriorityNotificationsEnabled,
      false,
    )
  const { value: isOnlyActionablePriorityNotificationsEnabled } =
    useFeatureFlag(Features.isOnlyActionablePriorityNotificationsEnabled, false)

  const {
    data: userProfileSettings,
    loading: profileLoading,
    error: profileError,
    refetch: refetchUserProfileSettings,
  } = useUserProfileSettingsQuery()

  const {
    data: userNotificationSettings,
    loading: notificationLoading,
    error: notificationError,
  } = useUserNotificationSettingsQuery({
    variables: { locale },
  })

  const [updateUserProfileSettings, { loading: updatingProfile }] =
    useUpdateUserProfileSettingsMutation()

  const [updateNotificationCategorySettings, { loading: updating }] =
    useUpdateNotificationCategorySettingsMutation({
      refetchQueries: [
        { query: UserNotificationSettingsDocument, variables: { locale } },
      ],
      awaitRefetchQueries: true,
    })

  const handleActionablePriorityChange = async (checked: boolean) => {
    if (updatingProfile || !userProfileSettings?.getUserProfile) {
      return
    }

    try {
      await updateUserProfileSettings({
        variables: {
          input: { onlyActionablePriorityNotifications: checked },
        },
      })
      await refetchUserProfileSettings()
    } catch {
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  const handleCategoryChange = async (
    senderId: string | null | undefined,
    category: string,
    checked: boolean,
  ) => {
    if (!senderId) {
      return
    }

    try {
      await updateNotificationCategorySettings({
        variables: {
          input: {
            categories: [{ senderId, category, blocked: !checked }],
          },
        },
      })
    } catch {
      toast.error(formatMessage(mNotifications.updateError))
    }
  }

  const filteredData = useMemo(() => {
    const normalizedQuery = query.toLowerCase()
    const senderData =
      userNotificationSettings?.userNotificationSettings?.senders ?? []

    return senderData
      .filter(
        (sender) =>
          sender.sender.title?.toLowerCase().includes(normalizedQuery) ||
          sender.categories.some((category) =>
            category.label.toLowerCase().includes(normalizedQuery),
          ),
      )
      .filter(
        (sender) => sender.sender.title && sender.sender.title.trim() !== '',
      )
  }, [query, userNotificationSettings])

  if (notificationLoading || profileLoading) {
    return <SkeletonLoader borderRadius="large" height={473} />
  }

  if (notificationError || profileError) {
    return <Problem error={notificationError ?? profileError} size="small" />
  }

  const onlyActionablePriorityNotifications =
    userProfileSettings?.getUserProfile?.onlyActionablePriorityNotifications ??
    false

  const isActionablePrioritySettingAvailable =
    isServicePortalOnlyActionablePriorityNotificationsEnabled &&
    isOnlyActionablePriorityNotificationsEnabled

  return (
    <Stack space={4}>
      {isActionablePrioritySettingAvailable && (
        <ActionableOnlySettingsCard
          title={formatMessage(mNotifications.actionablePriorityOnlyTitle)}
          subtitle={formatMessage(
            mNotifications.actionablePriorityOnlyDescription,
          )}
          toggleLabel={formatMessage(
            mNotifications.actionablePriorityOnlyAriaLabel,
          )}
          checked={onlyActionablePriorityNotifications}
          onChange={handleActionablePriorityChange}
        />
      )}

      <Stack space={1}>
        <Text variant="h4" as="h2">
          Stofnanir
        </Text>
        <Text variant="medium">{formatMessage(mNotifications.whatIntro)}</Text>
      </Stack>

      {onlyActionablePriorityNotifications && (
        <AlertMessage
          title={formatMessage(mNotifications.actionablePriorityOnlyAlertTitle)}
          message={formatMessage(
            mNotifications.actionablePriorityOnlyAlertMessage,
          )}
          type="info"
        />
      )}

      <Stack space={2}>
        <Input
          id="data-search"
          name="data-search"
          placeholder={formatMessage(mNotifications.searchPlaceholder)}
          value={query}
          icon={{ name: 'search' }}
          backgroundColor="blue"
          size="sm"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Stack space={1}>
          {filteredData.map((sender) => (
            <AccordionCard
              key={sender.sender.id}
              id={`notification-type-settings-${sender.sender.id}`}
              label={
                <Box
                  display="flex"
                  justifyContent={'spaceBetween'}
                  zIndex={10}
                  width="full"
                >
                  <Text variant="h4">{sender.sender.title}</Text>

                  {sender.categories.some((category) => category.blocked) && (
                    <Tag variant="rose" outlined>
                      {formatMessage(mNotifications.categoriesBlockedCount, {
                        count: sender.categories.filter(
                          (category) => category.blocked,
                        ).length,
                      })}
                    </Tag>
                  )}
                </Box>
              }
            >
              <Box paddingY={2} paddingBottom={1}>
                {sender.categories.map((category, index) => (
                  <Box
                    key={category.key}
                    background={index % 2 === 0 ? 'blue100' : 'white'}
                    padding={2}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="spaceBetween"
                      columnGap={2}
                    >
                      <Text>{category.label}</Text>
                      <ToggleSwitchButton
                        label={category.label}
                        checked={!category.blocked}
                        disabled={
                          updating || onlyActionablePriorityNotifications
                        }
                        hiddenLabel
                        className={styles.toggleButton}
                        onChange={(checked) =>
                          handleCategoryChange(
                            sender.sender.id,
                            category.category,
                            checked,
                          )
                        }
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionCard>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
