import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
  buildTextField,
  buildCustomField,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import { DataProviderTypes } from '../types'
import * as m from '../lib/messages'

import { contactInfoIds } from '../fields/ContactInfo'

export const JointCustodyAgreementForm: Form = buildForm({
  id: 'JointCustodyAgreementForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'jointCustodyAgreementForm',
      title: m.section.backgroundInformation,
      children: [
        buildSubSection({
          id: 'externalData',
          title: m.externalData.general.sectionTitle,
          children: [
            buildExternalDataProvider({
              title: m.externalData.general.pageTitle,
              id: 'approveExternalData',
              subTitle: m.externalData.general.subTitle,
              description: m.externalData.general.description,
              checkboxLabel: m.externalData.general.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: DataProviderTypes.NationalRegistry,
                  title: m.externalData.applicant.title,
                  subTitle: m.externalData.applicant.subTitle,
                }),
                buildDataProviderItem({
                  id: '',
                  type: '',
                  title: m.externalData.children.title,
                  subTitle: m.externalData.children.subTitle,
                }),
                buildDataProviderItem({
                  id: 'userProfile',
                  type: DataProviderTypes.UserProfile,
                  title: '',
                  subTitle: '',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'selectChildInCustody',
          title: m.selectChildren.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectedChildren',
              title: m.selectChildren.general.pageTitle,
              component: 'SelectChildren',
            }),
          ],
        }),
        buildSubSection({
          id: 'contact',
          title: m.contactInfo.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'contactInfo',
              title: m.contactInfo.general.pageTitle,
              childInputIds: contactInfoIds,
              component: 'ContactInfo',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'arrangement',
      title: m.section.arrangement,
      children: [
        buildSubSection({
          id: 'selectLegalResidence',
          title: m.selectLegalResidence.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectLegalResidence',
              title: m.selectLegalResidence.general.pageTitle,
              component: 'SelectLegalResidence',
            }),
          ],
        }),
        // buildSubSection({
        //   id: 'duration',
        //   title: m.duration.general.sectionTitle,
        //   children: [
        //     buildCustomField({
        //       id: 'selectDuration',
        //       title: m.duration.general.pageTitle,
        //       childInputIds: selectDurationInputs,
        //       component: 'Duration',
        //     }),
        //   ],
        // }),
      ],
    }),
  ],
})
