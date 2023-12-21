import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'

import { User } from '@island.is/auth-nest-tools'

import { CreateLoginRestrictionDto } from './dto/create-login-restriction.dto'
import { LoginRestriction } from './login-restriction.model'
import { LoginRestrictionDto } from './dto/login-restriction.dto'

@Injectable()
export class LoginRestrictionsService {
  constructor(
    @InjectModel(LoginRestriction)
    private readonly loginRestrictionModel: typeof LoginRestriction,
  ) {}

  async create(
    user: User,
    input: CreateLoginRestrictionDto,
  ): Promise<LoginRestrictionDto> {
    // User must be logged in with audkenni_sim for audkenniSimNumber to be set.
    // We only allow creating login restrictions for users with audkenni_sim as it is
    // the only way to verify that the user has access to the phone number.
    if (!user.audkenniSimNumber) {
      throw new BadRequestException(
        'Missing audkenniSimNumber claim in access token',
      )
    }

    const currentDate = startOfDay(new Date())
    const inputUntilDate = startOfDay(input.until)

    // Restriction must be at least 1 day in the future.
    if (inputUntilDate <= currentDate) {
      throw new BadRequestException(
        'Login restriction until date must be in the future',
      )
    }

    const [loginRestriction] = await this.loginRestrictionModel.upsert({
      nationalId: user.nationalId,
      phoneNumber: user.audkenniSimNumber.replace('-', ''),
      restrictedUntil: inputUntilDate,
    })

    return loginRestriction
  }

  async findAll({ nationalId }: User): Promise<LoginRestrictionDto[]> {
    // Currently user only has a single login restriction.
    // But to match better api routes and hopefully future proofing LoginRestrictions we return an array.
    const currentRestriction = await this.loginRestrictionModel.findByPk(
      nationalId,
    )
    return currentRestriction ? [currentRestriction.toDto()] : []
  }

  async delete({ nationalId }: User): Promise<void> {
    await this.loginRestrictionModel.destroy({ where: { nationalId } })
  }
}
