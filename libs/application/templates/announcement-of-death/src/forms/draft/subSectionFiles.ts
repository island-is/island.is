import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  buildDescriptionField,
} from '@island.is/application/core'

export const subSectionFiles = buildSubSection({
  id: 'filesStep',
  title: 'Skjöl',
  children: [
    buildMultiField({
      id: 'propertiesTitle',
      title: 'Skjöl',
      description: 'Texti sem segir aðeins frá hvað þetta hérna fyrir neðan er',
      space: 1,
      children: [
        buildDescriptionField({
          id: 'sendToAll',
          title: 'Sent á alla aðila dánarbús',
          titleVariant: 'h3',
        }),
        buildCustomField(
          {
            title: 'Heimild til að afla upplýsinga',
            description:
              'Heimild veitt til erfingja svo hann geti aflað sér upplýsinga um fjárhagsstöðu dánarbúsins',
            id: 'EstateProxy',
            component: 'FilesRecipientCard',
          },
          {
            noOptions: true,
          },
        ),
        buildDescriptionField({
          id: 'selectMainRecipient',
          title: 'Veldu hver fær sent',
          titleVariant: 'h3',
          space: 5,
        }),
        buildCustomField({
          title: 'Vottorð um tilkynningu andláts',
          description:
            'Heimilar erfingjum að greftra viðkomandi einstakling. Prestur þarf að fá þetta skjal áður en útför fer fram',
          id: 'EstateCertificate',
          component: 'FilesRecipientCard',
        }),
        buildCustomField({
          title: 'Heimild til úttektar á útfarakostnaði',
          description:
            'Heimild sem erfingi framvísar hjá bankastofnun svo hann geti notað fjármuni hins látna til að greiða útfarakostnað',
          id: 'EstateWarrant',
          component: 'FilesRecipientCard',
        }),
      ],
    }),
  ],
})
