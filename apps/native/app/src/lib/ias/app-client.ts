import * as Application from 'expo-application'
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

/**
 * IAS's feature flag compares semver, which doesn't allow the leading zeros
 * in yy.mm.dd versions: 26.11.06 → 26.11.6.
 */
export function toSemver(version: string) {
  const parts = version
    .split('.')
    .slice(0, 3)
    .map((part) => String(parseInt(part, 10) || 0))
  while (parts.length < 3) {
    parts.push('0')
  }
  return parts.join('.')
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
              appVersion: toSemver(
                Application.nativeApplicationVersion ?? '0.0.0',
              ),
              device: deviceKeysIasDevice,
              storage: keychainStorage,
              onAttestationRequest: __DEV__
                ? (body) => {
                    console.log(
                      '[ias] POST /app/attestation',
                      JSON.stringify(body),
                    )
                  }
                : undefined,
              onAttestationRenewed: __DEV__
                ? () => {
                    console.log('[ias] Renewed the attestation')
                  }
                : undefined,
            }),
    }
  }
  return current.client
}
