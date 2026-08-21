import { FormItemTypes, Section } from '@island.is/application/types'
import { textInputSubsection } from './textInputSubsection'
import { checkboxSubsection } from './checkboxSubsection'
import { radioSubsection } from './radioSubsection'
import { selectSubsection } from './selectSubsection'
import { phoneSubsection } from './phoneSubsection'
import { dateSubsection } from './dateSubsection'
import { fileUploadSubsection } from './fileUploadSubsection'
import { sliderSubsection } from './sliderSubsection'
import { companySearchSubsection } from './companySearchSubsection'
import { asyncSelectSubsection } from './asyncSelectSubsection'
import { displayFieldSubsection } from './displayFieldSubsection'

export const simpleInputsSection: Section = {
  id: 'simpleInputsSection',
  title: 'Simple inputs',
  type: FormItemTypes.SECTION,
  children: [
    textInputSubsection,
    displayFieldSubsection,
    checkboxSubsection,
    radioSubsection,
    selectSubsection,
    asyncSelectSubsection,
    companySearchSubsection,
    phoneSubsection,
    dateSubsection,
    fileUploadSubsection,
    sliderSubsection,
  ],
}
