import { AttemptFailed } from '@island.is/nest/problem'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import kennitala from 'kennitala'
import { Sequelize } from 'sequelize-typescript'
import { uuid } from 'uuidv4'
import { DataStatus } from '../user-profile/types/dataStatusTypes'
import { VerificationService } from '../user-profile/verification.service'
import { EmailsDto } from './dto/emails.dto'
import { ActorProfile } from './models/actor-profile.model'
import { Emails } from './models/emails.model'
import { UserProfileService } from './user-profile.service'

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(Emails)
    private readonly emailsModel: typeof Emails,
    @InjectModel(ActorProfile)
    private readonly actorProfileModel: typeof ActorProfile,
    private readonly verificationService: VerificationService,
    private readonly userProfileService: UserProfileService,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Retrieves all emails for a given national ID
   */
  async findAllByNationalId(nationalId: string): Promise<EmailsDto[]> {
    this.validateNationalId(nationalId)

    const emails = await this.emailsModel.findAll({
      where: { nationalId },
    })

    // Get all email IDs that are referenced by actor profiles
    const connectedEmailIds = await this.getConnectedEmailIds(
      emails.map((email) => email.id),
    )

    return (
      emails.map((email) => ({
        id: email.id,
        email: email.email ?? null,
        primary: email.primary,
        emailStatus: email.emailStatus,
        isConnectedToActorProfile: connectedEmailIds.includes(email.id),
      })) || []
    )
  }

  /**
   * Checks which emails are connected to actor profiles
   */
  private async getConnectedEmailIds(emailIds: string[]): Promise<string[]> {
    if (!emailIds.length) {
      return []
    }

    const actorProfiles = await this.actorProfileModel.findAll({
      where: {
        emailsId: emailIds,
      },
    })

    return actorProfiles
      .map((profile) => profile.emailsId)
      .filter((id): id is string => id !== null && id !== undefined)
  }

  /**
   * Creates a new email for a user after verifying the code
   */
  async createEmail(
    nationalId: string,
    email: string,
    code: string,
  ): Promise<EmailsDto> {
    return await this.sequelize.transaction(async (transaction) => {
      this.validateRequiredFields(nationalId, email, code)
      this.validateNationalId(nationalId)

      // Verify the email code
      await this.verifyEmailCode(nationalId, email, code)

      // Check for existing email that is not verified
      await this.checkEmailExists(nationalId, email)

      // Create user profile if it doesn't exist
      const userProfile = await this.userProfileService.findOrCreateUserProfile(
        nationalId,
        transaction,
      )

      if (!userProfile) {
        throw new BadRequestException('User profile not found')
      }

      // Create the email record
      const [emailRecord, created] = await this.emailsModel.findOrCreate({
        where: {
          email,
          nationalId,
        },
        defaults: {
          id: uuid(),
          email,
          primary: false,
          nationalId,
          emailStatus: DataStatus.VERIFIED,
        },
        transaction,
        useMaster: true,
      })

      // If the email is not created, set it as verified
      if (!created) {
        await emailRecord.update({
          emailStatus: DataStatus.VERIFIED,
        })
      }

      // Check if this email is connected to any actor profile
      const connectedEmailIds = await this.getConnectedEmailIds([
        emailRecord.id,
      ])
      const isConnectedToActorProfile = connectedEmailIds.includes(
        emailRecord.id,
      )

      return {
        id: emailRecord.id,
        email: emailRecord.email ?? null,
        primary: emailRecord.primary,
        emailStatus: emailRecord.emailStatus,
        isConnectedToActorProfile,
      }
    })
  }

  /**
   * Deletes an email for a user
   */
  async deleteEmail(nationalId: string, emailId: string): Promise<boolean> {
    this.validateRequiredFields(nationalId, emailId)
    this.validateNationalId(nationalId)

    const emailRecord = await this.findEmailForUser(nationalId, emailId)

    await emailRecord.destroy()

    return true
  }

  /**
   * Helper methods
   */
  private validateNationalId(nationalId: string): void {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('Invalid nationalId')
    }
  }

  private validateRequiredFields(...fields: string[]): void {
    if (fields.some((field) => !field)) {
      throw new BadRequestException('Missing required fields')
    }
  }

  private async verifyEmailCode(
    nationalId: string,
    email: string,
    code: string,
  ): Promise<void> {
    const { confirmed, message, remainingAttempts } =
      await this.verificationService.confirmEmail(
        { email, hash: code },
        nationalId,
      )

    if (!confirmed) {
      if (remainingAttempts !== undefined && remainingAttempts >= 0) {
        throw new AttemptFailed(remainingAttempts, {
          emailVerificationCode: 'Verification code does not match.',
        })
      } else {
        throw new BadRequestException(message)
      }
    }
  }

  private async checkEmailExists(
    nationalId: string,
    email: string,
  ): Promise<void> {
    const existingEmail = await this.emailsModel.findOne({
      where: { nationalId, email },
    })

    if (
      existingEmail &&
      existingEmail.emailStatus !== DataStatus.NOT_VERIFIED
    ) {
      throw new BadRequestException('Email already exists for this user')
    }
  }

  private async findEmailForUser(
    nationalId: string,
    emailId: string,
  ): Promise<Emails> {
    const emailRecord = await this.emailsModel.findOne({
      where: { id: emailId, nationalId },
    })

    if (!emailRecord) {
      throw new BadRequestException(
        'Email not found or does not belong to this user',
      )
    }

    return emailRecord
  }
}
