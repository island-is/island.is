/* eslint-disable  @typescript-eslint/no-explicit-any */
import { BaseService } from './BaseService'

export class TranslationService extends BaseService {
  /** Get's all Api resources and total count of rows */
  static async findAndCountAllTranslations(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{
    rows: any[]
    count: number
  } | null> {
    return BaseService.GET(
      `translation/translation?searchString=${searchString}&page=${page}&count=${count}`,
    )
  }
}
