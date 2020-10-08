import { Injectable } from '@nestjs/common';
import { UserProfileApi } from '../../gen/fetch';
import { UserProfile } from './userProfile.model';


@Injectable()
export class UserProfileService {
  constructor(private userProfileApi: UserProfileApi) { }

  async getUser(nationalId: string): Promise<UserProfile | null> {
    return await this.userProfileApi.userProfileControllerFindOneByNationalId({ nationalId })
  }
}
