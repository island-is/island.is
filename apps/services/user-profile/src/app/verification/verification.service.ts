import { Logger, LOGGER_PROVIDER } from '@island.is/logging';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEmailVerificationDto } from './dto/createEmailVerificationDto';
import { EmailVerification } from './email-verification.model';
import CryptoJS from 'crypto-js'

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(EmailVerification)
    private emailVerificationModel: typeof EmailVerification,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) { }

  async createEmailVerification(nationalId: string, email: string)
    : Promise<EmailVerification | null> {
    const hash = CryptoJS.MD5();
    const hashString = hash.toString(CryptoJS.enc.Hex)
    const verification = { ...{ nationalId, email }, hash: hashString }
    console.log(verification)
    const [record, created] = await this.emailVerificationModel.upsert(
      verification,
      { returning: true }
    )
    return record
  }



}
