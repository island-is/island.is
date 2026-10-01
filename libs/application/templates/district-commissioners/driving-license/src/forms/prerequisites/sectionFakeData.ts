import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { allowFakeCondition } from '../../utils'

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
            Ath. gervigögn eru eingöngu notuð í stað þess að sækja forsendugögn
            í staging umhverfi (dev x-road) hjá RLS. Sjálfgefið tekur RLS ekki
            við umsókninni þegar gervigögn eru notuð, en hægt er að virkja
            senda-til-RLS hér að neðan til að senda inn raunverulega umsókn í
            dev x-road.

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
          id: 'fakeData.submitToRLS',
          title: 'Senda umsóknina samt til RLS?',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: NO,
          options: [
            {
              value: YES,
              label: 'Já — kalla á raunverulegt RLS endapunkt',
            },
            {
              value: NO,
              label: 'Nei — skila gervisvari án RLS-kalls',
            },
          ],
        }),
        buildTextField({
          id: 'fakeData.submitErrorCode',
          title: 'Líkja eftir villu við innsendingu? (RLS villukóði)',
          placeholder:
            't.d. HAS_POINTS eða INSTRUCTOR_DOES_NOT_HAVE_BE_CATEGORY',
          // Dev-only: only applies on the fake (non-RLS) submit path. Leave tómt
          // til að senda inn eðlilega. Á innsendingu hendir þetta villu með
          // þessum kóða svo hægt sé að sjá villuskjáinn á greiðsluþrepi.
          condition: allowFakeCondition(YES),
          width: 'half',
        }),
        buildRadioField({
          id: 'fakeData.currentLicense',
          title: 'Núverandi ökuréttindi umsækjanda',
          width: 'half',
          condition: allowFakeCondition(YES),
          options: [
            {
              value: 'none',
              label: 'Engin',
            },
            {
              value: 'temp',
              label: 'Bráðabirgðaskírteini',
            },
            {
              value: 'B',
              label: 'Fullnaðarskírteini',
            },
            {
              value: 'BE',
              label: 'Kerruréttindi',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasExtendedLicense',
          title: '65+ endurnýjun: með aukin ökuréttindi (C/CE/D...)?',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: NO,
          options: [
            {
              value: NO,
              label: 'Nei',
            },
            {
              value: YES,
              label: 'Já — læsir endurnýjun (aukin réttindi)',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasRenewalBlockingRemark',
          title: '65+ endurnýjun: með læsandi tákntölu (400/450/95)?',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: NO,
          options: [
            {
              value: NO,
              label: 'Nei',
            },
            {
              value: YES,
              label: 'Já — læsir endurnýjun (tákntala)',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasDrivingAssessment',
          title: 'B-full: er með akstursmat?',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: YES,
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei — akstursmat vantar',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasFinishedDrivingSchool',
          title: 'B-full: hefur lokið ökuskóla 3?',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: YES,
          options: [
            {
              value: YES,
              label: 'Já',
            },
            {
              value: NO,
              label: 'Nei — ökuskóla vantar',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.remarks',
          title: 'Heilbrigðis tákntala',
          width: 'half',
          condition: allowFakeCondition(YES),
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
        buildRadioField({
          id: 'fakeData.hasThjodskraPhoto',
          title: 'B-full / B-temp / 65+ endurnýjun: Mynd úr Þjóðskrá?',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: 'real',
          options: [
            {
              value: YES,
              label: 'Já — gervi mynd til staðar',
            },
            {
              value: NO,
              label: 'Nei — gervi engin mynd',
            },
            {
              value: 'real',
              label: 'Raunveruleg gögn (sækja í Þjóðskrá)',
            },
          ],
        }),
        buildRadioField({
          id: 'fakeData.hasRLSPhoto',
          title:
            'B-full / B-temp / 65+ endurnýjun: Gæðamynd úr ökuskírteinaskrá (RLS)?',
          width: 'half',
          condition: allowFakeCondition(YES),
          defaultValue: 'real',
          options: [
            {
              value: YES,
              label: 'Já — gervi gæðamynd til staðar',
            },
            {
              value: NO,
              label: 'Nei — gervi engin gæðamynd',
            },
            {
              value: 'metadata-only',
              label: 'Já — gervi gæðamynd, en pohto-bita vantar (eldri skrá)',
            },
            {
              value: 'real',
              label: 'Raunveruleg gögn (sækja í RLS)',
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
