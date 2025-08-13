import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { DrivingLicenseFakeData } from '../../lib/constants'
import { allowFakeCondition } from '../../lib/utils'

export const sectionFakeData = buildSubSection({
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
          // Note: text is rendered by a markdown component.. and when
          // it sees the indented spaces it seems to assume this is code
          // and so it will wrap the text in a <code> block when the double
          // spaces are not removed.
          description: `
            Ath. gervigögn eru eingöngu notuð í stað þess að sækja
            forsendugögn í staging umhverfi (dev x-road) hjá RLS, auk þess
            sem hægt er að senda inn umsóknina í "þykjó" - þeas. allt hagar sér
            eins nema að RLS tekur ekki við umsókninni.

            Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
            til að hægt sé að prófa ferlið án þess að vera með tilheyrandi
            ökuréttindi í staging grunni RLS.
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
          condition: allowFakeCondition(YES),
          options: [
            {
              value: 'student',
              label: 'Engin',
            },
            {
              value: 'temp',
              label: 'Bráðabirgðaskírteini',
            },
            {
              value: 'full',
              label: 'Fullnaðarskírteini',
            },
            {
              value: 'BE',
              label: 'Kerruréttindi',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.qualityPhoto',
          title: 'Gervimynd eða enga mynd?',
          width: 'half',
          condition: allowFakeCondition(YES),
          options: [
            {
              value: YES,
              label: 'Mynd',
            },
            {
              value: NO,
              label: 'Engin mynd',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.remarks',
          title: 'Heilbrigðis tákntala',
          width: 'half',
          condition: (answers) => {
            const fakeData = getValueViaPath<DrivingLicenseFakeData>(
              answers,
              'fakeData',
            )
            return (
              fakeData?.currentLicense === 'temp' &&
              fakeData.useFakeData === YES
            )
          },
          options: [
            {
              value: NO,
              label: 'Engin tákntala',
            },
            {
              value: YES,
              label: 'Tákntala',
            },
          ],
        }),
        buildTextField({
          id: 'fakeData.howManyDaysHaveYouLivedInIceland',
          title: 'Hversu lengi hefur þú búið á Íslandi (í dögum)?',
          condition: allowFakeCondition(YES),
          width: 'half',
          defaultValue: '185',
        }),
        buildTextField({
          id: 'fakeData.age',
          title: 'Aldur umsækjanda',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: '35',
        }),
      ],
    }),
  ],
})
