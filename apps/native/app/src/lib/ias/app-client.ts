import * as Application from 'expo-application'
import Keychain from 'react-native-keychain'
import { getConfig } from '../../config'
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

let current: { key: string; client: IasClient } | undefined

/** The client for the selected environment. */
export function getIasClient(): IasClient {
  const { id, idsIssuer, iasIssuer, idsClientId, idsScopes } = getConfig()
  const issuer = iasIssuer ?? idsIssuer
  const key = `${id} ${issuer} ${idsClientId}`
  if (current?.key !== key) {
    current = {
      key,
      client:
        id === 'mock'
          ? createMockIasClient()
          : createIasClient({
              issuer,
              clientId: idsClientId,
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
              onBrowserFallback: (error) => {
                console.warn('[ias] Falling back to the browser login', error)
              },
            }),
    }
  }
  return current.client
}
