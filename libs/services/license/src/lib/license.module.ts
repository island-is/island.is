import { Module } from '@nestjs/common'
import { BarcodeService } from './barcode.service'
import { LicenseCacheProvider } from './licenseCache.provider'

@Module({
  providers: [BarcodeService, LicenseCacheProvider],
  exports: [BarcodeService],
})
export class LicenseModule {}
