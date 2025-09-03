import { HealthQuestionnaire } from '@island.is/portals/my-pages/core'

export const completeLSHQuestionnaire: HealthQuestionnaire = {
  __typename: 'HealthQuestionnaire',
  org: 'Landlæknir (LSH)',
  id: 'lsh-complete-health-questionnaire-2025',
  title: 'Heilsufarsupplýsingar vegna komu á Landspítala',
  description:
    'Með þessum spurningalistum viljum við auka virðingu fyrir tíma þínum og starfsfólks okkar, auka skilvirkni við undirbúning og minnka endurtekningar. Enginn þekkir betur þína sögu en þú sjálf/-ur.\\nVið biðjum þig vinsamlegast að svara eftir bestu getu og senda okkur listann til baka innan fjögurra daga.\\nSvörin vistast í sjúkraskrá þinni og eru meðhöndluð sem trúnaðarmál ',
  guid: '8a3cf4aa-2f95-4e55-a686-971f3d9c9f8e',
  questions: [
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36866',
      label: 'Hvernig metur þú heilsufar þitt?',
      display: 'optional',
      answerOptions: [
        {
          id: 'mj-g-hraust-ur',
          label: 'Mjög hraust/-ur',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hraust-ur',
          label: 'Hraust/-ur',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'heilsuveil-veill',
          label: 'Heilsuveil/-veill',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'mj-g-heilsuveil-veill',
          label: 'Mjög heilsuveil/-veill',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39695',
      label: 'Hefurðu dvalið á spítala erlendis síðastliðna 6 mánuði?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerNumber',
      id: 'Height',
      label: 'Hæð',
      display: 'optional',
      min: undefined,
      max: undefined,
      step: 1,
      unit: 'cm',
    },
    {
      __typename: 'HealthQuestionnaireAnswerNumber',
      id: 'Weight',
      label: 'Þyngd',
      display: 'optional',
      min: undefined,
      max: undefined,
      step: 0.1,
      unit: 'kg',
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36815',
      label:
        'Hefur þú lést s.l. 6 mánuði án þess að ætla þér það? (Meira en 5% af þyngd þinni, dæmi 3kg ef 60kg, 4kg ef 80kg, 5kg ef 100kg)',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36816',
      label: 'Munnur, kok og hálshryggur',
      display: 'optional',
      answerOptions: [
        {
          id: 'e-lilegt-e-a-n-athugasemda',
          label: 'Eðlilegt eða án athugasemda',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'erfi-leikar-me-a-opna-munninn-gapa',
          label: 'Erfiðleikar með að opna munninn/gapa',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'g-m-vandam-l-klofinn-g-mur-e-a-anna',
          label: 'Góm vandamál (klofinn gómur eða annað)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'kyngingar-r-ugleikar',
          label: 'Kyngingarörðugleikar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'skert-hreyfigeta-h-lshryggur',
          label: 'Skert hreyfigeta  (hálshryggur)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36817',
      label: 'Tennur',
      display: 'optional',
      answerOptions: [
        {
          id: 'lagi',
          label: 'Í lagi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'laus-g-mur-efri',
          label: 'Laus gómur (efri)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'laus-g-mur-ne-ri',
          label: 'Laus gómur (neðri)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'laus-g-mur-b-i-efri-og-ne-ri-br-br-r-me-festingum',
          label: 'Laus gómur (bæði efri og neðri):Brú/brýr með festingum',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'implant-impl-nt',
          label: 'Implant/implönt',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist47830',
      label: 'Sjón',
      display: 'optional',
      answerOptions: [
        {
          id: 'e-lileg-e-a-n-athugasemda',
          label: 'Eðlileg eða án athugasemda',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'nota-gleraugu',
          label: 'Nota gleraugu',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hamlandi-sj-nsker-ing',
          label: 'Hamlandi sjónskerðing',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'l-gblinda',
          label: 'Lögblinda',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist47831',
      label: 'Heyrn',
      display: 'optional',
      answerOptions: [
        {
          id: 'e-lileg-e-a-n-athugasemda',
          label: 'Eðlileg eða án athugasemda',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'nota-heyrnart-ki',
          label: 'Nota heyrnartæki',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'heyrnarleysi',
          label: 'Heyrnarleysi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist38491',
      label: 'Húð',
      display: 'optional',
      answerOptions: [
        {
          id: 'heilbrig-h',
          label: 'Heilbrigð húð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'exem',
          label: 'Exem',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 's-r',
          label: 'Sár',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'bruni',
          label: 'Bruni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text38492',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist38491'],
      visibilityCondition: "isSelected('Annað',@@@Checklist38491)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36818',
      label: 'Ertu þunguð?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ekki-vi',
          label: 'Á ekki við',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36819',
      label: 'Hefur þú gengið með barn/börn?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ekki-vi',
          label: 'Á ekki við',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text47840',
      label: 'Fjöldi barna?',
      display: 'optional',
      dependsOn: ['RadioGroup36819'],
      visibilityCondition: "isSelected('Já',@@@RadioGroup36819)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist38488',
      label: 'Fæðingarmáti',
      display: 'optional',
      dependsOn: ['RadioGroup36819'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36819')",
      answerOptions: [
        {
          id: 'um-f-ingarveg',
          label: 'Um fæðingarveg',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'me-keisaraskur-i',
          label: 'Með keisaraskurði',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36941',
      label: 'Ert þú líffæraþegi/með ígrætt líffæri?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36906',
      label: 'Hvaða líffæri?',
      display: 'optional',
      dependsOn: ['RadioGroup36941'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36941')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup49785',
      label:
        'Ertu með heilsufarsvandamál sem takmarka dagleg verk og athafnir?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup49786',
      label:
        'Ertu með heilsufarsvandamál sem valda því að þú þarft að halda kyrru fyrir heima?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup48702',
      label: 'Hversu oft á síðustu 4 vikum fannstu fyrir þreytu/orkuleysi?',
      display: 'optional',
      answerOptions: [
        {
          id: 'st-ugt',
          label: 'Stöðugt',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'oft',
          label: 'Oft',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'stundum',
          label: 'Stundum',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'sjaldan',
          label: 'Sjaldan',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'aldrei',
          label: 'Aldrei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup49787',
      label: 'Hreyfir þú þig reglulega?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36835',
      label: 'Hversu mikið álag þolir þú?',
      sublabel:
        'Lágmarks áreynsla: Klára athafnir daglegs lífs. Geng inni og úti ca 200 m á 3 til 4 mín\\nMiðlungs áreynsla: Geng stiga eina hæð án vandamála. Geng á jafnsléttu 6 km/klst\\nMikil áreynsla: Syndi og hjóla. Þung líkamleg vinna',
      display: 'optional',
      answerOptions: [
        {
          id: 'l-gmarks-reynsla-athafnir-daglegs-l-fs-geng-inni-og-ti-ca-200-m-undir-5-m-n',
          label:
            'Lágmarks áreynsla (Athafnir daglegs lífs. Geng inni og úti ca 200 m á undir 5 mín)',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'mi-lungs-reynsla-geng-stiga-eina-h-n-vandam-la-geng-jafnsl-ttu-6-km-klst',
          label:
            'Miðlungs áreynsla (Geng stiga eina hæð án vandamála. Geng á jafnsléttu 6 km/klst)',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'mikil-reynsla-syndi-og-hj-la-ung-l-kamleg-vinna',
          label: 'Mikil áreynsla (Syndi og hjóla. Þung líkamleg vinna)',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36836',
      label: 'Hvers vegna átt þú erfitt með hreyfingu?',
      display: 'optional',
      answerOptions: [
        {
          id: 'hjarta-og-asj-kd-mur',
          label: 'Hjarta- og æðasjúkdómur',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'lungnasj-kd-mur',
          label: 'Lungnasjúkdómur',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'sto-kerfi',
          label: 'Stoðkerfið',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text49780',
      label: 'Önnur ástæða, hver?',
      display: 'optional',
      dependsOn: ['RadioGroup36836'],
      visibilityCondition: "isSelected('anna','@@@RadioGroup36836')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup38490',
      label: 'Ertu með hreyfiskerðingu?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text38489',
      label: 'Hvert er vandamálið?',
      display: 'optional',
      dependsOn: ['RadioGroup38490'],
      visibilityCondition: "isSelected('j','@@@RadioGroup38490')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36837',
      label: 'Notar þú hjálpartæki? (t.d. hækjur, göngugrind, hjólastól)',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36838',
      label: 'Hvaða hjálpartæki?',
      display: 'optional',
      dependsOn: ['RadioGroup36837'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36837')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36842',
      label: 'Reykir þú?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36843',
      label: 'Hversu lengi hefur þú reykt?',
      display: 'optional',
      dependsOn: ['RadioGroup36842'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36842')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36844',
      label: 'Hversu mikið reykir þú á dag?',
      display: 'optional',
      dependsOn: ['RadioGroup36842'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36842')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36845',
      label: 'Hefur þú reykt?',
      display: 'optional',
      dependsOn: ['RadioGroup36842'],
      visibilityCondition: "isSelected('nei','@@@RadioGroup36842')",
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36846',
      label: 'Hvenær hættir þú að reykja?',
      display: 'optional',
      dependsOn: ['RadioGroup36845'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36845')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36847',
      label: 'Hversu mörg ár reyktir þú?',
      display: 'optional',
      dependsOn: ['RadioGroup36845'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36845')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36848',
      label: 'Hversu mikið reyktir þú daglega?',
      display: 'optional',
      dependsOn: ['RadioGroup36845'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36845')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup47841',
      label: 'Notar þú munntóbak eða neftóbak?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36850',
      label: 'Veipar þú?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36851',
      label: 'Drekkur þú áfengi? ',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist47836',
      label:
        'Hve mikið áfengi drekkur þú að jafnaði á viku? (ein eining = 1 vínglas/1 bjór/einfaldur sterkur drykkur)',
      display: 'optional',
      dependsOn: ['RadioGroup36851'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36851')",
      answerOptions: [
        {
          id: '0-6-einingar-viku',
          label: '0-6 einingar á viku',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: '7-13-einingar-viku',
          label: '7-13 einingar á viku',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: '14-21-einingu-viku',
          label: '14-21 einingu á viku',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'meira-en-21-einingu-viku',
          label: 'meira en 21 einingu á viku',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36852',
      label: 'Hefur þú neytt einhverra ávanabindandi lyfja?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36853',
      label: 'Hvaða ávanabindandi lyfja hefur þú neytt?',
      display: 'optional',
      dependsOn: ['RadioGroup36852'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36852')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36824',
      label: 'Ertu með lyfjaofnæmi?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36825',
      label: 'Hvaða lyfi/lyfjum hefur þú ofnæmi fyrir?',
      display: 'optional',
      dependsOn: ['RadioGroup36824'],
      visibilityCondition: "'j' == '@@@RadioGroup36824'",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36940',
      label: 'Lyfjaofnæmi',
      display: 'optional',
      dependsOn: ['RadioGroup36824'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36824')",
      answerOptions: [
        {
          id: 'lyfjaofn-mi-sta-fest-me-ranns-kn',
          label: 'Lyfjaofnæmi staðfest með rannsókn',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'lyfjaofn-mi-ekki-sta-fest-me-ranns-kn-en-sterkur-grunur',
          label: 'Lyfjaofnæmi ekki staðfest með rannsókn en sterkur grunur',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup47842',
      label: 'Ertu með annars konar ofnæmi?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36832',
      label: 'Hvers konar ofnæmi?',
      display: 'optional',
      dependsOn: ['RadioGroup47842'],
      visibilityCondition: "'j' == '@@@RadioGroup47842'",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36821',
      label: 'Tekur þú lyfseðilsskyld lyf?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36822',
      label: 'Hvaða lyf?',
      display: 'optional',
      dependsOn: ['RadioGroup36821'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36821')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36823',
      label: 'Ertu að taka blóðþynningarlyf önnur en hjartamagnýl?',
      display: 'optional',
      dependsOn: ['RadioGroup36821'],
      visibilityCondition: "'j' == '@@@RadioGroup36821'",
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36827',
      label: 'Ertu í lyfjaskömmtun?',
      display: 'optional',
      dependsOn: ['RadioGroup36821'],
      visibilityCondition: "'j' == '@@@RadioGroup36821'",
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36830',
      label: 'Hvaða apótek sér um lyfjaskömmtunina (nafn og staðsetning)?',
      display: 'optional',
      dependsOn: ['RadioGroup36827'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36827')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup47832',
      label: 'Mataræði',
      display: 'optional',
      answerOptions: [
        {
          id: 'almennt-f-i',
          label: 'Almennt fæði',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'maukf-i',
          label: 'Maukfæði',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'flj-tandi-f-i',
          label: 'Fljótandi fæði',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna-s-rf-i',
          label: 'Annað sérfæði',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text47833',
      label: 'Annað sérfæði',
      display: 'optional',
      dependsOn: ['RadioGroup47832'],
      visibilityCondition: "isSelected('anna-s-rf-i','@@@RadioGroup47832')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup47834',
      label: 'Fæðuóþol/ofnæmi',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text47835',
      label: 'Hvaða fæðuóþol/ofnæmi?',
      display: 'optional',
      dependsOn: ['RadioGroup47834'],
      visibilityCondition: "'j' == '@@@RadioGroup47834'",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36839',
      label: 'Tekur þú fæðubótaefni reglulega?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36840',
      label: 'Hvaða fæðubótaefni tekur þú inn reglulega?',
      display: 'optional',
      dependsOn: ['RadioGroup36839'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36839')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36841',
      label: 'Tekur þú lýsi?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39699',
      label: 'Ertu í reglulegu eftirliti hjá sérfræðilækni?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36855',
      label: 'Eftirlit hjá sérfræðilækni - merktu við það sem á við',
      display: 'optional',
      dependsOn: ['RadioGroup39699'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39699')",
      answerOptions: [
        {
          id: 'augnl-kni',
          label: 'Augnlækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ge-l-kni',
          label: 'Geðlækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hjartal-kni',
          label: 'Hjartalækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'innkirtlal-kni-t-d-sykurs-ki-skjaldkirtla-n-rnahettu',
          label: 'Innkirtlalækni (t.d. sykursýki/skjaldkirtla/nýrnahettu)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'krabbameinsl-kni',
          label: 'Krabbameinslækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'lungnal-kni',
          label: 'Lungnalækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'meltingal-kni',
          label: 'Meltingalækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'n-rnal-kni',
          label: 'Nýrnalækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'taugal-kni',
          label: 'Taugalækni',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna-en-er-nefnt-h-r-a-ofan',
          label: 'Annað en er nefnt hér að ofan',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36857',
      label: 'Hefur þú verið svæfð/ur?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36858',
      label: 'Voru einhver vandamál tengd svæfingunni?',
      display: 'optional',
      dependsOn: ['RadioGroup36857'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36857')",
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j-ndunarvegavandam-l',
          label: 'Já, öndunarvegavandamál',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j-aa-gengi',
          label: 'Já, æðaaðgengi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j-gle-i-eftir-a-ger',
          label: 'Já, ógleði eftir aðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j-illkynja-h-hiti-malignant-hyperthermia',
          label: 'Já,illkynja háhiti (Malignant hyperthermia)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup37717',
      label: 'Hefur þú farið i skurðaðgerð?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36861',
      label: 'Hvað af eftirfarandi skurðaðgerðum hefur þú farið í?',
      display: 'optional',
      dependsOn: ['RadioGroup37717'],
      visibilityCondition: "isSelected('j','@@@RadioGroup37717')",
      answerOptions: [
        {
          id: 'baka-ger',
          label: 'Bakaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'heilaa-ger',
          label: 'Heilaaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hjartaa-ger',
          label: 'Hjartaaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'keisaraskur-a-ger',
          label: 'Keisaraskurðaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'krans-av-kkun',
          label: 'Kransæðavíkkun',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'kvensj-kd-maa-ger',
          label: 'Kvensjúkdómaaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'kvi-arholsa-ger',
          label: 'Kviðarholsaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'li-skiptaa-ger',
          label: 'Liðskiptaaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'lungnaa-ger',
          label: 'Lungnaaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'n-rna-vagf-raa-ger',
          label: 'Nýrna-/þvagfæraaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'skjaldkirtilsa-ger',
          label: 'Skjaldkirtilsaðgerð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36862',
      label: 'Aðrar aðgerðir?',
      display: 'optional',
      dependsOn: ['Checklist36861'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36861)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36859',
      label: 'Hefur þú fengið mænudeyfingu?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'viss',
          label: 'Óviss',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36860',
      label: 'Manstu eftir vandamálum tengdum mænudeyfingum?',
      display: 'optional',
      dependsOn: ['RadioGroup36859'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36859')",
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'viss',
          label: 'Óviss',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text39609',
      label: 'Ef já, hvað?',
      display: 'optional',
      dependsOn: ['RadioGroup36860'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36860')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36863',
      label: 'Hefur þú fengið blóðgjöf?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'viss',
          label: 'Óviss',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup49784',
      label: 'Ef nauðsyn krefur ert þú samþykk/ur blóðgjöf?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39649',
      label: 'Geðræn vandamál',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist47837',
      label: 'Geðræn vandamál - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39649'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39649')",
      answerOptions: [
        {
          id: 'athyglisbrestur-adhd',
          label: 'Athyglisbrestur/ADHD',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'depur-unglyndi',
          label: 'Depurð/þunglyndi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'f-knivandi',
          label: 'Fíknivandi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ge-hvarfas-ki',
          label: 'Geðhvarfasýki',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'kv-i',
          label: 'Kvíði',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'svefnvandam-l',
          label: 'Svefnvandamál',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36869',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist47837'],
      visibilityCondition: "isSelected('Annað',@@@Checklist47837)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39651',
      label: 'Lungna- og öndunarfærasjúkdómar ',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist47838',
      label: 'Lungna og öndunarsjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39651'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39651')",
      answerOptions: [
        {
          id: 'astmi',
          label: 'Astmi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hrotur',
          label: 'Hrotur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'k-fisvefn',
          label: 'Kæfisvefn',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'k-fisvefnsv-l-heima',
          label: 'Kæfisvefnsvél heima',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'lungna-emba',
          label: 'Lungnaþemba',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'm-i',
          label: 'Mæði',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'saga-um-berkla',
          label: 'Saga um berkla',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 't-ar-lungnab-lgur',
          label: 'Tíðar lungnabólgur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36875',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist47838'],
      visibilityCondition: "isSelected('anna','@@@Checklist47838')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39650',
      label: 'Miðtaugakerfis- og/eða hrörnunarsjúkdómar',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36871',
      label:
        'Miðtaugakerfis- og/eða hrörnunarsjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39650'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39650')",
      answerOptions: [
        {
          id: 'alzheimer',
          label: 'Alzheimer',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'flogaveiki',
          label: 'Flogaveiki',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'jafnv-gistruflun-svimi',
          label: 'Jafnvægistruflun/Svimi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'l-mun-helftarl-mun',
          label: 'Lömun/Helftarlömun',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'minnistruflanir',
          label: 'Minnistruflanir',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'mnd-motor-neuron-disease',
          label: 'MND (motor neuron disease)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ms-multiple-sclerosis',
          label: 'MS (multiple sclerosis)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'muscular-dystrophy',
          label: 'Muscular dystrophy',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'm-nuska-i',
          label: 'Mænuskaði',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'parkinsons-sj-kd-mur',
          label: 'Parkinsons sjúkdómur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ekktur-ag-ll-heila',
          label: 'Þekktur æðagúll í heila',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'a-fall-bl-tappi-til-heila-heilabl-ing',
          label: 'Æðaáfall (blóðtappi til heila/heilablæðing)',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36872',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36871'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36871)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39652',
      label: 'Hjartasjúkdómar',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36877',
      label: 'Hjartasjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39652'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39652')",
      answerOptions: [
        {
          id: 'brj-stverkir-vi-reynslu',
          label: 'Brjóstverkir við áreynslu',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'fari-brennslu-lei-slubrautum-hjarta',
          label: 'Farið í brennslu á leiðslubrautum í hjarta',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'gangr-ur-bjargr-ur',
          label: 'Gangráður/bjargráður',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'h-r-stingur',
          label: 'Háþrýstingur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hjartabilun',
          label: 'Hjartabilun',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hjartalokusj-kd-mur',
          label: 'Hjartalokusjúkdómur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hjartsl-ttar-regla',
          label: 'Hjartsláttaróregla',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'krans-asj-kd-mur',
          label: 'Kransæðasjúkdómur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'me-f-ddir-hjartagallar',
          label: 'Meðfæddir hjartagallar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'm-i',
          label: 'Mæði',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36878',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36877'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36877)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39653',
      label: 'Æðasjúkdómar',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36880',
      label: 'Æðasjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39653'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39653')",
      answerOptions: [
        {
          id: 'bl-ar-fjarl-g-ar-r-f-tleggjum',
          label: 'Bláæðar fjarlægðar úr fótleggjum',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'brj-sthol-s',
          label: 'Brjósthol/ósæð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'f-tleggir',
          label: 'Fótleggir',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'h-ls',
          label: 'Háls',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'h-fu',
          label: 'Höfuð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'kvi-arhol-s-kvi-arholsl-ff-ra-ar',
          label: 'Kviðarhol - ósæð/kviðarholslíffæraæðar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ahn-tar',
          label: 'Æðahnútar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36881',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36880'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36880)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39654',
      label: 'Meltingasjúkdómar',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36883',
      label: 'Meltingarsjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39654'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39654')",
      answerOptions: [
        {
          id: 'bakfl-i',
          label: 'Bakflæði',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'chrons-colitis-ulcerosa',
          label: 'Chrons/Colitis ulcerosa',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'h-g-atreg-a',
          label: 'Hægðatregða',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'lifrar-gall-brissj-kd-mur',
          label: 'Lifrar-/gall-/brissjúkdómur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'magab-lgur-magas-r',
          label: 'Magabólgur/magasár',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36884',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36883'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36883)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39655',
      label: 'Kvensjúkdómar ',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'ekki-vi',
          label: 'Á ekki við',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36886',
      label: 'Kvensjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39655'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39655')",
      answerOptions: [
        {
          id: 'bl-ingarvandam-l',
          label: 'Blæðingarvandamál',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'bl-ru-leg-enda-armssig',
          label: 'Blöðru-/leg-/endaþarmssig',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'endometriosa',
          label: 'Endometriosa',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36887',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36886'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36886)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39688',
      label: 'Þvag- og kynfærasjúkdómar',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36889',
      label: 'Þvag- og kynfærasjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39688'],
      visibilityCondition: "'j' == '@@@RadioGroup39688'",
      answerOptions: [
        {
          id: 'bl-kvi-skilun',
          label: 'Blóð-/kviðskilun',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'bl-ruh-lskirtils-vandam-l',
          label: 'Blöðruhálskirtils vandamál',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'endurteknar-vagf-ras-kingar',
          label: 'Endurteknar þvagfærasýkingar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'n-rnabilun',
          label: 'Nýrnabilun',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'n-rnasj-kd-mar',
          label: 'Nýrnasjúkdómar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'n-rnasteinar',
          label: 'Nýrnasteinar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'vagbl-ru-vandam-l',
          label: 'Þvagblöðru vandamál',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'vagleki',
          label: 'Þvagleki',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'vagtreg-a',
          label: 'Þvagtregða',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36890',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36889'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36889)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39689',
      label: 'Blóðsjúkdómar ',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36892',
      label: 'Blóðsjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39689'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39689')",
      answerOptions: [
        {
          id: 'bl-leysi',
          label: 'Blóðleysi',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'bl-sega-vandam-l',
          label: 'Blóðsega vandamál',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'bl-storku-vandam-l',
          label: 'Blóðstorku vandamál',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j-rnskortur',
          label: 'Járnskortur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36893',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36892'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36892)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39690',
      label: 'Innkirtlasjúkdómar ',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já ',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36895',
      label: 'Innkirtlasjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39690'],
      visibilityCondition: "isSelected('Já','@@@RadioGroup39690')",
      answerOptions: [
        {
          id: 'n-rnahettusj-kd-mur',
          label: 'Nýrnahettusjúkdómur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'skjaldkirtilssj-kd-mur',
          label: 'Skjaldkirtilssjúkdómur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'sykurs-ki',
          label: 'Sykursýki',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36896',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36895'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36895)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39691',
      label: 'Stoðkerfissjúkdómar',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36898',
      label: 'Stoðkerfissjúkdómar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39691'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39691')",
      answerOptions: [
        {
          id: 'slitgigt',
          label: 'Slitgigt',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'sterasprautur-li-s-l-3-m-nu-i',
          label: 'Sterasprautur í lið s.l. 3 mánuði',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36899',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36898'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36898)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup39692',
      label: 'Sýkingar ',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36902',
      label: 'Sýkingar - merktu við það sem á við:',
      display: 'optional',
      dependsOn: ['RadioGroup39692'],
      visibilityCondition: "isSelected('j','@@@RadioGroup39692')",
      answerOptions: [
        {
          id: 'endurteknar-ndunarf-ras-kingar-s-astli-i-r',
          label: 'Endurteknar öndunarfærasýkingar síðastliðið ár',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'hiv-lifrarb-lga-c',
          label: 'HIV / lifrarbólga C',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'm-sa-esbl-vre',
          label: 'MÓSA/ESBL/VRE',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36903',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36902'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36902)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36934',
      label: 'Hefur þú greinst með krabbamein?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36909',
      label: 'Hvers konar krabbamein?',
      display: 'optional',
      dependsOn: ['RadioGroup36934'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36934')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup37718',
      label: 'Er þekkt fjölskyldusaga um krabbamein?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36911',
      label: 'Ertu með aðra sjúkdóma sem ekki hefur verið spurt um?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36912',
      label: 'Hvaða sjúkdóm/a?',
      display: 'optional',
      dependsOn: ['RadioGroup36911'],
      visibilityCondition: "isSelected('j','@@@RadioGroup36911')",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup36942',
      label: 'Býrðu ein/-n?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text47839',
      label: 'Með hverjum',
      display: 'optional',
      dependsOn: ['RadioGroup36942'],
      visibilityCondition: "isSelected('Nei',@@@RadioGroup36942)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup48703',
      label: 'Þarftu aðstoð við dagleg verk og athafnir?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerRadio',
      id: 'RadioGroup48704',
      label: 'Geturðu treyst á einhvern þér nákominn ef þörf krefur?',
      display: 'optional',
      answerOptions: [
        {
          id: 'nei',
          label: 'Nei',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'j',
          label: 'Já',
          type: 'radio',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist36808',
      label: 'Færðu utan að komandi stuðning inn á heimili þitt?',
      display: 'optional',
      answerOptions: [
        {
          id: 'heimsendan-mat',
          label: 'Heimsendan mat',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'a-sto-ttingja',
          label: 'Aðstoð ættingja',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'heimahj-krun',
          label: 'Heimahjúkrun',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'heimilisa-sto',
          label: 'Heimilisaðstoð',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text36809',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist36808'],
      visibilityCondition: "isSelected('Annað',@@@Checklist36808)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist38586',
      label: 'Atvinna',
      display: 'optional',
      answerOptions: [
        {
          id: 'er-vinnu',
          label: 'Er í vinnu',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'er-sk-la',
          label: 'Er í skóla',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'er-ryrki',
          label: 'Er öryrki',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'er-h-tt-ur-a-vinna-vegna-aldurs',
          label: 'Er hætt/-ur að vinna vegna aldurs',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'anna',
          label: 'Annað',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
    {
      __typename: 'HealthQuestionnaireAnswerTextArea',
      id: 'Text38587',
      label: 'Hvað annað?',
      display: 'optional',
      dependsOn: ['Checklist38586'],
      visibilityCondition: "isSelected('Annað',@@@Checklist38586)",
    },
    {
      __typename: 'HealthQuestionnaireAnswerMultiple',
      id: 'Checklist39697',
      label: 'Hver fyllti út spurningalistann/eyðublaðið?',
      display: 'optional',
      answerOptions: [
        {
          id: 'g-sj-lf-ur',
          label: 'Ég sjálf/-ur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'forr-ama-ur',
          label: 'Forráðamaður',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'maki-vinur-fj-lskyldume-limur',
          label: 'Maki/vinur/fjölskyldumeðlimur',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'heilbrig-isstarfsma-ur',
          label: 'Heilbrigðisstarfsmaður',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
        {
          id: 'annar',
          label: 'Annar',
          type: 'checkbox',
          value: {
            extraQuestions: [],
          },
        },
      ],
    },
  ],
}
