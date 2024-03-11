import {
  LicenseType,
  LicenseVerifyExtraDataResult,
} from '@island.is/clients/license-client'
import { ConfigType } from '@nestjs/config'
import { Inject, Injectable } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'
import { sign, SignOptions, verify } from 'jsonwebtoken'
import { LICENSE_SERVICE_CACHE_MANAGER_PROVIDER } from './licenseCache.provider'
import { LicenseConfig } from './license.config'

const BARCODE_EXPIRE_TIME_IN_SEC = 60

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
  t: string
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

  public tokenExpiredError = 'TokenExpiredError'

  async verifyToken(token: string): Promise<LicenseTokenData> {
    return new Promise((resolve, reject) =>
      verify(token, this.config.barcodeSecretKey, (err, decoded) => {
        if (err) {
          if (err.name === this.tokenExpiredError) {
            throw new Error(this.tokenExpiredError)
          }

          return reject(err)
        }

        return resolve(decoded as LicenseTokenData)
      }),
    )
  }

  async createToken(
    data: LicenseTokenData,
    options: SignOptions = { expiresIn: BARCODE_EXPIRE_TIME_IN_SEC },
  ): Promise<string> {
    return new Promise((resolve, reject) =>
      sign(data, this.config.barcodeSecretKey, options, (err, encoded) => {
        if (err || !encoded) {
          return reject(err)
        }

        return resolve(encoded)
      }),
    )
  }

  async setCache<Type extends LicenseType>(
    key: string,
    value: BarcodeData<Type>,
  ) {
    return this.cacheManager.set(key, value, BARCODE_EXPIRE_TIME_IN_SEC * 1000)
  }

  async getCache<Type extends LicenseType>(
    key: string,
  ): Promise<BarcodeData<Type> | undefined> {
    return this.cacheManager.get(key)
  }
}
