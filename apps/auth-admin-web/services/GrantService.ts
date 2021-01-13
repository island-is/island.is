import { GrantType } from '../entities/models/grant-type.model'
import { BaseService } from './BaseService'

export class GrantService extends BaseService {
  /** Get's all Grant Types  */
  static async findAll(): Promise<GrantType[] | null> {
    return BaseService.GET(`grants`)
  }
}
