import { Logger, LOGGER_PROVIDER } from '@island.is/logging';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EmailVerification } from './email-verification.model';
import CryptoJS from 'crypto-js'
import { ConfirmEmailDto } from './dto/confirmEmailDto';
import { UserProfile } from '../user-profile/userProfile.model';
import { UserProfileService } from '../user-profile/userProfile.service';
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

    const messsageId = this.sendConfirmationEmail()
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
    await this.emailVerificationModel.destroy({
      where: {
        id: verification.id
      }
    })
  }

  async sendConfirmationEmail() {
    return ""
  }
}
