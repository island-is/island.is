import { BaseService } from './BaseService';

export class UserService extends BaseService {
  static async findUser(searhString: string) {
    return BaseService.GET(`user-identities/${searhString}`);
  }

  static async toggleActive(subjectId: string, active: boolean) {
    return BaseService.PATCH(`user-identities/${subjectId}`, {
      active: active,
    });
  }
}
