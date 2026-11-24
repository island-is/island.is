import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import logo from '@/assets/logo/logo-64w.png'
import illustration from '@/assets/illustrations/onboarding-biometrics.png'
import { Alert, Button, token } from '@/ui'
import { LockUserCard } from './lock-user-card'

// Scrolls only when it doesn't fit, e.g. with very large text on a small
// phone: then the buttons can still be reached.
const Host = styled.ScrollView`
  flex: 1;
  background-color: ${token((t) => t.background.invert)};
`

const Content = styled.View`
  flex-grow: 1;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const Logo = styled.Image`
  align-self: center;
  width: 40px;
  height: 40px;
  margin-top: ${({ theme }) => theme.spacing[4]}px;
`

const IllustrationWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-vertical: ${({ theme }) => theme.spacing[3]}px;
`

// Smaller than this the illustration can't be made out, so it's left out.
const MIN_ILLUSTRATION_HEIGHT = 100

const Illustration = styled.Image`
  width: 75%;
  height: 100%;
`

const Footer = styled.View`
  gap: ${({ theme }) => theme.spacing[1]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const ButtonStack = styled.View`
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  gap: ${({ theme }) => theme.spacing[1]}px;
`

/**
 * - `idle`: waiting for the person to choose how to open the app
 * - `prompting`: the system biometric prompt is up
 * - `failed`: biometrics failed or the prompt was cancelled
 */
/** `lockedOut`: too many failed attempts, so the phone turned biometrics off */
export type DeviceLockStatus = 'idle' | 'prompting' | 'failed' | 'lockedOut'

/**
 * Why electronic ID didn't open the app:
 * - `tooManyRequests`: IAS allows only a few requests in a short time
 * - `failed`: anything else
 */
export type ElectronicIdError = 'tooManyRequests' | 'failed'

interface DeviceLockProps {
  name: string
  nationalId: string
  /**
   * Display name of the biometrics to offer, e.g. "Face ID". Leave out when
   * biometrics aren't turned on, and electronic ID is the only way in.
   */
  biometricType?: string
  status?: DeviceLockStatus
  /** Shown in place of the biometrics error, as the more recent one. */
  electronicIdError?: ElectronicIdError
  /** No network: said in place of the other messages, as the likely cause. */
  isOffline?: boolean
  onBiometricsPress(): void
  onElectronicIdPress(): void
  onLogoutPress(): void
}

/**
 * The lock screen without a PIN: the app opens with biometrics, or with
 * electronic ID when biometrics fail or aren't turned on.
 */
export function DeviceLock({
  name,
  nationalId,
  biometricType,
  status = 'idle',
  electronicIdError,
  isOffline,
  onBiometricsPress,
  onElectronicIdPress,
  onLogoutPress,
}: DeviceLockProps) {
  const intl = useIntl()
  // The lock is a full-screen modal, where SafeAreaView gets no insets on
  // iOS. The provider's are the window's.
  const insets = useSafeAreaInsets()
  // The space left for the illustration: less on a small phone, with large
  // text, or when a message is up.
  const [illustrationHeight, setIllustrationHeight] = useState<number>()
  const showsIllustration =
    illustrationHeight === undefined ||
    illustrationHeight >= MIN_ILLUSTRATION_HEIGHT
  const isPrompting = status === 'prompting'
  // Locked out, electronic ID is the only way in for now.
  const offersBiometrics = !!biometricType && status !== 'lockedOut'

  return (
    <Host contentContainerStyle={{ flexGrow: 1 }} alwaysBounceVertical={false}>
      <Content style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Logo source={logo} resizeMode="contain" />
        <IllustrationWrapper
          onLayout={(event) =>
            setIllustrationHeight(event.nativeEvent.layout.height)
          }
        >
          {showsIllustration && (
            <Illustration source={illustration} resizeMode="contain" />
          )}
        </IllustrationWrapper>
        <Footer>
          {isOffline ? (
            <Alert
              type="warning"
              size="small"
              hasBorder
              title={intl.formatMessage({ id: 'offline.title' })}
              message={intl.formatMessage({
                id: 'offline.openAppMessage',
              })}
            />
          ) : electronicIdError ? (
            <Alert
              type="error"
              size="small"
              hasBorder
              title={intl.formatMessage({
                id: 'applock.electronicIdFailedTitle',
              })}
              message={intl.formatMessage({
                id:
                  electronicIdError === 'tooManyRequests'
                    ? 'electronicId.error.tooManyRequests'
                    : 'electronicId.error.tryAgain',
              })}
            />
          ) : (
            biometricType &&
            (status === 'failed' || status === 'lockedOut') && (
              <Alert
                type="error"
                size="small"
                hasBorder
                title={
                  status === 'lockedOut'
                    ? intl.formatMessage(
                        { id: 'applock.biometricsLockedOutTitle' },
                        { biometricType },
                      )
                    : intl.formatMessage({
                        id: 'applock.biometricsFailedTitle',
                      })
                }
                message={intl.formatMessage({
                  id:
                    status === 'lockedOut'
                      ? 'applock.biometricsLockedOutMessage'
                      : 'applock.biometricsFailedMessage',
                })}
              />
            )
          )}
          <LockUserCard
            name={name}
            nationalId={nationalId}
            onLogoutPress={onLogoutPress}
          />
          {offersBiometrics ? (
            <ButtonStack>
              <Button
                title={intl.formatMessage(
                  { id: 'applock.openWithBiometrics' },
                  { biometricType },
                )}
                onPress={onBiometricsPress}
                loading={isPrompting}
              />
              <Button
                isOutlined
                title={intl.formatMessage({ id: 'applock.useElectronicId' })}
                onPress={onElectronicIdPress}
                disabled={isPrompting}
              />
            </ButtonStack>
          ) : (
            <ButtonStack>
              <Button
                title={intl.formatMessage({
                  id: 'applock.openWithElectronicId',
                })}
                onPress={onElectronicIdPress}
              />
            </ButtonStack>
          )}
        </Footer>
      </Content>
    </Host>
  )
}
