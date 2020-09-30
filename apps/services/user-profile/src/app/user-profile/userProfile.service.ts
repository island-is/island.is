import { LOGGER_PROVIDER } from '@island.is/logging';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserProfileDto } from './dto/createUserProfileDto';
import { UserProfile } from './userProfile.model';

@Injectable()
export class UserProfileService {

  constructor(
    @InjectModel(UserProfile)
    private userProfileModel: typeof UserProfile,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) { }

  async findById(id: string): Promise<UserProfile | null> {
    this.logger.debug(`Finding application by id - "${id}"`)
    return this.userProfileModel.findOne({
      where: { id },
    })
  }

  async create(userProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    return this.userProfileModel.create(userProfileDto)
  }

  async findByNationalId(nationalId: string): Promise<UserProfile | null> {
    this.logger.debug(`Finding application by id - "${nationalId}"`)
    return this.userProfileModel.findOne({
      where: { nationalId },
    })
  }
}
