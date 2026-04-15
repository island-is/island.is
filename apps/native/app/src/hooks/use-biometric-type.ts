import { AuthenticationType } from 'expo-local-authentication'
import { useIntl } from 'react-intl'
import { Platform } from 'react-native'

import finger from '@/assets/icons/finger-16.png'
import iris from '@/assets/icons/iris-16.png'

export function useBiometricType(type: AuthenticationType[] = []) {
  const intl = useIntl()
  if (type.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    if (Platform.OS === 'ios') {
      return {
        text: intl.formatMessage({ id: 'onboarding.biometrics.type.faceId' }),
        icon: iris,
      }
    } else {
      return {
        text: intl.formatMessage({
          id: 'onboarding.biometrics.type.biometrics',
        }),
        icon: iris,
      }
    }
  } else if (type.includes(AuthenticationType.FINGERPRINT)) {
    if (Platform.OS === 'ios') {
      return {
        text: intl.formatMessage({
          id: 'onboarding.biometrics.type.fingerprint',
        }),
        icon: finger,
      }
    } else {
      return {
        text: intl.formatMessage({
          id: 'onboarding.biometrics.type.biometrics',
        }),
        icon: finger,
      }
    }
  } else if (type.includes(AuthenticationType.IRIS)) {
    return {
      text: intl.formatMessage({ id: 'onboarding.biometrics.type.iris' }),
      icon: iris,
    }
  }

  return {
    text: intl.formatMessage({ id: 'onboarding.biometrics.type.biometrics' }),
    icon: undefined,
  }
}
