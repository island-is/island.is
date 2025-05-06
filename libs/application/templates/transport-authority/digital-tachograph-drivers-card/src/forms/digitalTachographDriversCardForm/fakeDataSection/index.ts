import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'

export const fakeDataSection = buildSection({
  id: 'fakeData',
  title: 'Gervigögn',
  children: [
    buildMultiField({
      id: 'shouldFake',
      title: 'Gervigögn',
      description: `
        Ath. gervigögn eru eingöngu notuð í stað þess að sækja
        forsendugögn í staging umhverfi (dev x-road) hjá RLS / SGS.
        Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
        til að hægt sé að prófa ferlið án þess að vera með tilheyrandi
        ökuréttindi í staging grunni RLS / SGS.
      `.replace(/\s{1,}/g, ' '),
      children: [
        buildRadioField({
          id: 'fakeData.useFakeData',
          title: 'Viltu nota gervigögn fyrir ökuréttindi?',
          width: 'half',
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.currentLicense',
          title: 'Núverandi ökuréttindi umsækjanda',
          description:
            'Verður með *issued = today - 1Y* og *expires = today + 14Y*',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeData') === YES,
          options: [
            {
              value: 'B',
              label: 'B réttindi',
            },
            {
              value: 'C',
              label: 'C réttindi',
            },
            {
              value: 'C1',
              label: 'C1 réttindi',
            },
            {
              value: 'D',
              label: 'D réttindi',
            },
            {
              value: 'D1',
              label: 'D1 réttindi',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.useFakeDataDriversCard',
          title: 'Viltu nota gervigögn fyrir íslenskt ökuritakort?',
          width: 'half',
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasNewestDriversCard',
          title: 'Er með íslenskt ökuritakort',
          description:
            'Ef já, þá verður *applicationCreatedAt = today - 12M* og *cardValidFrom = today - 12M*',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeDataDriversCard') === YES,
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.newestDriversCardIsExpired',
          title: 'Íslenska ökuritakortið er útrunnið',
          description: 'Ef já, þá verður *cardValidTo = today - 1M*',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeDataDriversCard') ===
              YES &&
            getValueViaPath(answers, 'fakeData.hasNewestDriversCard') === YES,
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.newestDriversCardIsValid',
          title: 'Íslenska ökuritakortið er gilt',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeDataDriversCard') ===
              YES &&
            getValueViaPath(answers, 'fakeData.hasNewestDriversCard') === YES &&
            getValueViaPath(answers, 'fakeData.newestDriversCardIsExpired') ===
              NO,
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei',
            },
          ],
        }),
        buildDescriptionField({
          id: 'fakeData.newestDriversCardExpiresInMonthsDesc',
          title: 'Íslenska ökuritakortið rennur út eftir x marga mánuði',
          titleVariant: 'h4',
          description: 'Default: *cardValidTo = today + 1M*',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeDataDriversCard') ===
              YES &&
            getValueViaPath(answers, 'fakeData.hasNewestDriversCard') === YES &&
            getValueViaPath(answers, 'fakeData.newestDriversCardIsExpired') ===
              NO &&
            getValueViaPath(answers, 'fakeData.newestDriversCardIsValid') ===
              YES,
        }),
        buildTextField({
          id: 'fakeData.newestDriversCardExpiresInMonths',
          variant: 'number',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeDataDriversCard') ===
              YES &&
            getValueViaPath(answers, 'fakeData.hasNewestDriversCard') === YES &&
            getValueViaPath(answers, 'fakeData.newestDriversCardIsExpired') ===
              NO &&
            getValueViaPath(answers, 'fakeData.newestDriversCardIsValid') ===
              YES,
        }),
        buildRadioField({
          id: 'fakeData.useFakeDataTachoNet',
          title: 'Viltu nota gervigögn fyrir gögn í TachoNet?',
          width: 'half',
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasActiveCardInTachoNet',
          title: 'Er með gilt kort í Tachonet',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeDataTachoNet') === YES,
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei',
            },
          ],
        }),
      ],
    }),
  ],
})
