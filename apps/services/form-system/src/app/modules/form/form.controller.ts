import { Controller, Get, Post } from '@nestjs/common'

import { FormService } from './form.service'

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  create(): string {
    return 'This action adds a new form'
  }

  @Get()
  getData() {
    return this.formService.getData()
  }
}
