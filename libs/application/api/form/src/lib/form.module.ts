import { Module } from '@nestjs/common'
import { FormService } from './form.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { SectionFactory } from './formFactory/formItems/sectionFactory'
import { SubSectionFactory } from './formFactory/formItems/subSectionFactory'
import { MultiFieldFactory } from './formFactory/formItems/multifieldFactory'
import { ExternalDataProviderFactory } from './formFactory/formItems/externalDataProviderFactory'
import { DescriptionFieldFactory } from './formFactory/fields/descriptionFieldFactory'
import { TextFieldFactory } from './formFactory/fields/textFieldFactory'
import { SubmitFieldFactory } from './formFactory/fields/submitFieldFactory'
import { PaymentPendingFieldFactory } from './formFactory/fields/paymentPendingFieldFactory'
import { AlertMessageFieldFactory } from './formFactory/fields/alertMessageFieldFactory'
import { LinkFieldFactory } from './formFactory/fields/linkFieldFactory'
import { MessageWithLinkButtonFieldFactory } from './formFactory/fields/messageWithLinkButtonFieldFactory'
import { ExpandableDescriptionFieldFactory } from './formFactory/fields/expandableDescriptionFieldFactory'

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
    SubmitFieldFactory,
    PaymentPendingFieldFactory,
    AlertMessageFieldFactory,
    LinkFieldFactory,
    MessageWithLinkButtonFieldFactory,
    ExpandableDescriptionFieldFactory,
  ],
  exports: [FormService],
})
export class ApplicationFormModule {}
