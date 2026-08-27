import { ICalculator } from '../generated/contentfulTypes'

// TEMPORARY — approximates real Contentful `calculator` entries for the PoC,
// since the content type doesn't exist in any Contentful environment yet.
// Delete once real entries exist and this is no longer needed to exercise
// the pipeline end-to-end. Field keys match libs/api/domains/tax-calculators'
// calculators/*/*.fields.ts exactly, since the frontend's field-key picker
// validates against that live list.
const withholdingTaxOnWagesEntry: ICalculator = {
  sys: {
    id: 'mock-withholding-tax-on-wages',
    type: 'Entry',
    createdAt: '',
    updatedAt: '',
    locale: 'is',
    contentType: {
      sys: { id: 'calculator', linkType: 'ContentType', type: 'Link' },
    },
  },
  fields: {
    title: 'Staðgreiðsla launa (mock)',
    calculatorType: 'withholdingTaxOnWages',
    // `title`/`disclaimer` messages default to an empty string (there's no
    // GraphQL-provided default the way field labels have) -- without a
    // translation-namespace override, react-intl falls back to rendering
    // the raw message id. Real entries set this via the linked namespace.
    translationNamespace: {
      fields: {
        strings: {
          'web.rsk.calculatorSlice:title': 'Reiknivél staðgreiðslu',
          'web.rsk.calculatorSlice:disclaimer':
            'Niðurstöður eru til viðmiðunar og eru ekki bindandi.',
        },
      },
    },
    configJson: {
      calculatorType: 'withholdingTaxOnWages',
      sections: [
        {
          key: 'payments',
          title: 'Launagreiðslur',
          fields: [
            { key: 'salary', span: 7 },
            { key: 'incomeYear', span: 5 },
          ],
        },
        {
          key: 'contributions',
          title: 'Iðgjald',
          // 3-column grid rhythm (matches Persónuafsláttur/Frádráttur below),
          // with only 2 of the 3 slots used -- fields stay 1/3-width instead
          // of stretching to fill a 2-column row.
          fields: [
            { key: 'pensionFundRatio', span: 4 },
            { key: 'privatePensionRatio', span: 4 },
          ],
        },
        {
          key: 'personalTaxCredit',
          title: 'Persónuafsláttur',
          description: 'Uppsafnaður og milli hjóna',
          fields: [
            { key: 'taxCardUtilization', span: 4 },
            { key: 'spouseTaxCardUtilization', span: 4 },
            { key: 'accumulatedPersonalTaxCredit', span: 4 },
          ],
        },
        {
          key: 'deductions',
          title: 'Frádráttur',
          fields: [
            { key: 'vacationPay', span: 4 },
            { key: 'unionDues', span: 4 },
            { key: 'otherDeduction', span: 4 },
          ],
        },
        {
          key: 'employerPayments',
          title: 'Aðrar greiðslur launagreiðanda',
          toggleLabel: 'Slá inn greiðslur launagreiðanda',
          fields: [
            { key: 'employerPensionMatchRatio', span: 4 },
            { key: 'vehicleAllowance', span: 4 },
            { key: 'seamenAccidentInsurancePremium', span: 4 },
          ],
        },
      ],
    },
  },
} as unknown as ICalculator

const childBenefitEntry: ICalculator = {
  sys: {
    id: 'mock-child-benefit',
    type: 'Entry',
    createdAt: '',
    updatedAt: '',
    locale: 'is',
    contentType: {
      sys: { id: 'calculator', linkType: 'ContentType', type: 'Link' },
    },
  },
  fields: {
    title: 'Barnabætur (mock)',
    calculatorType: 'childBenefit',
    translationNamespace: {
      fields: {
        strings: {
          'web.rsk.calculatorSlice:title': 'Reiknivél barnabóta',
          'web.rsk.calculatorSlice:disclaimer':
            'Niðurstöður eru til viðmiðunar og eru ekki bindandi.',
        },
      },
    },
    configJson: {
      calculatorType: 'childBenefit',
      sections: [
        {
          key: 'income',
          title: 'Tekjur',
          description:
            'Barnabætur eru greiddar árlega í fjórum greiðslum og þær byggja á tekjum ársins á undan. Með tekjustofni er hér átt við bæði launagreiðslur og fjármagnstekjur.',
          fields: [
            { key: 'incomeBase', span: 7 },
            { key: 'incomeYear', span: 5 },
          ],
        },
        {
          key: 'familyStatus',
          title: 'Fjölskylduaðstæður',
          description:
            'Miðað er við fjölskyldustöðu í þjóðskrá við lok tekjuársins. Barnabætur byggja á samanlögðum tekjum hjóna og sambúðarfólks samkvæmt skattframtölum og skiptast jafnt á milli þeirra.',
          fields: [{ key: 'marriedOrCohabiting', span: 6 }],
        },
        {
          key: 'children',
          title: 'Fjöldi barna',
          description:
            'Barnabætur eru greiddar með hverju barni til 18 ára aldurs. Með börnum sem eru yngri en sjö ára við lok tekjuárs eru greiddar aukalega sérstakar barnabætur sem líka eru tekjutengdar.',
          fields: [
            { key: 'numberOfChildren', span: 6 },
            { key: 'numberOfChildrenUnder7', span: 6 },
            { key: 'splitCustody', span: 12 },
          ],
        },
        {
          key: 'splitCustodyDetails',
          title: 'Börn með skipta búsetu',
          description:
            'Foreldrar sem semja um skipta búsetu barna hjá sýslumanni geta hvort um sig átt rétt á barnabótum. Reiknað er fyrir hvort foreldri fyrir sig og því getur verið mismunur á barnabótum milli þeirra.',
          fields: [
            {
              key: 'splitCustodyChildrenOver7',
              span: 6,
              visibleWhen: { field: 'splitCustody', equals: 'true' },
            },
            {
              key: 'splitCustodyChildrenUnder7',
              span: 6,
              visibleWhen: { field: 'splitCustody', equals: 'true' },
            },
          ],
        },
      ],
    },
  },
} as unknown as ICalculator

const vehicleTaxEntry: ICalculator = {
  sys: {
    id: 'mock-vehicle-tax',
    type: 'Entry',
    createdAt: '',
    updatedAt: '',
    locale: 'is',
    contentType: {
      sys: { id: 'calculator', linkType: 'ContentType', type: 'Link' },
    },
  },
  fields: {
    title: 'Bifreiðagjöld (mock)',
    calculatorType: 'vehicleTax',
    translationNamespace: {
      fields: {
        strings: {
          'web.rsk.calculatorSlice:title': 'Reiknivél bifreiðagjalda',
          'web.rsk.calculatorSlice:disclaimer':
            'Niðurstöður eru til viðmiðunar og eru ekki bindandi.',
        },
      },
    },
    // NOTE: Figma's "Slá inn þyngd og losun" toggle reveals manual
    // weight/CO2/NEDC/WLTP inputs. getApiBifreidagjold's query has no
    // params for them (eiginthyngd/co2/nedc/wltp only exist on the
    // response type) -- they're wired up in the UI to match the design,
    // but currently ignored server-side until the API supports them.
    configJson: {
      calculatorType: 'vehicleTax',
      sections: [
        {
          key: 'period',
          title: 'Gjaldtímabil',
          description:
            'Gjaldtímabilin eru tvö á ári. Í reiknivélinni er hægt að skipta upp völdu tímabili, til dæmis ef ökutæki hefur skipt um eigendur.',
          fields: [
            { key: 'year', span: 5 },
            { key: 'period', span: 7 },
          ],
        },
        {
          key: 'periodSplit',
          title: '',
          toggleLabel: 'Skipta upp tímabilinu',
          fields: [{ key: 'periodSplitDate', span: 12 }],
        },
        {
          key: 'vehicleLookup',
          title: 'Gögn sótt frá Samgöngustofu',
          description:
            'Uppfletting eftir bílnúmeri sækir sjálfkrafa skráða þyngd og losun. Þú getur líka slegið inn eigin forsendur.',
          fields: [
            {
              key: 'licensePlate',
              span: 5,
              disabledWhen: { field: 'manualWeightEntry', equals: 'true' },
            },
            { key: 'manualWeightEntry', span: 12 },
          ],
        },
        {
          key: 'manualEntry',
          title: 'Slá inn forsendur',
          description:
            'Skráð þyngd án farms, ökumanns eða farþega. Til eru tveir staðlar fyrir mælingu á CO2 losun og það getur verið mismunandi milli ökutækja hvaða gildi eru skráð.',
          fields: [
            {
              key: 'manualCurbWeight',
              span: 5,
              visibleWhen: { field: 'manualWeightEntry', equals: 'true' },
            },
            {
              key: 'manualNedcValue',
              span: 4,
              visibleWhen: { field: 'manualWeightEntry', equals: 'true' },
            },
            {
              key: 'manualWltpValue',
              span: 4,
              visibleWhen: { field: 'manualWeightEntry', equals: 'true' },
            },
          ],
        },
      ],
    },
  },
} as unknown as ICalculator

const vehicleBenefitEntry: ICalculator = {
  sys: {
    id: 'mock-vehicle-benefit',
    type: 'Entry',
    createdAt: '',
    updatedAt: '',
    locale: 'is',
    contentType: {
      sys: { id: 'calculator', linkType: 'ContentType', type: 'Link' },
    },
  },
  fields: {
    title: 'Bifreiðahlunnindi (mock)',
    calculatorType: 'vehicleBenefit',
    translationNamespace: {
      fields: {
        strings: {
          'web.rsk.calculatorSlice:title': 'Reiknivél bifreiðahlunninda',
          'web.rsk.calculatorSlice:disclaimer':
            'Niðurstöður eru til viðmiðunar og eru ekki bindandi.',
        },
      },
    },
    configJson: {
      calculatorType: 'vehicleBenefit',
      sections: [
        {
          key: 'carType',
          title: 'Tegund bíls',
          fields: [{ key: 'isElectric', span: 7 }],
        },
        {
          key: 'purchase',
          title: 'Kaupár og kaupverð',
          fields: [
            { key: 'purchaseYear', span: 5 },
            { key: 'purchasePrice', span: 7 },
          ],
        },
        {
          key: 'operatingCosts',
          title: 'Fyrirkomulag rekstrar',
          description:
            'Með rekstrarkostnaði er átt við eldsneyti, smurningu, þrif og þess háttar. En ekki viðgerðir, varahluti, hjólbarða og tryggingar.',
          fields: [
            { key: 'employeePaysRunningCosts', span: 12 },
            { key: 'employeePaysCharging', span: 12 },
          ],
        },
      ],
    },
  },
} as unknown as ICalculator

export const mockCalculatorEntries: ICalculator[] = [
  withholdingTaxOnWagesEntry,
  childBenefitEntry,
  vehicleTaxEntry,
  vehicleBenefitEntry,
]
