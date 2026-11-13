import React from 'react'
import { useIntl } from 'react-intl'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import logo from '@/assets/logo/home-logo.png'
import illustration from '@/assets/illustrations/onboarding-biometrics.png'
import { Alert, Button, token } from '@/ui'
import { LockUserCard } from './lock-user-card'

const Host = styled(SafeAreaView)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  background-color: ${token((t) => t.background.invert)};
`

const Logo = styled.Image`
  align-self: center;
  width: 136px;
  height: 22px;
  margin-top: ${({ theme }) => theme.spacing[4]}px;
`

const IllustrationWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-vertical: ${({ theme }) => theme.spacing[3]}px;
`

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
export type DeviceLockStatus = 'idle' | 'prompting' | 'failed'

interface DeviceLockProps {
  name: string
  nationalId: string
  /**
   * Display name of the biometrics to offer, e.g. "Face ID". Leave out when
   * biometrics aren't turned on, and electronic ID is the only way in.
   */
  biometricType?: string
  status?: DeviceLockStatus
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
  onBiometricsPress,
  onElectronicIdPress,
  onLogoutPress,
}: DeviceLockProps) {
  const intl = useIntl()
  const isPrompting = status === 'prompting'

  return (
    <Host>
      <Logo source={logo} resizeMode="contain" />
      <IllustrationWrapper>
        <Illustration source={illustration} resizeMode="contain" />
      </IllustrationWrapper>
      <Footer>
        {biometricType && status === 'failed' && (
          <Alert
            type="error"
            size="small"
            hasBorder
            // "lífkenni tókst ekki" starts a sentence here, unlike elsewhere.
            title={upperFirst(
              intl.formatMessage(
                { id: 'applock.biometricsFailedTitle' },
                { biometricType },
              ),
            )}
            message={intl.formatMessage({
              id: 'applock.biometricsFailedMessage',
            })}
          />
        )}
        <LockUserCard
          name={name}
          nationalId={nationalId}
          onLogoutPress={onLogoutPress}
        />
        {biometricType ? (
          <ButtonStack>
            <Button
              title={intl.formatMessage(
                { id: 'applock.openWithBiometrics' },
                { biometricType },
              )}
              onPress={onBiometricsPress}
              disabled={isPrompting}
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
    </Host>
  )
}

function upperFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
