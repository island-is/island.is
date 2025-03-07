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
      children: [
        buildDescriptionField({
          id: 'gervigognDesc',
          title: 'Viltu nota gervigögn?',
          titleVariant: 'h5',
          description: `
            Ath. gervigögn eru eingöngu notuð í stað þess að sækja
            forsendugögn í staging umhverfi (dev x-road) hjá RLS / SGS.
            Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
            til að hægt sé að prófa ferlið án þess að vera með tilheyrandi
            ökuréttindi í staging grunni RLS / SGS.
          `.replace(/\s{1,}/g, ' '),
        }),
        buildRadioField({
          id: 'fakeData.useFakeData',
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
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeData') === YES,
          options: [
            {
              value: 'C',
              label: 'C réttindi',
            },
            {
              value: 'D',
              label: 'D réttindi',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasNewestDriversCard',
          title: 'Er með íslenskt ökuritakort',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeData') === YES,
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
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeData') === YES &&
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
            getValueViaPath(answers, 'fakeData.useFakeData') === YES &&
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
        buildTextField({
          id: 'fakeData.newestDriversCardExpiresInMonths',
          title: 'Íslenska ökuritakortið rennur út eftir x marga mánuði',
          variant: 'number',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeData') === YES &&
            getValueViaPath(answers, 'fakeData.hasNewestDriversCard') === YES &&
            getValueViaPath(answers, 'fakeData.newestDriversCardIsExpired') ===
              NO &&
            getValueViaPath(answers, 'fakeData.newestDriversCardIsValid') ===
              YES,
        }),
        buildRadioField({
          id: 'fakeData.hasActiveCardInTachoNet',
          title: 'Er með gilt kort í Tachonet',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'fakeData.useFakeData') === YES,
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
