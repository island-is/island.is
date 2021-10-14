import { Injectable } from '@nestjs/common'
import { ApiV1 } from '../v1'
import { ApiV2 } from '../v2'

@Injectable()
export class DrivingLicenseApi {
  constructor(private readonly v1: ApiV1, private readonly v2: ApiV2) {}
}
