import { Claim } from '../entities/models/claim.model';
import { BaseService } from './BaseService';

export class ClaimService extends BaseService {
  /** Gets a client by it's id */
  static async findAll(): Promise<Claim[] | null> {
    return BaseService.GET(`claims`);
  }
}
