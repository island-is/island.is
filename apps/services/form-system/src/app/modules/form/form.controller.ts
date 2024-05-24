import { Controller, Get } from '@nestjs/common'

import { FormService } from './form.service'

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get()
  getData() {
    return this.formService.getData()
  }
}
