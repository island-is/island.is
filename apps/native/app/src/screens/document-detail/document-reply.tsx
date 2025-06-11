import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { NavigationFunctionComponent } from 'react-native-navigation'

import styled from 'styled-components/native'
import { LoadingIcon } from '../../components/nav-loading-spinner/loading-icon'
import { Pressable } from '../../components/pressable/pressable'
import { useUser } from '../../contexts/user-provider'
import { useDocumentReplyMutation } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useNavigation } from '../../hooks/use-navigation'
import { useNavigationCurrentComponentId } from '../../hooks/use-navigation-current-component-id'
import { useAuthStore } from '../../stores/auth-store'
import {
  Button,
  Container,
  Icon,
  NavigationBarSheet,
  Problem,
  Spacing,
  TextField,
  Typography,
} from '../../ui'
import { ComponentRegistry } from '../../utils/component-registry'
import { isAndroid } from '../../utils/devices'

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
    borderBottomWidth: theme.border.width.standard,
    borderBottomColor: theme.color.blue200,
  }),
}))

const HeaderTitle = styled(Row)`
  padding-bottom: ${({ theme }) => theme.spacing.p2}px;
`

const TextAreaWrapper = styled.View`
  flex: 1;
`

const TextArea = styled(TextField)`
  height: 170px;
`

const Footer = styled(Container)(({ theme }) => ({
  flex: 1,
  justifyContent: 'flex-end',
  ...(isAndroid && {
    paddingBottom: theme.spacing.p2,
  }),
}))

const EmailIconWrapper = styled(Pressable)`
  margin-left: auto;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks(() => ({
    topBar: {
      visible: false,
    },
  }))

export type DocumentReplyScreenProps = {
  senderName: string
  documentId: string
  subject: string
  isFirstReply?: boolean
  onReplySuccess?(showFirstReplyInfo: boolean): void
}

export const DocumentReplyScreen: NavigationFunctionComponent<
  DocumentReplyScreenProps
> = ({
  componentId,
  senderName,
  documentId,
  subject,
  isFirstReply = false,
  onReplySuccess,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const { showModal, dismissModal } = useNavigation()
  const currentComponentId = useNavigationCurrentComponentId()
  const { userInfo } = useAuthStore()
  const { user: userProfile, loading, error } = useUser()

  const [message, setMessage] = useState('')

  const [sendMessage, { loading: sendMessageLoading }] =
    useDocumentReplyMutation({
      onCompleted: (data) => {
        const id = data.documentsV2Reply?.id

        if (id) {
          // Successful reply, clear message
          setMessage('')
          onReplySuccess?.(isFirstReply)
          dismissModal(componentId)
        }
      },
    })

  const onSendPress = () => {
    if (!userProfile?.email) {
      showModal(ComponentRegistry.RegisterEmailScreen)

      return
    }

    sendMessage({
      variables: {
        input: {
          documentId,
          body: message,
          reguesterEmail: userProfile.email,
          reguesterName: userInfo?.name,
          subject,
        },
      },
    })
  }

  const onEmailPress = () => {
    showModal(ComponentRegistry.SettingsScreen)
  }

  useEffect(() => {
    // Make sure we only instantiate the modal once
    if (!userProfile?.email && currentComponentId === componentId) {
      showModal(ComponentRegistry.RegisterEmailScreen)
    }
  }, [userProfile, showModal, currentComponentId, componentId])

  return (
    <>
      <NavigationBarSheet
        componentId={componentId}
        onClosePress={() => dismissModal(componentId)}
        includeContainer
        showLoading={sendMessageLoading}
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
                {userProfile?.email}
              </Typography>
              <EmailIconWrapper onPress={onEmailPress}>
                <Icon
                  source={require('../../assets/icons/chevron-forward.png')}
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
                  onChangeText={setMessage}
                />
              </TextAreaWrapper>
            </Row>
            <Footer>
              <Button
                title={intl.formatMessage({ id: 'documentReply.sendMessage' })}
                onPress={onSendPress}
                disabled={!message.trim() || sendMessageLoading}
              />
            </Footer>
          </>
        )}
      </Host>
    </>
  )
}

DocumentReplyScreen.options = getNavigationOptions
