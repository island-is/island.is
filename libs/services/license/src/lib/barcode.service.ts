import {
  LicenseType,
  LicenseVerifyExtraDataResult,
} from '@island.is/clients/license-client'
import { ConfigType } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { Cache as CacheManager, Milliseconds } from 'cache-manager'
import { sign, VerifyOptions, verify } from 'jsonwebtoken'
import { LICENSE_SERVICE_CACHE_MANAGER_PROVIDER } from './licenseCache.provider'
import { LicenseConfig } from './license.config'

export const TOKEN_EXPIRED_ERROR = 'TokenExpiredError'
export const BARCODE_ACTIVE_SESSION_KEY = 'activeSession'

/**
 * License token data used to generate a license token
 * The reason for the one letter fields is to keep the token as small as possible, since it will be used to generate barcodes
 */
export type LicenseTokenData = {
  /**
   * Version
   */
  v: string
  /**
   * License type
   */
  t: LicenseType
  /**
   * Code (Reference to redis record with license data)
   */
  c: string
}

export type BarcodeData<Type extends LicenseType> = {
  nationalId: string
  licenseType: Type
  extraData: LicenseVerifyExtraDataResult<Type>
}

@Injectable()
export class BarcodeService {
  constructor(
    @Inject(LicenseConfig.KEY)
    private readonly config: ConfigType<typeof LicenseConfig>,
    @Inject(LICENSE_SERVICE_CACHE_MANAGER_PROVIDER)
    private readonly cacheManager: CacheManager,
  ) {}

  async verifyToken(
    token: string,
    options?: VerifyOptions,
  ): Promise<LicenseTokenData> {
    return new Promise((resolve, reject) =>
      verify(token, this.config.barcodeSecretKey, options, (err, decoded) => {
        if (err) {
          return reject(err)
        }

        return resolve((decoded as { data: LicenseTokenData }).data)
      }),
    )
  }

  async createToken(data: LicenseTokenData): Promise<{
    token: string
    expiresIn: number
  }> {
    // jsonwebtoken uses seconds for expiration time
    const exp =
      Math.floor(Date.now() / 1000) + this.config.barcodeExpireTimeInSec

    return new Promise((resolve, reject) =>
      sign(
        {
          data,
          exp,
        },
        this.config.barcodeSecretKey,
        {},
        (err, encoded) => {
          if (err || !encoded) {
            return reject(err)
          }

          return resolve({
            token: encoded,
            expiresIn: this.config.barcodeExpireTimeInSec,
          })
        },
      ),
    )
  }

  async setCache<Type extends LicenseType>(
    key: string,
    value: BarcodeData<Type>,
  ) {
    return this.cacheManager.set(
      key,
      value,
      this.config.barcodeExpireTimeInSec * 1000,
    )
  }

  async setSessionCache(key: string, value: string) {
    return this.cacheManager.set(
      `${BARCODE_ACTIVE_SESSION_KEY}:${key}`,
      value,
      this.config.barcodeSessionExpireTimeInSec * 1000,
    )
  }

  async getSessionCache(key: string): Promise<string | undefined> {
    return this.cacheManager.get(`${BARCODE_ACTIVE_SESSION_KEY}:${key}`)
  }

  async getCache<Type extends LicenseType>(
    key: string,
  ): Promise<BarcodeData<Type> | undefined> {
    return this.cacheManager.get(key)
  }
}
