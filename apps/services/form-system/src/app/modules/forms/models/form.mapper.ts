import { Injectable } from '@nestjs/common'
import { Form } from './form.model'
import { FormsListDto } from './dto/formsList.dto'
import { FormsListFormDto } from './dto/formsListForm.dto'

@Injectable()
export class FormMapper {
  mapFormsToFormsListDto(forms: Form[]): FormsListDto {
    const formsListForms = forms.map((form) => {
      return {
        id: form.id,
        name: form.name,
        urlName: form.urlName,
        invalidationDate: form.invalidationDate,
        created: form.created,
        modified: form.modified,
        isTranslated: form.isTranslated,
        applicationDaysToRemove: form.applicationDaysToRemove,
        derivedFrom: form.derivedFrom,
        stopProgressOnValidatingStep: form.stopProgressOnValidatingStep,
      } as FormsListFormDto
    })
    const formsListDto: FormsListDto = {
      forms: formsListForms,
    }

    return formsListDto
  }
}
