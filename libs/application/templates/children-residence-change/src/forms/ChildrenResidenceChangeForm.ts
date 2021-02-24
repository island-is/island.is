import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCustomField,
  buildSubSection,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ChildrenResidenceChangeForm: Form = buildForm({
  id: 'ChildrenResidenceChangeFormDraft',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'backgroundInformation',
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
              checkboxLabel: m.externalData.general.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: 'NationalRegistryProvider',
                  title: m.externalData.applicant.title,
                  subTitle: m.externalData.applicant.subTitle,
                }),
                buildDataProviderItem({
                  id: 'childrenNationalRegistry',
                  type: 'ChildrenNationalRegistryProvider',
                  title: m.externalData.children.title,
                  subTitle: m.externalData.children.subTitle,
                }),
                buildDataProviderItem({
                  id: 'parentNationalRegistry',
                  type: 'ParentNationalRegistryProvider',
                  title: m.externalData.otherParents.title,
                  subTitle: m.externalData.otherParents.title,
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
              id: 'selectChild',
              title: m.selectChildren.general.pageTitle,
              component: 'SelectChildren',
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParent',
          title: m.otherParent.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'contactInfo',
              title: m.otherParent.general.pageTitle,
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
          id: 'residenceChangeReason',
          title: m.reason.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'residenceChangeReason',
              title: m.reason.general.pageTitle,
              component: 'Reason',
            }),
          ],
        }),
        buildSubSection({
          id: 'confirmResidenceChangeInfo',
          title: m.newResidence.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'confirmResidenceChangeInfo',
              title: m.newResidence.general.pageTitle,
              component: 'ChangeInformation',
            }),
          ],
        }),
        buildSubSection({
          id: 'duration',
          title: m.duration.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectDuration',
              title: m.duration.general.pageTitle,
              component: 'Duration',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveTerms',
      title: m.section.effect,
      children: [
        buildCustomField({
          id: 'approveTerms',
          title: 'Hvaða áhrif hefur breytingin?',
          component: 'Terms',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.section.overview,
      children: [
        buildMultiField({
          id: 'residenceChangeOverview',
          title: m.contract.general.pageTitle,
          description: '',
          children: [
            buildCustomField({
              id: 'residenceChangeReview',
              title: m.contract.general.pageTitle,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'assign',
              placement: 'footer',
              title: '',
              actions: [
                {
                  event: 'ASSIGN',
                  name: 'Skrifa undir umsókn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
