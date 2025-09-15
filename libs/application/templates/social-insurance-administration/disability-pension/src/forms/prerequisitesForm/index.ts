import { buildForm, buildSection } from '@island.is/application/core'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { FormModes } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { externalDataSection } from './externalData.section'

export const Prerequisites = buildForm({
  id: 'disabilityPensionPrerequisites',
  title: m.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      tabTitle: sm.pre.title,
      children: [externalDataSection],
    }),
  ],
})
