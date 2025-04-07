import { buildForm, buildSection } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { applicationTypeSubSection } from './applicationTypeSubSection'
import { externalDataSubSection } from './externalDataSubSection'

export const Prerequisites: Form = buildForm({
  id: 'medicalAndrehabilitationPaymentsPrerequisites',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: medicalAndRehabilitationPaymentsFormMessage.pre.sectionTitle,
      children: [applicationTypeSubSection, externalDataSubSection],
    }),
  ],
})
