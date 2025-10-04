import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion, externalData } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { MachineSection } from './MachineSection'
import { OverviewSection } from './OverviewSection'

export const RegisterNewMachineForm: Form = buildForm({
  id: 'RegisterNewMachineFormDraft',
  logo: AoshLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    InformationSection,
    MachineSection,
    OverviewSection,
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      expandableHeader: conclusion.default.expandableHeader,
      expandableDescription: conclusion.default.expandableDescription,
    }),
  ],
})
