import { Module } from '@nestjs/common'
import { FormService } from './form.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { SectionFactory } from './formFactory/formItems/sectionFactory'
import { SubSectionFactory } from './formFactory/formItems/subSectionFactory'
import { MultiFieldFactory } from './formFactory/formItems/MultifieldFactory'
import { ExternalDataProviderFactory } from './formFactory/formItems/externalDataProviderFactory'
import { DescriptionFieldFactory } from './formFactory/fields/descriptionFieldFactory'
import { TextFieldFactory } from './formFactory/fields/textFieldFactory'

@Module({
  imports: [ApplicationApiCoreModule],
  providers: [
    FormService,
    SectionFactory,
    SubSectionFactory,
    MultiFieldFactory,
    ExternalDataProviderFactory,
    DescriptionFieldFactory,
    TextFieldFactory,
  ],
  exports: [FormService],
})
export class ApplicationFormModule {}
