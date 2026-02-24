import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import styled from 'styled-components/native'

import { LoadingIcon } from '@/components/nav-loading-spinner/loading-icon'
import { Pressable } from '@/components/pressable/pressable'
import {
  useDocumentReplyMutation,
  useGetProfileQuery,
} from '@/graphql/types/schema'
import { useAuthStore } from '@/stores/auth-store'
import {
  Button,
  Container,
  Icon,
  NavigationBarSheet,
  Problem,
  Spacing,
  TextField,
  Typography,
} from '@/ui'
import { isAndroid } from '@/utils/devices'

const Wrapper = styled.View`
  flex: 1;
`

const Host = styled.SafeAreaView`
  flex: 1;
`

const Row = styled(Container)<{
  hasBottomBorder?: boolean
  paddingVertical?: Spacing
}>(({ hasBottomBorder = true, paddingVertical = 1, theme }) => ({
  flexDirection: 'row',
  paddingTop: theme.spacing[paddingVertical],
  paddingBottom: theme.spacing[paddingVertical],
  ...(hasBottomBorder && {
    borderBottomWidth: theme.border.width.hairline,
    borderBottomColor: theme.color.blue200,
  }),
}))

const HeaderTitle = styled(Row)`
  padding-bottom: ${({ theme }) => theme.spacing.p2}px;
`

const TextAreaWrapper = styled.View`
  flex: 1;
  height: 170px;
`

const TextArea = styled(TextField)(({ theme }) => ({
  flex: 1,
  paddingBottom: theme.spacing[isAndroid ? 4 : 2],
}))

const Footer = styled(Container)(({ theme }) => ({
  justifyContent: 'flex-end',
  ...(isAndroid && {
    paddingBottom: theme.spacing.p2,
  }),
}))

const EmailIconWrapper = styled(Pressable)`
  margin-left: auto;
`

export default function DocumentReplyScreen() {
  const { id: documentId, senderName, subject } = useLocalSearchParams<{
    id: string
    senderName: string
    subject: string
  }>()
  const intl = useIntl()
  const { userInfo } = useAuthStore()
  const { data: userProfileData, loading, error } = useGetProfileQuery()
  const userProfile = userProfileData?.getUserProfile

  const [message, setMessage] = useState('')
  const [hasShownModal, setHasShownModal] = useState(false)

  const [sendMessage, { loading: sendMessageLoading }] =
    useDocumentReplyMutation({
      onCompleted: (data) => {
        if (data.documentsV2Reply?.id) {
          setMessage('')
          router.back()
        }
      },
    })

  const onSendPress = () => {
    if (!userProfile?.email) {
      router.push('/(auth)/(modals)/edit-email')
      return
    }

    sendMessage({
      variables: {
        input: {
          documentId,
          body: message,
          requesterEmail: userProfile.email,
          requesterName: userInfo?.name,
          subject: subject ?? '',
        },
      },
    })
  }

  const onEmailPress = () => {
    router.push('/(auth)/(modals)/settings')
  }

  useEffect(() => {
    if (!userProfile?.email && !hasShownModal) {
      setHasShownModal(true)
      router.push('/(auth)/(modals)/edit-email')
    }
  }, [userProfile, hasShownModal])

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NavigationBarSheet
        onClosePress={() => router.back()}
        style={{ marginHorizontal: 16 }}
        showLoading={sendMessageLoading}
      />
      <Host>
        {loading ? (
          <LoadingIcon />
        ) : error ? (
          <Problem type="error" error={error} withContainer />
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Wrapper>
              <HeaderTitle>
                <Typography
                  variant="heading5"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {subject}
                </Typography>
              </HeaderTitle>
              <Row>
                <Typography
                  variant="body3"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {intl.formatMessage({ id: 'documentReply.to' })}
                  {': '}
                </Typography>
                <Typography
                  variant="eyebrow"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {senderName}
                </Typography>
              </Row>
              <Row>
                <Typography
                  variant="body3"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {intl.formatMessage({ id: 'documentReply.from' })}
                  {': '}
                </Typography>
                <Typography
                  variant="eyebrow"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userProfile?.email}
                </Typography>
                <EmailIconWrapper onPress={onEmailPress}>
                  <Icon
                    source={require('@/assets/icons/chevron-forward.png')}
                    width={16}
                    height={16}
                  />
                </EmailIconWrapper>
              </Row>
              <Row hasBottomBorder={false} paddingVertical={2}>
                <TextAreaWrapper>
                  <TextArea
                    label={intl.formatMessage({ id: 'documentReply.message' })}
                    multiline
                    value={message}
                    placeholder={intl.formatMessage({
                      id: 'documentReply.messagePlaceholder',
                    })}
                    textAlignVertical="top"
                    scrollEnabled
                    onChangeText={setMessage}
                  />
                </TextAreaWrapper>
              </Row>
            </Wrapper>
            <Footer>
              <Button
                title={intl.formatMessage({ id: 'documentReply.sendMessage' })}
                onPress={onSendPress}
                disabled={!message.trim() || sendMessageLoading}
              />
            </Footer>
          </ScrollView>
        )}
      </Host>
    </>
  )
}
