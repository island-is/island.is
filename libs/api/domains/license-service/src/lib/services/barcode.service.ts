import { LicenseVerifyExtraDataResult } from '@island.is/clients/license-client'
import { ConfigType } from '@island.is/nest/config'
import { LicenseType } from '@island.is/shared/constants'
import { Inject, Injectable } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager/dist/caching'
import { sign, SignOptions, verify } from 'jsonwebtoken'
import { LicenseServiceConfig } from '../licenseService.config'
import { LICENSE_SERVICE_CACHE_MANAGER_PROVIDER } from '../licenseService.constants'

const BARCODE_EXPIRE_TIME_IN_SEC = 5000

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
   * Code (Reference to redis record with license data)
   */
  c: string
}

type BarcodeCacheData<Type extends LicenseType> = {
  nationalId: string
  licenseType: LicenseType
  extraData: LicenseVerifyExtraDataResult<Type>
}

@Injectable()
export class BarcodeService {
  constructor(
    @Inject(LicenseServiceConfig.KEY)
    private readonly config: ConfigType<typeof LicenseServiceConfig>,
    @Inject(LICENSE_SERVICE_CACHE_MANAGER_PROVIDER)
    private readonly cacheManager: CacheManager,
  ) {}

  async verifyToken(token: string): Promise<LicenseTokenData> {
    return new Promise((resolve, reject) =>
      verify(token, this.config.barcodeSecretKey, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            throw new Error('Token expired')
          } else if (err.name === 'JsonWebTokenError') {
            throw new Error('Token malformed')
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

  validateStrAsJwt(token: string): boolean {
    // JWT token consists of three parts separated by dots
    const tokenParts = token.split('.')

    // A valid JWT token should have exactly 3 parts
    if (tokenParts.length !== 3) return false

    // Each part should be non-empty
    return !tokenParts.some((part) => !part)
  }

  async setCache<Type extends LicenseType>(
    key: string,
    value: BarcodeCacheData<Type>,
  ) {
    const redisPromise = this.cacheManager.set(
      key,
      value,
      BARCODE_EXPIRE_TIME_IN_SEC * 1000,
    )
  }

  async getCache<Type extends LicenseType>(
    key: string,
  ): Promise<BarcodeCacheData<Type> | undefined> {
    return this.cacheManager.get(key)
  }
}
