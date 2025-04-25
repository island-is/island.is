import { InjectModel } from '@nestjs/sequelize'
import kennitala from 'kennitala'
import { Emails } from './models/emails.model'
import { BadRequestException, Injectable } from '@nestjs/common'
import { EmailsDto } from './dto/emails.dto'
import { VerificationService } from '../user-profile/verification.service'
import { EmailStatus } from 'aws-sdk/clients/chime'
import { AttemptFailed } from '@island.is/nest/problem'
import { DataStatus } from '../user-profile/types/dataStatusTypes'
import { uuid } from 'uuidv4'

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(Emails)
    private emailsModel: typeof Emails,
    private readonly verificationService: VerificationService,
  ) {}

  async findAllByNationalId(nationalId: string): Promise<EmailsDto[]> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('Invalid nationalId')
    }

    return this.emailsModel
      .findAll({
        where: {
          nationalId,
        },
      })
      .then((res) => {
        return (
          res?.map(
            (email) =>
              ({
                id: email.id,
                email: email.email,
                primary: email.primary,
                emailStatus: email.emailStatus,
              } as EmailsDto),
          ) ?? []
        )
      })
  }

  async createEmail(
    nationalId: string,
    email: string,
    code: string,
  ): Promise<EmailsDto> {
    // Validate inputs
    if (!nationalId || !email || !code) {
      throw new BadRequestException('Missing required fields')
    }

    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('Invalid nationalId')
    }

    // Verify the code first
    const { confirmed, message, remainingAttempts } =
      await this.verificationService.confirmEmail(
        { email, hash: code },
        nationalId,
      )

    if (!confirmed) {
      // Check if we should throw a BadRequest or an AttemptFailed error
      if (remainingAttempts && remainingAttempts >= 0) {
        throw new AttemptFailed(remainingAttempts, {
          emailVerificationCode: 'Verification code does not match.',
        })
      } else {
        throw new BadRequestException(message)
      }
    }

    // Check if email already exists for this user
    const existingEmail = await this.emailsModel.findOne({
      where: {
        nationalId,
        email,
      },
    })

    if (existingEmail) {
      throw new BadRequestException('Email already exists for this user')
    }

    const emailRecord = await this.emailsModel.create({
      id: uuid(),
      email,
      primary: false,
      nationalId,
      emailStatus: DataStatus.VERIFIED,
    })

    return {
      id: emailRecord.id,
      email: emailRecord.email ?? null,
      primary: emailRecord.primary,
      emailStatus: emailRecord.emailStatus,
    }
  }
}
