import { Injectable } from '@nestjs/common'

@Injectable()
export class CourtBankruptcyCertService {
  constructor(private readonly api: CrimeCertificateApi) {}

  public async bingo(s: string): Promise<boolean> {
    const scaffold = await this.api.getWhatever({
      nationalId: s,
    })
    return false
  }
}
