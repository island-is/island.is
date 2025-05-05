import {
  buildDateField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { DrivingLicenseDuplicateFakeData } from '../../lib/constants'
import { allowFakeCondition } from '../../lib/utils'

export const sectionFakeData = buildSubSection({
  id: 'fakeData',
  title: 'Gervigögn',
  children: [
    buildMultiField({
      id: 'shouldFake',
      title: 'Viltu nota gervigögn?',
      description: `
            Ath. gervigögn eru eingöngu notuð í stað þess að sækja
            forsendugögn í staging umhverfi (dev x-road) hjá RLS, auk þess
            sem hægt er að senda inn umsóknina í "þykjó" - þeas. allt hagar sér
            eins nema að RLS tekur ekki við umsókninni.

            Öll önnur gögn eru ekki gervigögn og er þetta eingöngu gert
            til að hægt sé að prófa ferlið án þess að vera með tilheyrandi
            ökuréttindi í staging grunni RLS.
          `.replace(/\s{1,}/g, ' '),
      children: [
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
            {
              value: 'IgnoreQualityPhotoAndSignature',
              label: 'Nei, nema sneiða framhjá QualityPhoto og undirskrift',
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
              value: 'B-full',
              label: 'B réttindi',
            },
            {
              value: 'B-temp',
              label: 'Bráðabirgðaréttindi',
            },
            {
              value: 'none',
              label: 'Engin',
            },
          ],
        }),
        buildDateField({
          id: 'fakeData.licenseIssuedDate',
          title: 'Útgáfudagur ökuréttinda',
          placeholder: 'Útgáfudagur ökuréttinda',
          condition: (answers) => {
            const fakeData = getValueViaPath<DrivingLicenseDuplicateFakeData>(
              answers,
              'fakeData',
            )
            return (
              fakeData?.currentLicense === 'B-full' ||
              fakeData?.currentLicense === 'B-temp'
            )
          },
        }),
        buildRadioField({
          id: 'fakeData.qualityPhoto',
          title: 'Með gilt QualityPhoto?',
          width: 'half',
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
        buildRadioField({
          id: 'fakeData.qualitySignature',
          title: 'Með gilt QualitySignature?',
          width: 'half',
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
        buildRadioField({
          id: 'fakeData.age',
          title: 'Aldur umsækjanda',
          width: 'half',
          condition: allowFakeCondition(YES),
          options: [
            {
              value: '25',
              label: 'Yngri en 65 ára',
            },
            {
              value: '80',
              label: '65 ára eða eldri',
            },
          ],
        }),
      ],
    }),
  ],
})
