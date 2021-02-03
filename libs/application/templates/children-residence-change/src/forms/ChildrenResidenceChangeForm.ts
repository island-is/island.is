import {
  buildForm,
  buildSection,
  buildTextField,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCheckboxField,
  buildRadioField,
  buildMultiField,
  buildDateField,
  buildCustomField,
  buildSubSection,
} from '@island.is/application/core'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
} from '../lib/utils'
import * as m from '../lib/messages'

export const ChildrenResidenceChangeForm: Form = buildForm({
  id: 'ChildrenResidenceChangeFormDraft',
  title: m.application.name,
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
            // TODO: create custom field for this for better control
            buildCheckboxField({
              id: 'selectChild',
              title: m.selectChildren.general.pageTitle,
              description: m.selectChildren.general.subTitle,
              large: true,
              options: (application) =>
                extractChildrenFromApplication(application).map((c) => ({
                  value: c.name,
                  label: c.name,
                })),
            }),
          ],
        }),
        buildSubSection({
          id: 'otherParent',
          title: m.otherParent.general.sectionTitle,
          children: [
            // TODO: create custom field for this for better control 
            buildMultiField({
              id: 'informationAboutOtherParent',
              title: m.otherParent.general.pageTitle,
              description: (application) => {
                const parent = extractParentFromApplication(application)
                // TODO: format this with m.otherParent.general.description
                return `Hitt foreldrið er ${parent.name} (${parent.ssn})`
              },
              children: [
                buildTextField({
                  id: 'email',
                  backgroundColor: 'blue',
                  description: m.otherParent.inputs.description,
                  title: m.otherParent.inputs.emailLabel,
                }),
                buildTextField({
                  id: 'phoneNumber',
                  backgroundColor: 'blue',
                  title: m.otherParent.inputs.phoneNumberLabel,
                }),
              ],
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
          id: 'confirmResidenceChangeInfo',
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
          title: 'Nýtt lögheimili',
          children: [
            buildCustomField({
              id: 'confirmResidenceChangeInfo',
              title: 'Hvert á að flytja lögheimilið?',
              component: 'ChangeInformation',
            }),
          ],
        }),
        buildSubSection({
          id: 'transferDuration',
          title: 'Gildistími',
          children: [
            buildMultiField({
              id: 'duration',
              title: 'Í hve langan tíma á samningurinn að gilda?',
              description:
                'Veldu í hversu langan tíma samningurinn á að gilda. Hægt er að gera tímabundna lögheimilisbreytingu til a.m.k. 6 mánaða eða lengur eða velja að samningur gildi til frambúðar.',
              children: [
                buildRadioField({
                  id: 'selectDuration',
                  title: 'Veldu gildistíma',
                  largeButtons: true,
                  options: [
                    {
                      value: 'permanent',
                      label: 'Til frambúðar',
                      tooltip: 'Samningurinn gildir til 18 ára aldurs barns',
                    },
                    {
                      value: 'temporary',
                      label: 'Tímabundið',
                      tooltip: '6 mánuðir eða lengur',
                    },
                  ],
                }),
                buildDateField({
                  condition: (formData) =>
                    formData.selectDuration === 'temporary',
                  id: 'durationDate',
                  width: 'full',
                  title: 'Dagsetning',
                  placeholder: 'Veldu dagsetningu',
                  backgroundColor: 'blue',
                }),
              ],
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
        buildCustomField({
          id: 'residenceChangeReview',
          title: 'Yfirlit umsóknar',
          component: 'Overview',
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: 'Umsókn um breytt lögheimili móttekin',
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
