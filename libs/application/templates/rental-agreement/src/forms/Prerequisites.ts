import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'

import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'
import { Routes } from '../lib/RentalAgreementTemplate'

export const Prerequisites: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: m.prerequisites.intro.sectionTitle,
      children: [
        buildSubSection({
          id: Routes.GENERALINFORMATION,
          title: m.prerequisites.intro.subSectionTitle,
          children: [
            buildMultiField({
              id: Routes.GENERALINFORMATION,
              title: m.prerequisites.intro.pageTitle,
              children: [
                buildDescriptionField({
                  id: 'prerequisiteIntroTitle',
                  title: 'contractDescriptionTitle',
                  description: 'contractDescriptionDescription',
                }),
                buildCustomField({
                  id: 'generalInformation',
                  title: 'contractDescriptionTitle',
                  component: 'GeneralInfoForm',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'choseRole',
          title: 'Hlutverk',
          children: [
            buildRadioField({
              id: 'applicationType.option',
              title: 'radioFieldTitle',
              description: 'radioFieldDescription',
              options: [
                {
                  value: 'yes',
                  label: 'Yes',
                },
                {
                  value: 'no',
                  label: 'No',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicantData',
      title: 'Mínar upplýsingar',
      children: [],
    }),
    buildSection({
      id: 'accommodationData',
      title: 'Húsnæðið',
      children: [],
    }),
    buildSection({
      id: 'periodAndAmount',
      title: 'Tímabil og fjárhæð',
      children: [],
    }),
    buildSection({
      id: 'summary',
      title: 'Samantekt',
      children: [],
    }),
    buildSection({
      id: 'signing',
      title: 'Undirritun',
      children: [],
    }),
  ],
})
