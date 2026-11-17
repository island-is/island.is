import * as Application from 'expo-application'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import Keychain from 'react-native-keychain'
import { getClientId, getConfig } from '../../config'
import { createIasClient } from './client'
import { deviceKeysIasDevice } from './device'
import { createMockIasClient } from './mock'
import type { IasClient, IasStorage, StoredAttestation } from './types'

const KEYCHAIN_SERVICE = 'is.island.ias-attestation'

const keychainStorage: IasStorage = {
  async getAttestation() {
    const item = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    })
    return item ? (JSON.parse(item.password) as StoredAttestation) : null
  },
  async setAttestation(attestation) {
    await Keychain.setGenericPassword(
      'attestation',
      JSON.stringify(attestation),
      {
        service: KEYCHAIN_SERVICE,
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      },
    )
  },
}

/** The IAS for native login, which testing builds can point elsewhere. */
export function getIasIssuer() {
  const { iasIssuer, idsIssuer } = getConfig()
  return iasIssuer ?? idsIssuer
}

/** Native login tokens are DPoP-bound to the install key; browser ones aren't. */
export function isNativeLogin(tokens: { tokenType?: string } | undefined) {
  return tokens?.tokenType === 'DPoP'
}

let current: { key: string; client: IasClient } | undefined

/** The client for the selected environment. */
export function getIasClient(): IasClient {
  const { id, idsScopes } = getConfig()
  const issuer = getIasIssuer()
  const clientId = getClientId()
  const key = `${id} ${issuer} ${clientId}`
  if (current?.key !== key) {
    current = {
      key,
      client:
        id === 'mock'
          ? createMockIasClient()
          : createIasClient({
              issuer,
              clientId,
              scopes: idsScopes,
              // IAS tidies up the model name itself.
              deviceDetails: {
                appVersion: Application.nativeApplicationVersion ?? undefined,
                osVersion: Device.osVersion ?? undefined,
                deviceModel:
                  (Platform.OS === 'ios' ? Device.modelId : Device.modelName) ??
                  undefined,
              },
              device: deviceKeysIasDevice,
              storage: keychainStorage,
            }),
    }
  }
  return current.client
}
