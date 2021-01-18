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
} from '@island.is/application/core'

import { Parent, RegisteredChildren } from '../dataProviders/APIDataTypes'

type answers = {
  selectedChildren: string[]
  selectedDuration: string
  durationDate?: string
}

// This is a temporary handler until we create a custom component for this
const handleDomicileChangeInfo = (data: {
  parent: Parent
  children: RegisteredChildren[]
  selectedChildren: string[]
}) => {
  const { parent, children, selectedChildren } = data

  const filterChildren = children.filter((child) =>
    selectedChildren.includes(child.name),
  )
  const childrenCurrentHome = filterChildren.map((child) => {
    const address = `${child.address}, ${child.postalCode} ${child.city}`
    return `${child.name}<br />${address}<br />`
  })

  const childrenFutureHome = filterChildren.map((child) => {
    const futureDomicile = `${parent.address}, ${parent.postalCode} ${parent.city}`
    return `${child.name}<br />${futureDomicile}<br />`
  })

  return `<strong>Núverandi lögheimili:</strong><br />${childrenCurrentHome.join(
    '',
  )}<br /><strong>Nýtt lögheimili:</strong><br />${childrenFutureHome.join('')}`
}

const extractParentFromApplication = (application: Application) => {
  return (application.externalData.parentNationalRegistry?.data as {
    parent?: object
  }) as Parent
}

const extractChildrenFromApplication = (application: Application) => {
  return (application.externalData.childrenNationalRegistry?.data as {
    registeredChildren?: object
  }) as RegisteredChildren[]
}

const extractAnswersFromApplication = (application: Application) => {
  return {
    selectedChildren: application.answers.selectChild as string[],
    selectedDuration: application.answers.selectDuration as string,
    durationDate: application.answers.durationDate as string,
  }
}

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
          description:
            'Sem foreldrar með sameiginlega forsjá getið þið óskað eftir því að flytja lögheimili barns frá foreldri A til foreldri B eða öfugt. <br /><br /> Vinsamlegast staðfestu að lögheimili barns sé að flytjast til hins foreldris eins og skráð er hér fyrir neðan.',
          children: [
            buildCheckboxField({
              id: 'confirmInformationAboutDomicileChange',
              title: 'Breytingar á lögheimili',
              description: (application) => {
                const parent = extractParentFromApplication(application)
                const children = extractChildrenFromApplication(application)
                const selectedChildrenIds = application.answers
                  .selectChild as string[]

                return handleDomicileChangeInfo({
                  parent,
                  children,
                  selectedChildren: selectedChildrenIds,
                })
              },
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
          description:
            'Hér væri texti á mannamáli sem útskýrir hvaða áhrif þessi breyting hefur.',
          children: [
            buildCheckboxField({
              id: 'approveTerms',
              title:
                'Litið er svo á að barn hafi fasta búsetu hjá því foreldri sem það á lögheimili hjá. Barn á rétt til að umgangast með reglubundnum hætti það foreldri sem það býr ekki hjá og bera foreldrarnir sameiginlega þá skyldu að tryggja rétt barns til umgengni.',
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
        buildDescriptionField({
          id: 'applicationOverview',
          title: 'Yfirlit umsóknar',
          description: (application) => {
            const parent = extractParentFromApplication(application)
            const children = extractChildrenFromApplication(application)
            const answers = extractAnswersFromApplication(application)

            // This is a temp solution, we are going to create custom field to do this
            return `Hér er yfirlit yfir samning um breytt lögheimili. Þú og ${
              parent.name
            } þurfa að staðfesta og undirrita áður en málið fer í afgreiðslu hjá sýslumanni. <br /> <br />
            <strong>Nöfn barn:</strong> <br />
            ${answers.selectedChildren
              .map((c) => c)
              .join('<br />')} <br /> <br />
            <strong>Núverandi lögheimili barna:</strong> <br />
            ${children[0].address}, ${children[0].postalCode} ${
              children[0].city
            } <br /> <br />
            <strong>Nýtt lögheimili barna:</strong> <br />
            ${parent.name} <br />
            ${parent.address}, ${parent.postalCode} ${parent.city} <br /> <br />
            <strong>Gildistími </strong> <br />
            ${
              answers.durationDate ? answers.durationDate : 'Til frambúðar'
            } <br /> <br />
            <strong>Áhrif umsóknar</strong> <br />
            Ég skil hvaða áhrif lögheimilsbreyting hefur.
            `
          },
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
