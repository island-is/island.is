import { buildSection } from '@island.is/application/core'
import { textInputSubsection } from './textInputSubsection'
import { checkboxSubsection } from './checkboxSubsection'
import { radioSubsection } from './radioSubsection'
import { selectSubsection } from './selectSubsection'
import { phoneSubsection } from './phoneSubsection'
import { dateSubsection } from './dateSubsection'
import { fileUploadSubsection } from './fileUploadSubsection'

export const simpleInputsSection = buildSection({
  id: 'simpleInputsSection',
  title: 'Simple inputs',
  children: [
    textInputSubsection,
    checkboxSubsection,
    radioSubsection,
    selectSubsection,
    phoneSubsection,
    dateSubsection,
    fileUploadSubsection,
  ],
})
