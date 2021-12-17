import { Injectable } from '@nestjs/common'

@Injectable()
export class GeneralFishingLicenseService {
  async sendApplication() {
    // Pretend to be doing stuff for a short while
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}
