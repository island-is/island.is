import { InjectModel } from '@nestjs/sequelize'
import kennitala from 'kennitala'
import { Emails } from './models/emails.model'
import { BadRequestException, Injectable } from '@nestjs/common'
import { EmailsDto } from './dto/emails.dto'

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(Emails)
    private emailsModel: typeof Emails,
  ) {}

  async findAllByNationalId(nationalId: string): Promise<EmailsDto[]> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('Invalid nationalId')
    }

    console.log(`Finding emails for nationalId: ${nationalId}`)

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

  async updateEmailStatus(): Promise<Emails | null> {
    // Todo: Implement
    return null
  }
}
