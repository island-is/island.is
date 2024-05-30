import { Injectable } from '@nestjs/common'
import { Form } from './form.model'
import { InjectModel } from '@nestjs/sequelize'
import { Step } from '../steps/step.model'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
  ) {}

  async findAll(): Promise<Form[]> {
    return await this.formModel.findAll()
  }

  async findOne(id: number): Promise<Form | null> {
    const form = await this.formModel.findByPk(id, { include: [Step] })

    return form
  }

  async create(form: Form): Promise<Form> {
    const newForm: Form = new this.formModel(form, { include: [Step] })
    return await newForm.save()
  }
}
