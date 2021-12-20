import { Args, Directive, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetHomestaysInput } from './dto/getHomestays.input'
import { Homestay } from './models/homestay'
import { SyslumennAuction } from './models/syslumennAuction'
import { SyslumennService } from './syslumenn.service'
import { OperatingLicense } from './models/operatingLicense'
import { UploadDataInput } from './dto/uploadData.input'
import { CertificateInfoInput } from './dto/certificateInfo.input'
import { DataUploadResponse } from './models/dataUpload'
import {CertificateInfoRepsonse} from './models/certificateInfo'
import { DistrictCommissionersAgenciesRepsonse } from './models/districtCommissionersAgencies'

const cacheTime = process.env.CACHE_TIME || 300

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`
@Resolver()
export class SyslumennResolver {
  constructor(private syslumennService: SyslumennService) {}

  @Directive(cacheControlDirective())
  @Query(() => [Homestay])
  getHomestays(@Args('input') input: GetHomestaysInput): Promise<Homestay[]> {
    return this.syslumennService.getHomestays(input.year)
  }

  // Note: We don't cache the Auction data, as it's prone to changes only minutes before the auction takes place.
  @Query(() => [SyslumennAuction])
  getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    return this.syslumennService.getSyslumennAuctions()
  }

  @Directive(cacheControlDirective())
  @Query(() => [OperatingLicense])
  getOperatingLicenses(): Promise<OperatingLicense[]> {
    return this.syslumennService.getOperatingLicenses()
  }

  @Mutation(() => DataUploadResponse)
  postSyslumennUploadData(
    @Args('input')
    { persons, attachment, uploadDataName, uploadDataId, extraData }: UploadDataInput,
  ): Promise<DataUploadResponse> {
    return this.syslumennService.uploadData(
      persons,
      attachment,
      extraData ? { StarfsstodID: extraData?.content }: {},
      uploadDataName,
      uploadDataId
    )
  }

  @Query(() => CertificateInfoRepsonse)
  getSyslumennCertificateInfo(
    @Args('input') input: CertificateInfoInput,
  ): Promise<CertificateInfoRepsonse> {
    return this.syslumennService.getCertificateInfo(input.nationalId)
  }

  @Query(() => [DistrictCommissionersAgenciesRepsonse])
  getSyslumennDistrictCommissionersAgencies(
  ): Promise<DistrictCommissionersAgenciesRepsonse[]> {
    return this.syslumennService.getDistrictCommissionersAgencies()
  }
}
