import { Injectable } from '@nestjs/common'

@Injectable()
export class TranslationsService {
  constructor() { }

  private translate(key: string): string {
    return `${key} localized string`;
  }

  public t(key: string) {
    return this.translate(key)
  }
}
