import { FormStatus } from '@island.is/form-system/shared'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { FormsService } from '../../forms/forms.service'
import { Form } from '../../forms/models/form.model'

@Injectable()
export class FormInvalidationService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    private readonly formsService: FormsService,
  ) {
    this.logger = logger.child({ context: 'FormInvalidationService' })
  }

  public async run() {
    this.logger.info('Starting form invalidation...')
    await this.invalidatePublishedForms()
    this.logger.info('Form invalidation done.')
  }

  private async invalidatePublishedForms() {
    const formsToInvalidate = await this.formModel.findAll({
      where: {
        status: FormStatus.PUBLISHED,
        invalidationDate: { [Op.lte]: new Date() },
      },
    })

    this.logger.info(`Found ${formsToInvalidate.length} forms to invalidate.`)
    const failedFormIds: string[] = []

    for (const form of formsToInvalidate) {
      try {
        await this.formsService.archiveForm(form.id, form)

        this.logger.info('form invalidated', { id: form.id })
      } catch (error) {
        failedFormIds.push(form.id)
        this.logger.error('Failed to invalidate form', {
          id: form.id,
          error,
        })
      }
    }

    if (failedFormIds.length > 0) {
      throw new Error(
        `Failed to invalidate ${
          failedFormIds.length
        } form(s): ${failedFormIds.join(', ')}`,
      )
    }
  }
}
