import {
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { LearnersPermitFakeData } from '../../lib/constants'
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
          title: 'Núverandi ökuréttindi leiðbeinanda',
          width: 'half',
          condition: allowFakeCondition(YES),
          options: [
            {
              value: 'none',
              label: 'Engin',
            },
            {
              value: 'B-full',
              label: 'B réttindi',
            },
          ],
        }),
        buildDateField({
          id: 'fakeData.mentorLicenseIssuedDate',
          title: 'Útgáfudagur ökuréttinda',
          placeholder: 'Útgáfudagur ökuréttinda',
          condition: (answers) => {
            const fakeData = getValueViaPath<LearnersPermitFakeData>(
              answers,
              'fakeData',
            )
            return fakeData?.currentLicense === 'B-full'
          },
        }),
        buildSelectField({
          id: 'fakeData.mentorAge',
          title: 'Aldur leiðbeinanda',
          condition: allowFakeCondition(YES),
          options: Array.from({ length: 20 }, (_, i) =>
            (i + 15).toString(),
          ).map((v) => {
            return {
              value: v,
              label: v,
            }
          }),
        }),
        buildTextField({
          id: 'fakeData.mentorableStudents',
          title: 'Kennitölur nemenda sem hafa rétt á æfingarleyfi',
          width: 'full',
          placeholder: '0101302399, 0101303019, ...',
          condition: allowFakeCondition(YES),
        }),
        buildRadioField({
          id: 'fakeData.useDeprivation',
          title: 'Nota sviptingar?',
          condition: allowFakeCondition(YES),
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
        buildDateField({
          id: 'fakeData.deprivationDateFrom',
          title: 'Gildistími sviptingar frá...',
          placeholder: 'Svipting gildir frá...',
          condition: (answers) => {
            const fakeData = getValueViaPath<LearnersPermitFakeData>(
              answers,
              'fakeData',
            )
            return fakeData?.useDeprivation === YES
          },
        }),
        buildDateField({
          id: 'fakeData.deprivationDateTo',
          title: 'Gildistími sviptingar til...',
          placeholder: 'Svipting gildir til...',
          condition: (answers) => {
            const fakeData = getValueViaPath<LearnersPermitFakeData>(
              answers,
              'fakeData',
            )
            return fakeData?.useDeprivation === YES
          },
        }),
        buildRadioField({
          id: 'fakeData.remarks',
          title: 'Heilbrigðis tákntala',
          width: 'half',
          condition: (answers) => {
            const fakeData = getValueViaPath<LearnersPermitFakeData>(
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
      ],
    }),
  ],
})
