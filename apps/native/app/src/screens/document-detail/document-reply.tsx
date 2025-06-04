import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'

import styled, { css, useTheme } from 'styled-components/native'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import {
  Button,
  NavigationBarSheet,
  Problem,
  Spacing,
  TextField,
  Typography,
} from '../../ui'
import { Container } from '../../ui/lib/container/container'
import {
  useDocumentReplyMutation,
  useGetProfileQuery,
} from '../../graphql/types/schema'
import { LoadingIcon } from '../../components/nav-loading-spinner/loading-icon'
import { useAuthStore } from '../../stores/auth-store'

const Host = styled.SafeAreaView`
  flex: 1;
`

const Row = styled(Container)<{
  hasBottomBorder?: boolean
  paddingVertical?: Spacing
}>`
  flex-direction: row;
  padding-vertical: ${({ paddingVertical = 1, theme }) =>
    theme.spacing[paddingVertical]}px;
  ${({ hasBottomBorder = true, theme }) =>
    hasBottomBorder &&
    css`
      border-bottom-width: ${theme.border.width.standard}px;
      border-bottom-color: ${theme.color.blue200};
    `}
`

const HeaderTitle = styled(Row)`
  padding-bottom: ${({ theme }) => theme.spacing.p2}px;
`

const TextAreaWrapper = styled.View`
  flex: 1;
`

const TextArea = styled(TextField)`
  height: 170px;
`

const Footer = styled(Container)`
  flex: 1;
  justify-content: flex-end;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

type DocumentReplyScreenProps = {
  senderName: string
  documentId: string
  subject: string
}

export const DocumentReplyScreen: NavigationFunctionComponent<
  DocumentReplyScreenProps
> = ({ componentId, senderName, documentId, subject }) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()
  const { userInfo } = useAuthStore()

  const { data, loading, error } = useGetProfileQuery()
  const userProfile = data?.getUserProfile

  const [message, setMessage] = useState('')

  const [sendMessage, sendMessageResult] = useDocumentReplyMutation({
    fetchPolicy: 'network-only',
  })

  const onUploadPress = () => {
    console.log('upload')
  }

  const onSendPress = () => {
    // if (!userProfile?.email) {
    //   return
    // }
    console.log({
      documentId,
      body: message,
      reguesterEmail: userProfile?.email ?? 'snaer@aranja.com',
      reguesterName: userInfo?.name,
      subject,
    })
    sendMessage({
      variables: {
        input: {
          documentId,
          body: message,
          reguesterEmail: userProfile?.email ?? 'disa@hugsmidjan.is',
          reguesterName: userInfo?.name,
          subject,
        },
      },
    })
  }

  useEffect(() => {
    if (!userProfile?.email) {
      console.log('trigger email flow', userProfile)
      // TODO trigger email flow
    }
  }, [userProfile])

  console.log('sendMessageResult', sendMessageResult.data?.documentsV2Reply)

  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        onClosePress={() => Navigation.dismissModal(componentId)}
        includeContainer
      />
      <Host>
        {loading ? (
          <LoadingIcon />
        ) : error ? (
          <Problem type="error" error={error} withContainer />
        ) : (
          <>
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
                {userProfile?.email ?? 'snaer@aranja.com'}
              </Typography>
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
                  onChangeText={setMessage}
                />
              </TextAreaWrapper>
            </Row>
            <Row hasBottomBorder={false} paddingVertical={0}>
              <Button
                icon={require('../../assets/icons/attachment.png')}
                title={intl.formatMessage({
                  id: 'documentReply.uploadAttachment',
                })}
                isTransparent
                isOutlined
                onPress={onUploadPress}
                textStyle={{
                  color: theme.color.dark400,
                }}
              />
            </Row>
            <Footer>
              <Button
                title={intl.formatMessage({ id: 'documentReply.sendMessage' })}
                onPress={onSendPress}
                disabled={!message.trim()}
              />
            </Footer>
          </>
        )}
      </Host>
    </>
  )
}

DocumentReplyScreen.options = getNavigationOptions
