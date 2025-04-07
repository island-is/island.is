import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { randomInt } from 'crypto'
import addMilliseconds from 'date-fns/addMilliseconds'
import { parsePhoneNumber } from 'libphonenumber-js'
import { join } from 'path'
import { Transaction } from 'sequelize'

import { EmailService } from '@island.is/email-service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { SmsService } from '@island.is/nova-sms'

import { ConfirmEmailDto } from './dto/confirmEmailDto'
import { ConfirmSmsDto } from './dto/confirmSmsDto'
import { ConfirmationDtoResponse } from './dto/confirmationResponseDto'
import { CreateSmsVerificationDto } from './dto/createSmsVerificationDto'
import { EmailVerification } from './models/emailVerification.model'
import { SmsVerification } from './models/smsVerification.model'
import { UserProfileConfig } from '../../config'
import type { ConfigType } from '@island.is/nest/config'

/** Category to attach each log message to */
const LOG_CATEGORY = 'verification-service'

export const SMS_VERIFICATION_MAX_AGE = 5 * 60 * 1000
export const SMS_VERIFICATION_MAX_TRIES = 5
export const EMAIL_VERIFICATION_MAX_TRIES = 5

/**
 *- email verification procedure
 *- New user
 *- User confirms before User profile Creation
 *- Create email confirmation
 *- Confirm Directly with emailCode
 *- On profile creation check for confirmation and mark email as verified
 *- Update user
 *- Create email confirmation
 *- Confirm Directly with code
 *- update email check db for confirmation save email as verified


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
    private readonly smsService: SmsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(UserProfileConfig.KEY)
    private config: ConfigType<typeof UserProfileConfig>,
  ) {}

  async createEmailVerification(
    nationalId: string,
    email: string,
    codeLength: 3 | 6 = 6,
  ): Promise<EmailVerification | null> {
    const emailCode = this.generateVerificationCode(codeLength)

    const [record] = await this.emailVerificationModel.upsert(
      { nationalId, email, hash: emailCode, created: new Date(), tries: 0 },
      {
        returning: true,
      },
    )

    if (record) {
      this.sendConfirmationEmail(record)
    }

    return record
  }

  async createSmsVerification(
    createSmsVerification: CreateSmsVerificationDto,
    codeLength: 3 | 6 = 6,
  ): Promise<SmsVerification | null> {
    const code = this.generateVerificationCode(codeLength)
    const verification = {
      ...createSmsVerification,
      tries: 0,
      smsCode: code,
      created: new Date(),
    }

    const [record] = await this.smsVerificationModel.upsert(verification, {
      returning: true,
    })
    if (record) {
      this.sendConfirmationSms(record)
    }

    return record
  }

  async confirmEmail(
    confirmEmailDto: ConfirmEmailDto,
    nationalId: string,
    options?: { transaction?: Transaction; maxTries?: number },
  ): Promise<ConfirmationDtoResponse> {
    const { transaction, maxTries = EMAIL_VERIFICATION_MAX_TRIES } =
      options ?? {}

    let verification = await this.emailVerificationModel.findOne({
      ...(transaction && { transaction }),
      where: { nationalId, email: confirmEmailDto.email },
      order: [['created', 'DESC']],
    })

    if (!verification) {
      return {
        message: `Email verification code does not match.`,
        confirmed: false,
      }
    }

    const expiration = addMilliseconds(
      verification.created,
      SMS_VERIFICATION_MAX_AGE,
    )
    if (expiration < new Date()) {
      return {
        message: 'Email verification is expired',
        confirmed: false,
      }
    }

    if (verification.tries >= maxTries) {
      return {
        message:
          'Too many failed email verifications. Please restart verification.',
        confirmed: false,
        remainingAttempts: -1,
      }
    }

    if (confirmEmailDto.hash !== verification.hash) {
      verification = await verification.increment('tries')
      const remaining = maxTries - verification.tries
      return {
        message: 'Email verification code does not match.',
        confirmed: false,
        remainingAttempts: remaining,
      }
    }

    try {
      await this.emailVerificationModel.update(
        { confirmed: true },
        {
          ...(transaction && { transaction }),
          where: { nationalId },
          returning: true,
        },
      )
    } catch (e) {
      this.logger.error('Unable to update email verification', {
        error: JSON.stringify(e),
        category: LOG_CATEGORY,
      })
      return {
        message: 'Unable to update email verification',
        confirmed: false,
      }
    }

    try {
      await this.removeEmailVerification(nationalId, transaction)
    } catch (e) {
      this.logger.error('Email verification removal error', {
        error: JSON.stringify(e),
        category: LOG_CATEGORY,
      })
    }
    return {
      message: 'Email confirmed',
      confirmed: true,
    }
  }

  async confirmSms(
    confirmSmsDto: ConfirmSmsDto,
    nationalId: string,
    options?: { transaction?: Transaction; maxTries?: number },
  ): Promise<ConfirmationDtoResponse> {
    const { transaction, maxTries = SMS_VERIFICATION_MAX_TRIES } = options ?? {}

    const phoneNumber = parsePhoneNumber(confirmSmsDto.mobilePhoneNumber, 'IS')
    const mobilePhoneNumber =
      phoneNumber.country === 'IS'
        ? (phoneNumber.nationalNumber as string)
        : confirmSmsDto.mobilePhoneNumber

    let verification = await this.smsVerificationModel.findOne({
      where: { nationalId, mobilePhoneNumber },
      order: [['created', 'DESC']],
      ...(transaction && { transaction }),
    })

    if (!verification) {
      return {
        message: `SMS verification does not exist for this user`,
        confirmed: false,
      }
    }

    const expiration = addMilliseconds(
      verification.created,
      SMS_VERIFICATION_MAX_AGE,
    )
    if (expiration < new Date()) {
      return {
        message: 'SMS verification is expired',
        confirmed: false,
      }
    }

    if (verification.tries >= maxTries) {
      return {
        message:
          'Too many failed SMS verifications. Please restart verification.',
        confirmed: false,
        remainingAttempts: -1,
      }
    }

    if (confirmSmsDto.code !== verification.smsCode) {
      verification = await verification.increment('tries')
      const remaining = maxTries - verification.tries
      return {
        message: `SMS code is not a match. ${remaining} tries remaining.`,
        confirmed: false,
        remainingAttempts: remaining,
      }
    }

    try {
      await this.smsVerificationModel.update(
        { confirmed: true },
        {
          ...(transaction && { transaction }),
          where: { nationalId },
          returning: true,
        },
      )
    } catch (e) {
      this.logger.error('Unable to update sms verification', {
        error: JSON.stringify(e),
        category: LOG_CATEGORY,
      })
      return {
        message: 'Unable to update sms verification',
        confirmed: false,
      }
    }

    try {
      await this.removeSmsVerification(nationalId, transaction)
    } catch (e) {
      this.logger.error('SMS verification removal error', {
        error: JSON.stringify(e),
        category: LOG_CATEGORY,
      })
    }

    return {
      message: 'SMS confirmed',
      confirmed: true,
    }
  }

  async sendConfirmationEmail(verification: EmailVerification) {
    try {
      await this.emailService.sendEmail({
        from: {
          name: this.config.email.fromName,
          address: this.config.email.fromEmail,
        },
        to: [
          {
            name: '',
            address: verification.email,
          },
        ],
        subject: `Staðfesting á netfangi á Ísland.is`,
        template: {
          title: 'Staðfesting á netfangi',
          body: [
            {
              component: 'Image',
              context: {
                src: join(__dirname, `./assets/images/logois.jpg`),
                alt: 'Ísland.is logo',
              },
            },
            {
              component: 'Heading',
              context: {
                copy: 'Staðfesting á netfangi',
                small: true,
              },
            },
            {
              component: 'Heading',
              context: {
                copy: '',
                small: true,
                eyebrow: 'Email confirmation',
              },
            },
            {
              component: 'Copy',
              context: { copy: 'Öryggiskóði / Security code', small: true },
            },
            {
              component: 'Heading',
              context: { copy: verification.hash },
            },
            {
              component: 'Copy',
              context: {
                copy: 'Þetta er öryggiskóði til staðfestingar á netfangi, hann eyðist sjálfkrafa eftir 5 mínútur. Vinsamlegast hunsaðu póstinn ef þú varst ekki að skrá netfangið þitt á Mínum síðum.',
              },
            },
            {
              component: 'Copy',
              context: {
                small: true,
                copy: 'This is your security code to verify your email address, it will be deleted automatically after 5 minutes. Please ignore this email if you did not enter your email address on My pages.',
              },
            },
          ],
        },
      })
    } catch (exception) {
      this.logger.error(exception)
    }
  }

  async sendConfirmationSms(verification: SmsVerification) {
    try {
      const response = await this.smsService.sendSms(
        verification.mobilePhoneNumber,
        `Staðfestingarkóði fyrir Mínar síður : ${verification.smsCode}`,
      )
      return response
    } catch (exception) {
      this.logger.error(exception)
    }
  }

  async removeSmsVerification(nationalId: string, transaction?: Transaction) {
    await this.smsVerificationModel.destroy({
      where: { nationalId },
      ...(transaction && { transaction }),
    })
  }

  async removeEmailVerification(nationalId: string, transaction?: Transaction) {
    await this.emailVerificationModel.destroy({
      where: { nationalId },
      ...(transaction && { transaction }),
    })
  }

  private generateVerificationCode(length: number): string {
    return randomInt(0, Number('9'.repeat(length)))
      .toString()
      .padStart(length, '0')
  }
}
