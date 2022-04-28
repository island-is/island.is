import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
  buildFileUploadField,
} from '@island.is/application/core'
import { ApiActions } from '../shared'
import { m } from '../lib/messages'


export const FinancialStatements: Form = buildForm({
  id: 'FinancialStatement',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: m.conditionsSection,
      children: [],
    }),
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildDescriptionField({
          id: 'field',
          title: m.introField,
          description: (application) => ({
            ...m.introIntroduction,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            values: { name: application.answers.name },
          }),
        }),
        buildMultiField({
          id: 'about',
          title: m.about,
          children: [
            buildTextField({
              id: 'person.email',
              title: m.email,
              width: 'half',
            }),
            buildTextField({
              id: 'person.phoneNumber',
              title: m.phoneNumber,
              width: 'half',
            }),
          ],
        }),

      ],
    }),
    buildSection({
      id: 'keyNumbers',
      title: 'Lykiltölur',
      children: [
        buildSubSection({
          id: 'properties',
          title: 'Eignir',
          children: [
            buildMultiField({
              title: '',
              children: [
                buildTextField({
                  id: 'property.short',
                  title: 'Skammtímarkröfur',
                  width: 'half',
                }),
                buildTextField({
                  id: 'property.cash',
                  title: 'Bankainnistæður og sjóðir',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'debts',
          title: 'Skuldir',
          children: [
            buildMultiField({
              title: '',
              children: [
                buildTextField({
                  id: 'debt.surplus',
                  title: 'Skammtímarkröfur',
                  width: 'half',
                }),
                buildTextField({
                  id: 'debt.cost',
                  title: 'Ógreiddur kostnaður',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'expenses',
          title: 'Gjöld',
          children: [
            buildMultiField({
              title: '',
              children: [
                buildTextField({
                  id: 'expenses.marketing',
                  title: 'Auglýsinginar og kynningar',
                  width: 'half',
                }),
                buildTextField({
                  id: 'expenses.travelCost',
                  title: 'Fundir og ferðakostnaður',
                  width: 'half',
                }),
                buildTextField({
                  id: 'expenses.other',
                  title: 'Annar kostnaður',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'income',
          title: 'Tekjur',
          children: [
            buildMultiField({
              title: '',
              children: [
                buildTextField({
                  id: 'donations',
                  title: 'Framlög lögaðila',
                  width: 'half',
                }),
                buildTextField({
                  id: 'income',
                  title: 'Eigin tekjur',
                  width: 'half',
                }),
                buildTextField({
                  id: 'donation.personal',
                  title: 'Fjármagnskostnaður',
                  width: 'half',
                }),
                buildTextField({
                  id: 'capital',
                  title: 'Fjármagnskostnaður',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'upload',
      title: 'Ársreikningur',
      children: [
        buildFileUploadField({
          id: 'attachments',
          title: 'Hlaða upp ársreikningi',
          introduction: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
          description: 'Heiti skjals þarf að vera á forminu “TegundViðskiptavinar-Kennitala-TegundKosninga-ÁrtalMánuðurKosninga ”. Dæmi: 1-2808705799-3-2020-08.pdf',
          uploadMultiple: false,
        }),
      ]
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [
        buildMultiField({
          title: '',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Senda inn umsókn',
              actions: [
                { event: 'SUBMIT', name: 'Senda inn umsókn', type: 'primary' },
              ],
            }),
            buildDescriptionField({
              id: 'overview',
              title: 'Takk fyrir að sækja um',
              description:
                'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: (application) => {
            const sendApplicationActionResult =
              application.externalData[ApiActions.createApplication]

            let id = 'unknown'
            if (sendApplicationActionResult) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              id = sendApplicationActionResult.data.id
            }

            return {
              ...m.outroMessage,
              values: {
                id,
              },
            }
          },
        }),
      ],
    }),
  ],
})
