import * as Crypto from 'expo-crypto'
import { Platform } from 'react-native'
import {
  attestWithAppAttest,
  deleteDeviceKey,
  generateDeviceKey,
  getDeviceKey,
  getDeviceKeyAttestationChain,
  signWithBiometricKey,
  signWithInstallKey,
} from '../../../modules/device-keys'
import type { IasDevice } from './types'

const base64ToBase64url = (base64: string) =>
  base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/** The IAS client's keys, on the device-keys native module. */
export const deviceKeysIasDevice: IasDevice = {
  os: Platform.OS === 'ios' ? 'ios' : 'android',

  getInstallKey: () => getDeviceKey('install'),
  generateInstallKey: (attestationChallenge) =>
    generateDeviceKey('install', { attestationChallenge }),
  async attestInstallKey(key, challenge) {
    // Simulators and emulators have no secure hardware to attest.
    if (key.securityLevel === 'software') {
      return { platform: 'dev' }
    }
    if (Platform.OS === 'android') {
      return {
        platform: 'android',
        certificateChain: getDeviceKeyAttestationChain('install') ?? [],
      }
    }
    const { keyId, attestationObject } = await attestWithAppAttest(
      `${challenge}.${key.thumbprint}`,
    )
    return { platform: 'apple', keyId, attestationObject }
  },
  signWithInstallKey,

  getBiometricKey: () => getDeviceKey('biometric'),
  generateBiometricKey: (attestationChallenge) =>
    generateDeviceKey('biometric', { attestationChallenge }),
  getBiometricKeyAttestationChain: () =>
    getDeviceKeyAttestationChain('biometric'),
  signWithBiometricKey,
  deleteBiometricKey: () => deleteDeviceKey('biometric'),

  async sha256(data) {
    return base64ToBase64url(
      await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data,
        {
          encoding: Crypto.CryptoEncoding.BASE64,
        },
      ),
    )
  },
  randomUUID: () => Crypto.randomUUID(),
}
