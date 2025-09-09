import { QuestionDisplayType } from '../models/question.model'
import { QuestionnairesStatusEnum } from '../models/questionnaires.model'

export const data = {
  questionnaires: [
    {
      id: '8a3cf4aa-2f95-4e55-a686-971f3d9c9f8e',
      title: 'Heilsufarsupplýsingar vegna komu á Landspítala',
      description:
        'Með þessum spurningalistum viljum við auka virðingu fyrir tíma þínum og starfsfólks okkar, auka skilvirkni við undirbúning og minnka endurtekningar. Enginn þekkir betur þína sögu en þú sjálf/-ur.\\nVið biðjum þig vinsamlegast að svara eftir bestu getu og senda okkur listann til baka innan fjögurra daga.\\nSvörin vistast í sjúkraskrá þinni og eru meðhöndluð sem trúnaðarmál ',
      sentDate: '2025-09-09T12:37:42.666Z',
      status: QuestionnairesStatusEnum.notAnswered,
      organization: 'Landspítali',
      questions: [
        {
          id: 'RadioGroup36866',
          label: 'Hvernig metur þú heilsufar þitt?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36866_answer',
            label: 'Hvernig metur þú heilsufar þitt?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36866_type',
              label: 'Hvernig metur þú heilsufar þitt?',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög hraust/-ur',
                'Hraust/-ur',
                'Heilsuveil/-veill',
                'Mjög heilsuveil/-veill',
              ],
            },
          },
        },
        {
          id: 'RadioGroup39695',
          label: 'Hefurðu dvalið á spítala erlendis síðastliðna 6 mánuði?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39695_answer',
            label: 'Hefurðu dvalið á spítala erlendis síðastliðna 6 mánuði?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39695_type',
              label: 'Hefurðu dvalið á spítala erlendis síðastliðna 6 mánuði?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Height',
          label: 'Hæð',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Height_answer',
            label: 'Hæð',
            type: {
              __typename: 'HealthQuestionnaireAnswerNumber' as const,
              id: 'Height_type',
              label: 'Hæð',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'Weight',
          label: 'Þyngd',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Weight_answer',
            label: 'Þyngd',
            type: {
              __typename: 'HealthQuestionnaireAnswerNumber' as const,
              id: 'Weight_type',
              label: 'Þyngd',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'RadioGroup36815',
          label:
            'Hefur þú lést s.l. 6 mánuði án þess að ætla þér það? (Meira en 5% af þyngd þinni, dæmi 3kg ef 60kg, 4kg ef 80kg, 5kg ef 100kg)',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36815_answer',
            label:
              'Hefur þú lést s.l. 6 mánuði án þess að ætla þér það? (Meira en 5% af þyngd þinni, dæmi 3kg ef 60kg, 4kg ef 80kg, 5kg ef 100kg)',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36815_type',
              label:
                'Hefur þú lést s.l. 6 mánuði án þess að ætla þér það? (Meira en 5% af þyngd þinni, dæmi 3kg ef 60kg, 4kg ef 80kg, 5kg ef 100kg)',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36816',
          label: 'Munnur, kok og hálshryggur',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36816_answer',
            label: 'Munnur, kok og hálshryggur',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36816_type',
              label: 'Munnur, kok og hálshryggur',
              display: QuestionDisplayType.optional,
              options: [
                'Eðlilegt eða án athugasemda',
                'Erfiðleikar með að opna munninn/gapa',
                'Góm vandamál (klofinn gómur eða annað)',
                'Kyngingarörðugleikar',
                'Skert hreyfigeta  (hálshryggur)',
              ],
            },
          },
        },
        {
          id: 'Checklist36817',
          label: 'Tennur',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36817_answer',
            label: 'Tennur',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36817_type',
              label: 'Tennur',
              display: QuestionDisplayType.optional,
              options: [
                'Í lagi',
                'Laus gómur (efri)',
                'Laus gómur (neðri)',
                'Laus gómur (bæði efri og neðri):Brú/brýr með festingum',
                'Implant/implönt',
              ],
            },
          },
        },
        {
          id: 'Checklist47830',
          label: 'Sjón',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist47830_answer',
            label: 'Sjón',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist47830_type',
              label: 'Sjón',
              display: QuestionDisplayType.optional,
              options: [
                'Eðlileg eða án athugasemda',
                'Nota gleraugu',
                'Hamlandi sjónskerðing',
                'Lögblinda',
              ],
            },
          },
        },
        {
          id: 'Checklist47831',
          label: 'Heyrn',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist47831_answer',
            label: 'Heyrn',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist47831_type',
              label: 'Heyrn',
              display: QuestionDisplayType.optional,
              options: [
                'Eðlileg eða án athugasemda',
                'Nota heyrnartæki',
                'Heyrnarleysi',
              ],
            },
          },
        },
        {
          id: 'Checklist38491',
          label: 'Húð',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist38491_answer',
            label: 'Húð',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist38491_type',
              label: 'Húð',
              display: QuestionDisplayType.optional,
              options: ['Heilbrigð húð', 'Exem', 'Sár', 'Bruni', 'Annað'],
            },
          },
        },
        {
          id: 'Text38492',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text38492_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text38492_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist38491'],
          visibilityCondition:
            '{"questionId":"Checklist38491","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36818',
          label: 'Ertu þunguð?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36818_answer',
            label: 'Ertu þunguð?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36818_type',
              label: 'Ertu þunguð?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já', 'Á ekki við'],
            },
          },
        },
        {
          id: 'RadioGroup36819',
          label: 'Hefur þú gengið með barn/börn?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36819_answer',
            label: 'Hefur þú gengið með barn/börn?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36819_type',
              label: 'Hefur þú gengið með barn/börn?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já', 'Á ekki við'],
            },
          },
        },
        {
          id: 'Text47840',
          label: 'Fjöldi barna?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text47840_answer',
            label: 'Fjöldi barna?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text47840_type',
              label: 'Fjöldi barna?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36819'],
          visibilityCondition:
            '{"questionId":"RadioGroup36819","operator":"equals","value":"Já"}',
        },
        {
          id: 'Checklist38488',
          label: 'Fæðingarmáti',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist38488_answer',
            label: 'Fæðingarmáti',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist38488_type',
              label: 'Fæðingarmáti',
              display: QuestionDisplayType.optional,
              options: ['Um fæðingarveg', 'Með keisaraskurði'],
            },
          },
          dependsOn: ['RadioGroup36819'],
          visibilityCondition:
            '{"questionId":"RadioGroup36819","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36941',
          label: 'Ert þú líffæraþegi/með ígrætt líffæri?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36941_answer',
            label: 'Ert þú líffæraþegi/með ígrætt líffæri?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36941_type',
              label: 'Ert þú líffæraþegi/með ígrætt líffæri?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36906',
          label: 'Hvaða líffæri?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36906_answer',
            label: 'Hvaða líffæri?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36906_type',
              label: 'Hvaða líffæri?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36941'],
          visibilityCondition:
            '{"questionId":"RadioGroup36941","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup49785',
          label:
            'Ertu með heilsufarsvandamál sem takmarka dagleg verk og athafnir?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup49785_answer',
            label:
              'Ertu með heilsufarsvandamál sem takmarka dagleg verk og athafnir?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup49785_type',
              label:
                'Ertu með heilsufarsvandamál sem takmarka dagleg verk og athafnir?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup49786',
          label:
            'Ertu með heilsufarsvandamál sem valda því að þú þarft að halda kyrru fyrir heima?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup49786_answer',
            label:
              'Ertu með heilsufarsvandamál sem valda því að þú þarft að halda kyrru fyrir heima?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup49786_type',
              label:
                'Ertu með heilsufarsvandamál sem valda því að þú þarft að halda kyrru fyrir heima?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup48702',
          label: 'Hversu oft á síðustu 4 vikum fannstu fyrir þreytu/orkuleysi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup48702_answer',
            label:
              'Hversu oft á síðustu 4 vikum fannstu fyrir þreytu/orkuleysi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup48702_type',
              label:
                'Hversu oft á síðustu 4 vikum fannstu fyrir þreytu/orkuleysi?',
              display: QuestionDisplayType.optional,
              options: ['Stöðugt', 'Oft', 'Stundum', 'Sjaldan', 'Aldrei'],
            },
          },
          dependsOn: ['RadioGroup49786'],
          visibilityCondition:
            '{"questionId":"RadioGroup49786","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup49787',
          label: 'Hreyfir þú þig reglulega?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup49787_answer',
            label: 'Hreyfir þú þig reglulega?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup49787_type',
              label: 'Hreyfir þú þig reglulega?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup36835',
          label: 'Hversu mikið álag þolir þú?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36835_answer',
            label: 'Hversu mikið álag þolir þú?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36835_type',
              label: 'Hversu mikið álag þolir þú?',
              display: QuestionDisplayType.optional,
              options: [
                'Lágmarks áreynsla (Athafnir daglegs lífs. Geng inni og úti ca 200 m á undir 5 mín)',
                'Miðlungs áreynsla (Geng stiga eina hæð án vandamála. Geng á jafnsléttu 6 km/klst)',
                'Mikil áreynsla (Syndi og hjóla. Þung líkamleg vinna)',
              ],
            },
          },
          dependsOn: ['RadioGroup49787'],
          visibilityCondition:
            '{"questionId":"RadioGroup49787","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36836',
          label: 'Hvers vegna átt þú erfitt með hreyfingu?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36836_answer',
            label: 'Hvers vegna átt þú erfitt með hreyfingu?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36836_type',
              label: 'Hvers vegna átt þú erfitt með hreyfingu?',
              display: QuestionDisplayType.optional,
              options: [
                'Hjarta- og æðasjúkdómur',
                'Lungnasjúkdómur',
                'Stoðkerfið',
                'Annað',
              ],
            },
          },
        },
        {
          id: 'Text49780',
          label: 'Önnur ástæða, hver?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text49780_answer',
            label: 'Önnur ástæða, hver?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text49780_type',
              label: 'Önnur ástæða, hver?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36836'],
          visibilityCondition:
            '{"questionId":"RadioGroup36836","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup38490',
          label: 'Ertu með hreyfiskerðingu?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup38490_answer',
            label: 'Ertu með hreyfiskerðingu?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup38490_type',
              label: 'Ertu með hreyfiskerðingu?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text38489',
          label: 'Hvert er vandamálið?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text38489_answer',
            label: 'Hvert er vandamálið?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text38489_type',
              label: 'Hvert er vandamálið?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup38490'],
          visibilityCondition:
            '{"questionId":"RadioGroup38490","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36837',
          label: 'Notar þú hjálpartæki? (t.d. hækjur, göngugrind, hjólastól)',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36837_answer',
            label: 'Notar þú hjálpartæki? (t.d. hækjur, göngugrind, hjólastól)',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36837_type',
              label:
                'Notar þú hjálpartæki? (t.d. hækjur, göngugrind, hjólastól)',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36838',
          label: 'Hvaða hjálpartæki?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36838_answer',
            label: 'Hvaða hjálpartæki?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36838_type',
              label: 'Hvaða hjálpartæki?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36837'],
          visibilityCondition:
            '{"questionId":"RadioGroup36837","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36842',
          label: 'Reykir þú?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36842_answer',
            label: 'Reykir þú?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36842_type',
              label: 'Reykir þú?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36843',
          label: 'Hversu lengi hefur þú reykt?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36843_answer',
            label: 'Hversu lengi hefur þú reykt?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36843_type',
              label: 'Hversu lengi hefur þú reykt?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36842'],
          visibilityCondition:
            '{"questionId":"RadioGroup36842","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36844',
          label: 'Hversu mikið reykir þú á dag?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36844_answer',
            label: 'Hversu mikið reykir þú á dag?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36844_type',
              label: 'Hversu mikið reykir þú á dag?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36842'],
          visibilityCondition:
            '{"questionId":"RadioGroup36842","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36845',
          label: 'Hefur þú reykt?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36845_answer',
            label: 'Hefur þú reykt?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36845_type',
              label: 'Hefur þú reykt?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
          dependsOn: ['RadioGroup36842'],
          visibilityCondition:
            '{"questionId":"RadioGroup36842","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36846',
          label: 'Hvenær hættir þú að reykja?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36846_answer',
            label: 'Hvenær hættir þú að reykja?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36846_type',
              label: 'Hvenær hættir þú að reykja?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36845'],
          visibilityCondition:
            '{"questionId":"RadioGroup36845","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36847',
          label: 'Hversu mörg ár reyktir þú?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36847_answer',
            label: 'Hversu mörg ár reyktir þú?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36847_type',
              label: 'Hversu mörg ár reyktir þú?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36845'],
          visibilityCondition:
            '{"questionId":"RadioGroup36845","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36848',
          label: 'Hversu mikið reyktir þú daglega?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36848_answer',
            label: 'Hversu mikið reyktir þú daglega?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36848_type',
              label: 'Hversu mikið reyktir þú daglega?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36845'],
          visibilityCondition:
            '{"questionId":"RadioGroup36845","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup47841',
          label: 'Notar þú munntóbak eða neftóbak?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup47841_answer',
            label: 'Notar þú munntóbak eða neftóbak?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup47841_type',
              label: 'Notar þú munntóbak eða neftóbak?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup36850',
          label: 'Veipar þú?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36850_answer',
            label: 'Veipar þú?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36850_type',
              label: 'Veipar þú?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup36851',
          label: 'Drekkur þú áfengi? ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36851_answer',
            label: 'Drekkur þú áfengi? ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36851_type',
              label: 'Drekkur þú áfengi? ',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist47836',
          label:
            'Hve mikið áfengi drekkur þú að jafnaði á viku? (ein eining = 1 vínglas/1 bjór/einfaldur sterkur drykkur)',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist47836_answer',
            label:
              'Hve mikið áfengi drekkur þú að jafnaði á viku? (ein eining = 1 vínglas/1 bjór/einfaldur sterkur drykkur)',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist47836_type',
              label:
                'Hve mikið áfengi drekkur þú að jafnaði á viku? (ein eining = 1 vínglas/1 bjór/einfaldur sterkur drykkur)',
              display: QuestionDisplayType.optional,
              options: [
                '0-6 einingar á viku',
                '7-13 einingar á viku',
                '14-21 einingu á viku',
                'meira en 21 einingu á viku',
              ],
            },
          },
          dependsOn: ['RadioGroup36851'],
          visibilityCondition:
            '{"questionId":"RadioGroup36851","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36852',
          label: 'Hefur þú neytt einhverra ávanabindandi lyfja?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36852_answer',
            label: 'Hefur þú neytt einhverra ávanabindandi lyfja?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36852_type',
              label: 'Hefur þú neytt einhverra ávanabindandi lyfja?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36853',
          label: 'Hvaða ávanabindandi lyfja hefur þú neytt?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36853_answer',
            label: 'Hvaða ávanabindandi lyfja hefur þú neytt?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36853_type',
              label: 'Hvaða ávanabindandi lyfja hefur þú neytt?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36852'],
          visibilityCondition:
            '{"questionId":"RadioGroup36852","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36824',
          label: 'Ertu með lyfjaofnæmi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36824_answer',
            label: 'Ertu með lyfjaofnæmi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36824_type',
              label: 'Ertu með lyfjaofnæmi?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36825',
          label: 'Hvaða lyfi/lyfjum hefur þú ofnæmi fyrir?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36825_answer',
            label: 'Hvaða lyfi/lyfjum hefur þú ofnæmi fyrir?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36825_type',
              label: 'Hvaða lyfi/lyfjum hefur þú ofnæmi fyrir?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36824'],
          visibilityCondition:
            '{"questionId":"RadioGroup36824","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36940',
          label: 'Lyfjaofnæmi',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36940_answer',
            label: 'Lyfjaofnæmi',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36940_type',
              label: 'Lyfjaofnæmi',
              display: QuestionDisplayType.optional,
              options: [
                'Lyfjaofnæmi staðfest með rannsókn',
                'Lyfjaofnæmi ekki staðfest með rannsókn en sterkur grunur',
              ],
            },
          },
          dependsOn: ['RadioGroup36824'],
          visibilityCondition:
            '{"questionId":"RadioGroup36824","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup47842',
          label: 'Ertu með annars konar ofnæmi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup47842_answer',
            label: 'Ertu með annars konar ofnæmi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup47842_type',
              label: 'Ertu með annars konar ofnæmi?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36832',
          label: 'Hvers konar ofnæmi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36832_answer',
            label: 'Hvers konar ofnæmi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36832_type',
              label: 'Hvers konar ofnæmi?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup47842'],
          visibilityCondition:
            '{"questionId":"RadioGroup47842","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36821',
          label: 'Tekur þú lyfseðilsskyld lyf?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36821_answer',
            label: 'Tekur þú lyfseðilsskyld lyf?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36821_type',
              label: 'Tekur þú lyfseðilsskyld lyf?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36822',
          label: 'Hvaða lyf?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36822_answer',
            label: 'Hvaða lyf?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36822_type',
              label: 'Hvaða lyf?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36821'],
          visibilityCondition:
            '{"questionId":"RadioGroup36821","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36823',
          label: 'Ertu að taka blóðþynningarlyf önnur en hjartamagnýl?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36823_answer',
            label: 'Ertu að taka blóðþynningarlyf önnur en hjartamagnýl?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36823_type',
              label: 'Ertu að taka blóðþynningarlyf önnur en hjartamagnýl?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
          dependsOn: ['RadioGroup36821'],
          visibilityCondition:
            '{"questionId":"RadioGroup36821","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36827',
          label: 'Ertu í lyfjaskömmtun?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36827_answer',
            label: 'Ertu í lyfjaskömmtun?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36827_type',
              label: 'Ertu í lyfjaskömmtun?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
          dependsOn: ['RadioGroup36821'],
          visibilityCondition:
            '{"questionId":"RadioGroup36821","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36830',
          label: 'Hvaða apótek sér um lyfjaskömmtunina (nafn og staðsetning)?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36830_answer',
            label:
              'Hvaða apótek sér um lyfjaskömmtunina (nafn og staðsetning)?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36830_type',
              label:
                'Hvaða apótek sér um lyfjaskömmtunina (nafn og staðsetning)?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36827'],
          visibilityCondition:
            '{"questionId":"RadioGroup36827","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup47832',
          label: 'Mataræði',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup47832_answer',
            label: 'Mataræði',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup47832_type',
              label: 'Mataræði',
              display: QuestionDisplayType.optional,
              options: [
                'Almennt fæði',
                'Maukfæði',
                'Fljótandi fæði',
                'Annað sérfæði',
              ],
            },
          },
        },
        {
          id: 'Text47833',
          label: 'Annað sérfæði',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text47833_answer',
            label: 'Annað sérfæði',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text47833_type',
              label: 'Annað sérfæði',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup47832'],
          visibilityCondition:
            '{"questionId":"RadioGroup47832","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup47834',
          label: 'Fæðuóþol/ofnæmi',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup47834_answer',
            label: 'Fæðuóþol/ofnæmi',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup47834_type',
              label: 'Fæðuóþol/ofnæmi',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text47835',
          label: 'Hvaða fæðuóþol/ofnæmi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text47835_answer',
            label: 'Hvaða fæðuóþol/ofnæmi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text47835_type',
              label: 'Hvaða fæðuóþol/ofnæmi?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup47834'],
          visibilityCondition:
            '{"questionId":"RadioGroup47834","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36839',
          label: 'Tekur þú fæðubótaefni reglulega?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36839_answer',
            label: 'Tekur þú fæðubótaefni reglulega?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36839_type',
              label: 'Tekur þú fæðubótaefni reglulega?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36840',
          label: 'Hvaða fæðubótaefni tekur þú inn reglulega?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36840_answer',
            label: 'Hvaða fæðubótaefni tekur þú inn reglulega?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36840_type',
              label: 'Hvaða fæðubótaefni tekur þú inn reglulega?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36839'],
          visibilityCondition:
            '{"questionId":"RadioGroup36839","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36841',
          label: 'Tekur þú lýsi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36841_answer',
            label: 'Tekur þú lýsi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36841_type',
              label: 'Tekur þú lýsi?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup39699',
          label: 'Ertu í reglulegu eftirliti hjá sérfræðilækni?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39699_answer',
            label: 'Ertu í reglulegu eftirliti hjá sérfræðilækni?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39699_type',
              label: 'Ertu í reglulegu eftirliti hjá sérfræðilækni?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36855',
          label: 'Eftirlit hjá sérfræðilækni - merktu við það sem á við',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36855_answer',
            label: 'Eftirlit hjá sérfræðilækni - merktu við það sem á við',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36855_type',
              label: 'Eftirlit hjá sérfræðilækni - merktu við það sem á við',
              display: QuestionDisplayType.optional,
              options: [
                'Augnlækni',
                'Geðlækni',
                'Hjartalækni',
                'Innkirtlalækni (t.d. sykursýki/skjaldkirtla/nýrnahettu)',
                'Krabbameinslækni',
                'Lungnalækni',
                'Meltingalækni',
                'Nýrnalækni',
                'Taugalækni',
                'Annað en er nefnt hér að ofan',
              ],
            },
          },
          dependsOn: ['RadioGroup39699'],
          visibilityCondition:
            '{"questionId":"RadioGroup39699","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36857',
          label: 'Hefur þú verið svæfð/ur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36857_answer',
            label: 'Hefur þú verið svæfð/ur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36857_type',
              label: 'Hefur þú verið svæfð/ur?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36858',
          label: 'Voru einhver vandamál tengd svæfingunni?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36858_answer',
            label: 'Voru einhver vandamál tengd svæfingunni?',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36858_type',
              label: 'Voru einhver vandamál tengd svæfingunni?',
              display: QuestionDisplayType.optional,
              options: [
                'Nei',
                'Já, öndunarvegavandamál',
                'Já, æðaaðgengi',
                'Já, ógleði eftir aðgerð',
                'Já,illkynja háhiti (Malignant hyperthermia)',
              ],
            },
          },
          dependsOn: ['RadioGroup36857'],
          visibilityCondition:
            '{"questionId":"RadioGroup36857","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup37717',
          label: 'Hefur þú farið i skurðaðgerð?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup37717_answer',
            label: 'Hefur þú farið i skurðaðgerð?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup37717_type',
              label: 'Hefur þú farið i skurðaðgerð?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36861',
          label: 'Hvað af eftirfarandi skurðaðgerðum hefur þú farið í?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36861_answer',
            label: 'Hvað af eftirfarandi skurðaðgerðum hefur þú farið í?',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36861_type',
              label: 'Hvað af eftirfarandi skurðaðgerðum hefur þú farið í?',
              display: QuestionDisplayType.optional,
              options: [
                'Bakaðgerð',
                'Heilaaðgerð',
                'Hjartaaðgerð',
                'Keisaraskurðaðgerð',
                'Kransæðavíkkun',
                'Kvensjúkdómaaðgerð',
                'Kviðarholsaðgerð',
                'Liðskiptaaðgerð',
                'Lungnaaðgerð',
                'Nýrna-/þvagfæraaðgerð',
                'Skjaldkirtilsaðgerð',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup37717'],
          visibilityCondition:
            '{"questionId":"RadioGroup37717","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36862',
          label: 'Aðrar aðgerðir?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36862_answer',
            label: 'Aðrar aðgerðir?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36862_type',
              label: 'Aðrar aðgerðir?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36861'],
          visibilityCondition:
            '{"questionId":"Checklist36861","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36859',
          label: 'Hefur þú fengið mænudeyfingu?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36859_answer',
            label: 'Hefur þú fengið mænudeyfingu?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36859_type',
              label: 'Hefur þú fengið mænudeyfingu?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Óviss', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup36860',
          label: 'Manstu eftir vandamálum tengdum mænudeyfingum?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36860_answer',
            label: 'Manstu eftir vandamálum tengdum mænudeyfingum?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36860_type',
              label: 'Manstu eftir vandamálum tengdum mænudeyfingum?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Óviss', 'Já'],
            },
          },
          dependsOn: ['RadioGroup36859'],
          visibilityCondition:
            '{"questionId":"RadioGroup36859","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text39609',
          label: 'Ef já, hvað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text39609_answer',
            label: 'Ef já, hvað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text39609_type',
              label: 'Ef já, hvað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36860'],
          visibilityCondition:
            '{"questionId":"RadioGroup36860","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36863',
          label: 'Hefur þú fengið blóðgjöf?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36863_answer',
            label: 'Hefur þú fengið blóðgjöf?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36863_type',
              label: 'Hefur þú fengið blóðgjöf?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Óviss', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup49784',
          label: 'Ef nauðsyn krefur ert þú samþykk/ur blóðgjöf?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup49784_answer',
            label: 'Ef nauðsyn krefur ert þú samþykk/ur blóðgjöf?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup49784_type',
              label: 'Ef nauðsyn krefur ert þú samþykk/ur blóðgjöf?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Label49782',
          label: 'Spurningar um sjúkdóma eftir líffærakerfum',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Label49782_answer',
            label: 'Spurningar um sjúkdóma eftir líffærakerfum',
            type: {
              __typename: 'HealthQuestionnaireAnswerLabel' as const,
              id: 'Label49782_type',
              label: 'Spurningar um sjúkdóma eftir líffærakerfum',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'RadioGroup39649',
          label: 'Geðræn vandamál',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39649_answer',
            label: 'Geðræn vandamál',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39649_type',
              label: 'Geðræn vandamál',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist47837',
          label: 'Geðræn vandamál - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist47837_answer',
            label: 'Geðræn vandamál - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist47837_type',
              label: 'Geðræn vandamál - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Athyglisbrestur/ADHD',
                'Depurð/þunglyndi',
                'Fíknivandi',
                'Geðhvarfasýki',
                'Kvíði',
                'Svefnvandamál',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39649'],
          visibilityCondition:
            '{"questionId":"RadioGroup39649","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36869',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36869_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36869_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist47837'],
          visibilityCondition:
            '{"questionId":"Checklist47837","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39651',
          label: 'Lungna- og öndunarfærasjúkdómar ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39651_answer',
            label: 'Lungna- og öndunarfærasjúkdómar ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39651_type',
              label: 'Lungna- og öndunarfærasjúkdómar ',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist47838',
          label: 'Lungna og öndunarsjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist47838_answer',
            label: 'Lungna og öndunarsjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist47838_type',
              label: 'Lungna og öndunarsjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Astmi',
                'Hrotur',
                'Kæfisvefn',
                'Kæfisvefnsvél heima',
                'Lungnaþemba',
                'Mæði',
                'Saga um berkla',
                'Tíðar lungnabólgur',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39651'],
          visibilityCondition:
            '{"questionId":"RadioGroup39651","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36875',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36875_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36875_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist47838'],
          visibilityCondition:
            '{"questionId":"Checklist47838","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39650',
          label: 'Miðtaugakerfis- og/eða hrörnunarsjúkdómar',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39650_answer',
            label: 'Miðtaugakerfis- og/eða hrörnunarsjúkdómar',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39650_type',
              label: 'Miðtaugakerfis- og/eða hrörnunarsjúkdómar',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36871',
          label:
            'Miðtaugakerfis- og/eða hrörnunarsjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36871_answer',
            label:
              'Miðtaugakerfis- og/eða hrörnunarsjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36871_type',
              label:
                'Miðtaugakerfis- og/eða hrörnunarsjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Alzheimer',
                'Flogaveiki',
                'Jafnvægistruflun/Svimi',
                'Lömun/Helftarlömun',
                'Minnistruflanir',
                'MND (motor neuron disease)',
                'MS (multiple sclerosis)',
                'Muscular dystrophy',
                'Mænuskaði',
                'Parkinsons sjúkdómur',
                'Þekktur æðagúll í heila',
                'Æðaáfall (blóðtappi til heila/heilablæðing)',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39650'],
          visibilityCondition:
            '{"questionId":"RadioGroup39650","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36872',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36872_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36872_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36871'],
          visibilityCondition:
            '{"questionId":"Checklist36871","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39652',
          label: 'Hjartasjúkdómar',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39652_answer',
            label: 'Hjartasjúkdómar',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39652_type',
              label: 'Hjartasjúkdómar',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36877',
          label: 'Hjartasjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36877_answer',
            label: 'Hjartasjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36877_type',
              label: 'Hjartasjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Brjóstverkir við áreynslu',
                'Farið í brennslu á leiðslubrautum í hjarta',
                'Gangráður/bjargráður',
                'Háþrýstingur',
                'Hjartabilun',
                'Hjartalokusjúkdómur',
                'Hjartsláttaróregla',
                'Kransæðasjúkdómur',
                'Meðfæddir hjartagallar',
                'Mæði',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39652'],
          visibilityCondition:
            '{"questionId":"RadioGroup39652","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36878',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36878_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36878_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36877'],
          visibilityCondition:
            '{"questionId":"Checklist36877","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39653',
          label: 'Æðasjúkdómar',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39653_answer',
            label: 'Æðasjúkdómar',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39653_type',
              label: 'Æðasjúkdómar',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36880',
          label: 'Æðasjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36880_answer',
            label: 'Æðasjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36880_type',
              label: 'Æðasjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Bláæðar fjarlægðar úr fótleggjum',
                'Brjósthol/ósæð',
                'Fótleggir',
                'Háls',
                'Höfuð',
                'Kviðarhol - ósæð/kviðarholslíffæraæðar',
                'Æðahnútar',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39653'],
          visibilityCondition:
            '{"questionId":"RadioGroup39653","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36881',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36881_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36881_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36880'],
          visibilityCondition:
            '{"questionId":"Checklist36880","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39654',
          label: 'Meltingasjúkdómar',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39654_answer',
            label: 'Meltingasjúkdómar',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39654_type',
              label: 'Meltingasjúkdómar',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36883',
          label: 'Meltingarsjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36883_answer',
            label: 'Meltingarsjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36883_type',
              label: 'Meltingarsjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Bakflæði',
                'Chrons/Colitis ulcerosa',
                'Hægðatregða',
                'Lifrar-/gall-/brissjúkdómur',
                'Magabólgur/magasár',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39654'],
          visibilityCondition:
            '{"questionId":"RadioGroup39654","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36884',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36884_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36884_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36883'],
          visibilityCondition:
            '{"questionId":"Checklist36883","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39655',
          label: 'Kvensjúkdómar ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39655_answer',
            label: 'Kvensjúkdómar ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39655_type',
              label: 'Kvensjúkdómar ',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já', 'Á ekki við'],
            },
          },
        },
        {
          id: 'Checklist36886',
          label: 'Kvensjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36886_answer',
            label: 'Kvensjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36886_type',
              label: 'Kvensjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Blæðingarvandamál',
                'Blöðru-/leg-/endaþarmssig',
                'Endometriosa',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39655'],
          visibilityCondition:
            '{"questionId":"RadioGroup39655","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36887',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36887_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36887_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36886'],
          visibilityCondition:
            '{"questionId":"Checklist36886","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39688',
          label: 'Þvag- og kynfærasjúkdómar',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39688_answer',
            label: 'Þvag- og kynfærasjúkdómar',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39688_type',
              label: 'Þvag- og kynfærasjúkdómar',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36889',
          label: 'Þvag- og kynfærasjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36889_answer',
            label: 'Þvag- og kynfærasjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36889_type',
              label: 'Þvag- og kynfærasjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Blóð-/kviðskilun',
                'Blöðruhálskirtils vandamál',
                'Endurteknar þvagfærasýkingar',
                'Nýrnabilun',
                'Nýrnasjúkdómar',
                'Nýrnasteinar',
                'Þvagblöðru vandamál',
                'Þvagleki',
                'Þvagtregða',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39688'],
          visibilityCondition:
            '{"questionId":"RadioGroup39688","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36890',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36890_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36890_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36889'],
          visibilityCondition:
            '{"questionId":"Checklist36889","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39689',
          label: 'Blóðsjúkdómar ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39689_answer',
            label: 'Blóðsjúkdómar ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39689_type',
              label: 'Blóðsjúkdómar ',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36892',
          label: 'Blóðsjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36892_answer',
            label: 'Blóðsjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36892_type',
              label: 'Blóðsjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Blóðleysi',
                'Blóðsega vandamál',
                'Blóðstorku vandamál',
                'Járnskortur',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39689'],
          visibilityCondition:
            '{"questionId":"RadioGroup39689","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36893',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36893_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36893_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36892'],
          visibilityCondition:
            '{"questionId":"Checklist36892","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39690',
          label: 'Innkirtlasjúkdómar ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39690_answer',
            label: 'Innkirtlasjúkdómar ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39690_type',
              label: 'Innkirtlasjúkdómar ',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já '],
            },
          },
        },
        {
          id: 'Checklist36895',
          label: 'Innkirtlasjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36895_answer',
            label: 'Innkirtlasjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36895_type',
              label: 'Innkirtlasjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Nýrnahettusjúkdómur',
                'Skjaldkirtilssjúkdómur',
                'Sykursýki',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39690'],
          visibilityCondition:
            '{"questionId":"RadioGroup39690","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36896',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36896_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36896_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36895'],
          visibilityCondition:
            '{"questionId":"Checklist36895","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39691',
          label: 'Stoðkerfissjúkdómar',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39691_answer',
            label: 'Stoðkerfissjúkdómar',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39691_type',
              label: 'Stoðkerfissjúkdómar',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36898',
          label: 'Stoðkerfissjúkdómar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36898_answer',
            label: 'Stoðkerfissjúkdómar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36898_type',
              label: 'Stoðkerfissjúkdómar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Slitgigt',
                'Sterasprautur í lið s.l. 3 mánuði',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39691'],
          visibilityCondition:
            '{"questionId":"RadioGroup39691","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36899',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36899_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36899_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36898'],
          visibilityCondition:
            '{"questionId":"Checklist36898","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup39692',
          label: 'Sýkingar ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup39692_answer',
            label: 'Sýkingar ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup39692_type',
              label: 'Sýkingar ',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36902',
          label: 'Sýkingar - merktu við það sem á við:',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36902_answer',
            label: 'Sýkingar - merktu við það sem á við:',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36902_type',
              label: 'Sýkingar - merktu við það sem á við:',
              display: QuestionDisplayType.optional,
              options: [
                'Endurteknar öndunarfærasýkingar síðastliðið ár',
                'HIV / lifrarbólga C',
                'MÓSA/ESBL/VRE',
                'Annað',
              ],
            },
          },
          dependsOn: ['RadioGroup39692'],
          visibilityCondition:
            '{"questionId":"RadioGroup39692","operator":"equals","value":"Já"}',
        },
        {
          id: 'Text36903',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36903_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36903_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36902'],
          visibilityCondition:
            '{"questionId":"Checklist36902","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup36934',
          label: 'Hefur þú greinst með krabbamein?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36934_answer',
            label: 'Hefur þú greinst með krabbamein?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36934_type',
              label: 'Hefur þú greinst með krabbamein?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36909',
          label: 'Hvers konar krabbamein?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36909_answer',
            label: 'Hvers konar krabbamein?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36909_type',
              label: 'Hvers konar krabbamein?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36934'],
          visibilityCondition:
            '{"questionId":"RadioGroup36934","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup37718',
          label: 'Er þekkt fjölskyldusaga um krabbamein?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup37718_answer',
            label: 'Er þekkt fjölskyldusaga um krabbamein?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup37718_type',
              label: 'Er þekkt fjölskyldusaga um krabbamein?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup36911',
          label: 'Ertu með aðra sjúkdóma sem ekki hefur verið spurt um?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36911_answer',
            label: 'Ertu með aðra sjúkdóma sem ekki hefur verið spurt um?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36911_type',
              label: 'Ertu með aðra sjúkdóma sem ekki hefur verið spurt um?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text36912',
          label: 'Hvaða sjúkdóm/a?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36912_answer',
            label: 'Hvaða sjúkdóm/a?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36912_type',
              label: 'Hvaða sjúkdóm/a?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36911'],
          visibilityCondition:
            '{"questionId":"RadioGroup36911","operator":"equals","value":"Já"}',
        },
        {
          id: 'Label49783',
          label: 'Spurningar um félagslegar aðstæður',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Label49783_answer',
            label: 'Spurningar um félagslegar aðstæður',
            type: {
              __typename: 'HealthQuestionnaireAnswerLabel' as const,
              id: 'Label49783_type',
              label: 'Spurningar um félagslegar aðstæður',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'RadioGroup36942',
          label: 'Býrðu ein/-n?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup36942_answer',
            label: 'Býrðu ein/-n?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup36942_type',
              label: 'Býrðu ein/-n?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Text47839',
          label: 'Með hverjum',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text47839_answer',
            label: 'Með hverjum',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text47839_type',
              label: 'Með hverjum',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['RadioGroup36942'],
          visibilityCondition:
            '{"questionId":"RadioGroup36942","operator":"equals","value":"Já"}',
        },
        {
          id: 'RadioGroup48703',
          label: 'Þarftu aðstoð við dagleg verk og athafnir?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup48703_answer',
            label: 'Þarftu aðstoð við dagleg verk og athafnir?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup48703_type',
              label: 'Þarftu aðstoð við dagleg verk og athafnir?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'RadioGroup48704',
          label: 'Geturðu treyst á einhvern þér nákominn ef þörf krefur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RadioGroup48704_answer',
            label: 'Geturðu treyst á einhvern þér nákominn ef þörf krefur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RadioGroup48704_type',
              label: 'Geturðu treyst á einhvern þér nákominn ef þörf krefur?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já'],
            },
          },
        },
        {
          id: 'Checklist36808',
          label: 'Færðu utan að komandi stuðning inn á heimili þitt?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist36808_answer',
            label: 'Færðu utan að komandi stuðning inn á heimili þitt?',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist36808_type',
              label: 'Færðu utan að komandi stuðning inn á heimili þitt?',
              display: QuestionDisplayType.optional,
              options: [
                'Heimsendan mat',
                'Aðstoð ættingja',
                'Heimahjúkrun',
                'Heimilisaðstoð',
                'Annað',
              ],
            },
          },
        },
        {
          id: 'Text36809',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text36809_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text36809_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist36808'],
          visibilityCondition:
            '{"questionId":"Checklist36808","operator":"equals","value":"Já"}',
        },
        {
          id: 'Checklist38586',
          label: 'Atvinna',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist38586_answer',
            label: 'Atvinna',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist38586_type',
              label: 'Atvinna',
              display: QuestionDisplayType.optional,
              options: [
                'Er í vinnu',
                'Er í skóla',
                'Er öryrki',
                'Er hætt/-ur að vinna vegna aldurs',
                'Annað',
              ],
            },
          },
        },
        {
          id: 'Text38587',
          label: 'Hvað annað?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Text38587_answer',
            label: 'Hvað annað?',
            type: {
              __typename: 'HealthQuestionnaireAnswerText' as const,
              id: 'Text38587_type',
              label: 'Hvað annað?',
              display: QuestionDisplayType.optional,
              maxLength: 2048,
            },
          },
          dependsOn: ['Checklist38586'],
          visibilityCondition:
            '{"questionId":"Checklist38586","operator":"equals","value":"Já"}',
        },
        {
          id: 'Checklist39697',
          label: 'Hver fyllti út spurningalistann/eyðublaðið?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Checklist39697_answer',
            label: 'Hver fyllti út spurningalistann/eyðublaðið?',
            type: {
              __typename: 'HealthQuestionnaireAnswerCheckbox' as const,
              id: 'Checklist39697_type',
              label: 'Hver fyllti út spurningalistann/eyðublaðið?',
              display: QuestionDisplayType.optional,
              options: [
                'Ég sjálf/-ur',
                'Forráðamaður',
                'Maki/vinur/fjölskyldumeðlimur',
                'Heilbrigðisstarfsmaður',
                'Annar',
              ],
            },
          },
        },
      ],
    },
  ],
}
