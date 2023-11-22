import { Form } from '@island.is/application/types'
import { FormDto } from '../dto/form.dto'
import { SectionFactory } from './sectionFactory'

function transformForm(form: Form): FormDto {
  const formDto = new FormDto()

  const sectionFactory = new SectionFactory()

  form.children.forEach((child) => {
    formDto.children.push(sectionFactory.create(child))
  })

  return formDto
}
