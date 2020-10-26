import { Logger, LOGGER_PROVIDER } from '@island.is/logging';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EmailVerification } from './email-verification.model';
import * as CryptoJS from 'crypto-js'
import { ConfirmEmailDto } from './dto/confirmEmailDto';
import { UserProfile } from '../user-profile/userProfile.model';
import { UserProfileService } from '../user-profile/userProfile.service';
import { SmsVerification } from './sms-verification.model';
import { ConfirmSmsDto } from './dto/confirmSmsDto';
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto';
import { CreateUserProfileDto } from '../user-profile/dto/createUserProfileDto';
/**
  *- Email verification procedure
    *- New User
      *- Create User
      *- Create Email verification
      *- Send Email verification
    *- Update User
      *- Is email being Updated
      *- Create Email Verification
      *- Send Email verification
    *- Confirmation
      *- Does hash match
      *- Remove Email verifation from db
      *- Mark email as confirmed in UserProfile

  *- SMS verification procedure
    *- New user
      *- User confirms before User profile Creation
      *- Create sms confirmation
      *- Confirm Directly with smsCode
      *- On profile creation check for confirmation and mark phone as verified
    *- Update user
      *- Create sms confirmation
      *- Confirm Directly with code
      *- update Phonenumber check db for confirmation save phone as verified
 */
@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(EmailVerification)
    private emailVerificationModel: typeof EmailVerification,
    @InjectModel(SmsVerification)
    private smsVerificationModel: typeof SmsVerification,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly userProfileService: UserProfileService
  ) { }

  async createEmailVerification(nationalId: string, email: string)
    : Promise<EmailVerification | null> {
    const hash = CryptoJS.MD5(nationalId + email);

    const hashString = hash.toString(CryptoJS.enc.Hex)
    const verification = { ...{ nationalId, email }, hash: hashString }

    const [record, created] = await this.emailVerificationModel.upsert(
      verification,
      { returning: true }
    )
    if (created) {
      const messsageId = this.sendConfirmationEmail(record)
    }

    return record
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto, userProfile: UserProfile) {
    const { nationalId } = userProfile

    const verification = await this.emailVerificationModel.findOne({
      where: { nationalId },
    })

    if (confirmEmailDto.hash !== verification.hash) {
      throw new NotFoundException(`Email verification with hash ${confirmEmailDto.hash} does not exitst`)
    }
    //email confirmed
    const {
      numberOfAffectedRows
    } = await this.userProfileService.update(nationalId, { emailVerified: true })
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `A user profile with nationalId ${nationalId} does not exist`,
      )
    }
    await this.removeEmailVerification(nationalId)
  }

  async sendConfirmationEmail(verification: EmailVerification) {
    return ""
  }

  async removeSmsVerification(nationalId: string) {
    await this.smsVerificationModel.destroy({
      where: { nationalId }
    })
  }

  async removeEmailVerification(nationalId: string) {
    await this.emailVerificationModel.destroy({
      where: { nationalId }
    })
  }

  async createSmsVerification(createSmsVerification: CreateSmsVerificationDto)
    : Promise<SmsVerification | null> {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const verification = { ...createSmsVerification, smsCode: code }
    console.log(verification)
    const [record, created] = await this.smsVerificationModel.upsert(
      verification,
      { returning: true }
    )
    if (created) {
      const messsageId = this.sendConfirmationSms(record)
    }

    return record
  }

  async confirmSms(confirmSmsDto: ConfirmSmsDto, nationalId: string) {

    const verification = await this.smsVerificationModel.findOne({
      where: { nationalId },
    })

    if (confirmSmsDto.code !== verification.smsCode) {
      throw new BadRequestException(`SMS Code is not a match`)
    }
    //sms confirmed
    const [
      numberOfAffectedRows,
      [updatedSmsVerification],
    ] = await this.smsVerificationModel.update({ confirmed: true }, {
      where: { nationalId },
      returning: true,
    })
  }

  async isPhoneNumberVerified(createUserProfileDto: CreateUserProfileDto): Promise<boolean> {
    const { nationalId, mobilePhoneNumber } = createUserProfileDto
    const verification = await this.smsVerificationModel.findOne({
      where: { nationalId },
    })
    if (!verification) return false
    return verification.confirmed && verification.mobilePhoneNumber === mobilePhoneNumber
  }

  async sendConfirmationSms(verification: SmsVerification) {
    return ""
  }
}
