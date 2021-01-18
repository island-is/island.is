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
  Application,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
  extractAnswersFromApplication,
} from '../lib/utils'

export const ChildrenDomicileTransferForm: Form = buildForm({
  id: 'ChildrenDomicileTransferFormDraft',
  title: 'Flutningur lögheimilis',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: 'Gagnaöflun',
      children: [
        buildExternalDataProvider({
          title: 'Gagnaöflun',
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'childrenNationalRegistry',
              type: 'ChildrenNationalRegistryProvider',
              title: 'Grunnupplýsingar um börn',
              subTitle:
                'Nöfn, kennitölur og núverandi lögheimili barna í þinni forsjá.',
            }),
            buildDataProviderItem({
              id: 'parentNationalRegistry',
              type: 'ParentNationalRegistryProvider',
              title: 'Grunnupplýsingar um foreldra',
              subTitle: 'Nöfn, kennitölur og lögheimili forelda barnanna.',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'selectChildInCustody',
      title: 'Velja barn',
      children: [
        buildCheckboxField({
          id: 'selectChild',
          title: 'Velja barn/börn til að flytja lögheimili fyrir',
          description:
            'Hér sérðu lista yfir börn sem eru skráð í þinni forsjá. Þú getur valið hvaða börn á að flytja lögheimili fyrir.',
          large: true,
          options: (application) =>
            extractChildrenFromApplication(application).map((c) => ({
              value: c.name,
              label: c.name,
            })),
        }),
      ],
    }),
    buildSection({
      id: 'otherParent',
      title: 'Hitt foreldri',
      children: [
        buildMultiField({
          id: 'informationAboutOtherParent',
          title: 'Fylltu inn upplýsingar um hitt foreldrið',
          description: (application) => {
            const parent = extractParentFromApplication(application)
            return `Hitt foreldrið er ${parent.name} (${parent.ssn})`
          },
          children: [
            buildTextField({
              id: 'email',
              description:
                'Til að láta hitt foreldrið vita þurfum við að fá netfang og símanúmer viðkomandi.',
              title: 'Netfang',
            }),
            buildTextField({
              id: 'phoneNumber',
              title: 'Símanúmer',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'changeDomicile',
      title: 'Breyta lögheimili',
      children: [
        buildMultiField({
          id: 'informationAboutDomicileChange',
          title: 'Hvert á að flytja lögheimilið?',
          children: [
            buildCustomField({
              id: 'domicileChangeInformation',
              title: '',
              component: 'DomicileChangeInformation',
            }),
            buildCheckboxField({
              id: 'confirmInformationAboutDomicileChange',
              title: '',
              large: true,
              options: [
                {
                  value: 'confirmDomicileChangeInfo',
                  label: 'Ég samþykki breytingu',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
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
                  value: 'temporary',
                  label: 'Tímabundið',
                  tooltip: '6 mánuðir eða lengur',
                },
                {
                  value: 'permanent',
                  label: 'Til frambúðar',
                  tooltip: 'Samningurinn gildir til 18 ára aldurs barns',
                },
              ],
            }),
            buildDateField({
              condition: (formData) => formData.selectDuration === 'temporary',
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
    buildSection({
      id: 'applicationTerms',
      title: 'Áhrif umsóknar',
      children: [
        buildMultiField({
          id: 'applicationTermsTitle',
          title: 'Hvaða áhrif hefur breytingin?',
          children: [
            buildCustomField({
              id: 'domicileChangeTerms',
              title: '',
              component: 'Terms',
            }),
            buildCheckboxField({
              id: 'approveTerms',
              title: '',
              large: true,
              options: [
                {
                  value: 'approveTerms',
                  label: 'Ég skil hvaða áhrif lögheimilisbreyting hefur',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: 'Yfirlit og undirritun',
      children: [
        buildCustomField({
          id: 'domicileChangeReview',
          title: 'Yfirlit umsóknar',
          component: 'Overview',
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: 'Umsókn móttekin',
      children: [
        buildTextField({
          id: 'children',
          title: 'children',
        }),
      ],
    }),
  ],
})
