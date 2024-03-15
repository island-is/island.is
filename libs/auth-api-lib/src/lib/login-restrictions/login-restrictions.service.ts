import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { User } from '@island.is/auth-nest-tools'

import { CreateLoginRestrictionDto } from './dto/create-login-restriction.dto'
import { LoginRestrictionDto } from './dto/login-restriction.dto'
import { LoginRestriction } from './login-restriction.model'

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

    const phoneNumber = this.validatePhoneNumber(user.audkenniSimNumber)

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
      phoneNumber: phoneNumber,
      until: inputUntilDate,
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

  async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<LoginRestrictionDto | null> {
    const validPhoneNumber = this.validatePhoneNumber(phoneNumber)

    const loginRestriction = await this.loginRestrictionModel.findOne({
      where: {
        phoneNumber: validPhoneNumber,
      },
    })

    return loginRestriction ? loginRestriction.toDto() : null
  }

  async delete({ nationalId }: User): Promise<void> {
    await this.loginRestrictionModel.destroy({ where: { nationalId } })
  }

  /**
   * Validates that the phone number is valid and Icelandic.
   * @param phoneNumber
   * @private
   * @returns The national number of the phone number
   */
  private validatePhoneNumber(phoneNumber: string): string {
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'IS')

    if (
      !phoneNumber ||
      !parsedPhoneNumber?.isValid() ||
      parsedPhoneNumber?.countryCallingCode !== '354'
    ) {
      throw new BadRequestException(
        'Phone number must be provided and valid Icelandic',
      )
    }

    return parsedPhoneNumber.nationalNumber as string
  }
}
