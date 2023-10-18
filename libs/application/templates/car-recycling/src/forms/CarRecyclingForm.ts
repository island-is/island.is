import {
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  Form,
  FormModes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { carRecyclingMessages } from '../lib/messages'
import Logo from '../assets/Logo'

export const CarRecyclingForm: Form = buildForm({
  id: 'CarRecyclingDraft',
  title: carRecyclingMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: carRecyclingMessages.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'cars',
      title: 'oldAgePensionFormMessage.applicant.applicantSection',
      children: [
        buildMultiField({
          id: 'CarsOverview',
          title:
            'oldAgePensionFormMessage.applicant.applicantInfoSubSectionTitle',
          description:
            'oldAgePensionFormMessage.applicant.applicantInfoSubSectionDescription',
          children: [
            buildTextField({
              id: 'applicantInfo.name',
              title: 'oldAgePensionFormMessage.applicant.applicantInfoName',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (application: Application) => {
                const nationalRegistry = application.externalData
                  .nationalRegistry.data as NationalRegistryIndividual
                return nationalRegistry.fullName
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
