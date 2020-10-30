import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { EmailVerification } from './email-verification.model'
import * as CryptoJS from 'crypto-js'
import { ConfirmEmailDto } from './dto/confirmEmailDto'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileService } from '../user-profile/userProfile.service'
import { SmsVerification } from './sms-verification.model'
import { CreateUserProfileDto } from '../user-profile/dto/createUserProfileDto'
import { SmsService } from '@island.is/nova-sms'
import { EmailService } from '@island.is/email-service'
import environment from '../../environments/environment'
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto'
import { ConfirmSmsDto } from './dto/confirmSmsDto'
import { ConfirmationDtoResponse } from './dto/confirmationResponseDto'
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
    private readonly userProfileService: UserProfileService,
    private readonly smsService: SmsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  async createEmailVerification(
    nationalId: string,
    email: string,
  ): Promise<EmailVerification | null> {
    const hash = CryptoJS.MD5(nationalId + email)
    const hashString = hash.toString(CryptoJS.enc.Hex)

    const [record] = await this.emailVerificationModel.upsert(
      { nationalId, email, hash: hashString },
      {
        returning: true,
      },
    )
    if (record) {
      this.sendConfirmationEmail(record)
    }

    return record
  }

  async confirmEmail(
    confirmEmailDto: ConfirmEmailDto,
    userProfile: UserProfile,
  ): Promise<ConfirmationDtoResponse> {
    const { nationalId } = userProfile

    const verification = await this.emailVerificationModel.findOne({
      where: { nationalId },
    })

    if (!verification) {
      return {
        message: `Email verification does not exist for this user`,
        confirmed: false,
      }
    }

    if (confirmEmailDto.hash !== verification.hash) {
      return {
        message: `Email verification with hash ${confirmEmailDto.hash} does not exist`,
        confirmed: false,
      }
    }

    await this.userProfileService.update(nationalId, {
      emailVerified: true,
    })

    await this.removeEmailVerification(nationalId)

    return {
      message: 'Email confirmed',
      confirmed: true,
    }
  }

  async sendConfirmationEmail(verification: EmailVerification) {
    await this.emailService.sendEmail({
      from: {
        name: environment.email.fromName,
        address: environment.email.fromEmail,
      },
      to: [
        {
          name: '',
          address: verification.email,
        },
      ],
      subject: `Staðfestingarpóstur`,
      html: `Opnaðu þennann hlekk til þess að staðfesta netfangið ${verification.email}
      <a href="${environment.email.servicePortalBaseUrl}/stillingar/minn-adgangur/stadfesta-netfang/${verification.hash}" target="_blank"/>Staðfesta</a>`,
    })
  }

  async removeSmsVerification(nationalId: string) {
    await this.smsVerificationModel.destroy({
      where: { nationalId },
    })
  }

  async removeEmailVerification(nationalId: string) {
    await this.emailVerificationModel.destroy({
      where: { nationalId },
    })
  }

  async createSmsVerification(
    createSmsVerification: CreateSmsVerificationDto,
  ): Promise<SmsVerification | null> {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const verification = { ...createSmsVerification, smsCode: code }

    const [record] = await this.smsVerificationModel.upsert(verification, {
      returning: true,
    })
    if (record) {
      this.sendConfirmationSms(record)
    }

    return record
  }

  async confirmSms(
    confirmSmsDto: ConfirmSmsDto,
    nationalId: string,
  ): Promise<ConfirmationDtoResponse> {
    const verification = await this.smsVerificationModel.findOne({
      where: { nationalId },
    })

    if (!verification) {
      return {
        message: `Sms verification does not exist for this user`,
        confirmed: false,
      }
    }

    if (confirmSmsDto.code !== verification.smsCode) {
      return {
        message: 'SMS code is not a match',
        confirmed: false,
      }
    }

    await this.smsVerificationModel.update(
      { confirmed: true },
      {
        where: { nationalId },
        returning: true,
      },
    )
    return {
      message: 'SMS confirmed',
      confirmed: true,
    }
  }

  async isPhoneNumberVerified(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<boolean> {
    const { nationalId, mobilePhoneNumber } = createUserProfileDto
    const verification = await this.smsVerificationModel.findOne({
      where: { nationalId },
    })
    if (!verification) return false
    return (
      verification.confirmed &&
      verification.mobilePhoneNumber === mobilePhoneNumber
    )
  }

  async sendConfirmationSms(verification: SmsVerification) {
    const response = await this.smsService.sendSms(
      verification.mobilePhoneNumber,
      `Staðfestingarkóði fyrir Mínar síður : ${verification.smsCode}`,
    )

    return response
  }
}
