import { QuestionDisplayType } from '../models/question.model'
import { QuestionnairesStatusEnum } from '../models/questionnaires.model'

export const data = {
  questionnaires: [
    {
      id: '51612f2c-404c-4783-a426-3f1dc1a72225',
      title: 'EuroHeart - Iceland Heart Failure 2025',
      description:
        'Til að auðvelda okkur mat og eftirlit með sjúkdómi þínum, meðferð og hugsanlegum aukaverkunum, værum við þakklát ef þú gætir svarað eftirfarandi spurningalista. Engin svör eru rétt eða röng, svaraðu því sem þér finnst best eiga við um heilsu þína hverju sinni.',
      sentDate: '2025-09-08T13:23:39.821Z',
      status: QuestionnairesStatusEnum.notAnswered,
      organization: 'Landspítali',
      questions: [
        {
          id: 'Label26481',
          label:
            'Til að auðvelda okkur mat og eftirlit með sjúkdómi þínum, meðferð og hugsanlegum aukaverkunum, værum við þakklát ef þú gætir svarað eftirfarandi spurningalista. Engin svör eru rétt eða röng, svaraðu því sem þér finnst best eiga við um heilsu þína hverju sinni.<br><br>Þú svarar með því að velja einn valkost fyrir hverja spurningu.<br><br>Markmið kerfisbundinnar skráningar er að tryggja öryggi og gæði þeirrar lyfjameðferðar sem sjúklingar þurfa á að halda. <br><br>Stöðluð og vönduð skráning auðveldar allar meðferðarákvarðanir og bætir eftirlit.<br><br>Hjartabilunargagnagrunnurinn fellur inn í sjúkraskrá og er því hluti af sjúkraskrá viðkomandi sjúklings. Ef gögn verða notuð í rannsóknarskyni í framtíðinni verður að liggja fyrir rannsóknaráætlun sem er samþykkt af Vísindasiðanefnd.  <br><br>Persónuvernd hefur verið tilkynnt um þetta fyrirkomulag til að tryggja að lögum og reglugerðum um vistun sjúkraskráa sé fylgt. ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Label26481_answer',
            label:
              'Til að auðvelda okkur mat og eftirlit með sjúkdómi þínum, meðferð og hugsanlegum aukaverkunum, værum við þakklát ef þú gætir svarað eftirfarandi spurningalista. Engin svör eru rétt eða röng, svaraðu því sem þér finnst best eiga við um heilsu þína hverju sinni.<br><br>Þú svarar með því að velja einn valkost fyrir hverja spurningu.<br><br>Markmið kerfisbundinnar skráningar er að tryggja öryggi og gæði þeirrar lyfjameðferðar sem sjúklingar þurfa á að halda. <br><br>Stöðluð og vönduð skráning auðveldar allar meðferðarákvarðanir og bætir eftirlit.<br><br>Hjartabilunargagnagrunnurinn fellur inn í sjúkraskrá og er því hluti af sjúkraskrá viðkomandi sjúklings. Ef gögn verða notuð í rannsóknarskyni í framtíðinni verður að liggja fyrir rannsóknaráætlun sem er samþykkt af Vísindasiðanefnd.  <br><br>Persónuvernd hefur verið tilkynnt um þetta fyrirkomulag til að tryggja að lögum og reglugerðum um vistun sjúkraskráa sé fylgt. ',
            type: {
              __typename: 'HealthQuestionnaireAnswerLabel' as const,
              id: 'Label26481_type',
              label:
                'Til að auðvelda okkur mat og eftirlit með sjúkdómi þínum, meðferð og hugsanlegum aukaverkunum, værum við þakklát ef þú gætir svarað eftirfarandi spurningalista. Engin svör eru rétt eða röng, svaraðu því sem þér finnst best eiga við um heilsu þína hverju sinni.<br><br>Þú svarar með því að velja einn valkost fyrir hverja spurningu.<br><br>Markmið kerfisbundinnar skráningar er að tryggja öryggi og gæði þeirrar lyfjameðferðar sem sjúklingar þurfa á að halda. <br><br>Stöðluð og vönduð skráning auðveldar allar meðferðarákvarðanir og bætir eftirlit.<br><br>Hjartabilunargagnagrunnurinn fellur inn í sjúkraskrá og er því hluti af sjúkraskrá viðkomandi sjúklings. Ef gögn verða notuð í rannsóknarskyni í framtíðinni verður að liggja fyrir rannsóknaráætlun sem er samþykkt af Vísindasiðanefnd.  <br><br>Persónuvernd hefur verið tilkynnt um þetta fyrirkomulag til að tryggja að lögum og reglugerðum um vistun sjúkraskráa sé fylgt. ',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'PatientAgreement',
          label:
            'Ég samþykki hér með að tilgreindar upplýsingar verði skráðar og gerðar aðgengilegar í þágu vísindastarfa og bættra gæða við meðferð á hjartabilun. ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PatientAgreement_answer',
            label:
              'Ég samþykki hér með að tilgreindar upplýsingar verði skráðar og gerðar aðgengilegar í þágu vísindastarfa og bættra gæða við meðferð á hjartabilun. ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PatientAgreement_type',
              label:
                'Ég samþykki hér með að tilgreindar upplýsingar verði skráðar og gerðar aðgengilegar í þágu vísindastarfa og bættra gæða við meðferð á hjartabilun. ',
              display: QuestionDisplayType.optional,
              options: ['Já', 'Nei'],
            },
          },
        },
        {
          id: 'CIVIL_STATUS',
          label: 'Hver er hjúskaparstaða þín?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'CIVIL_STATUS_answer',
            label: 'Hver er hjúskaparstaða þín?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'CIVIL_STATUS_type',
              label: 'Hver er hjúskaparstaða þín?',
              display: QuestionDisplayType.optional,
              options: [
                'Gift(ur)/Í sambúð',
                'Einhleyp(ur)',
                'Ekkill/Ekkja',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'RESIDENCE_TYPE',
          label: 'Hvar býrð þú?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'RESIDENCE_TYPE_answer',
            label: 'Hvar býrð þú?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'RESIDENCE_TYPE_type',
              label: 'Hvar býrð þú?',
              display: QuestionDisplayType.optional,
              options: ['Sjálfstæð(ur)', 'Á stofnun', 'Húsnæðislaus', 'Óþekkt'],
            },
          },
        },
        {
          id: 'Education',
          label: 'Hver er menntun þín?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Education_answer',
            label: 'Hver er menntun þín?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'Education_type',
              label: 'Hver er menntun þín?',
              display: QuestionDisplayType.optional,
              options: [
                'Grunnskólapróf',
                'Iðnnám/framhaldsskólapróf',
                'Háskólapróf',
              ],
            },
          },
        },
        {
          id: 'PARTICIPANT_HF',
          label: 'Ertu að hreyfa þig reglulega?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PARTICIPANT_HF_answer',
            label: 'Ertu að hreyfa þig reglulega?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PARTICIPANT_HF_type',
              label: 'Ertu að hreyfa þig reglulega?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já', 'Óþekkt'],
            },
          },
        },
        {
          id: 'PARTICIPATING_HFE',
          label: 'Ertu þátttakandi í fræðslu um hjartabilun?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PARTICIPATING_HFE_answer',
            label: 'Ertu þátttakandi í fræðslu um hjartabilun?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PARTICIPATING_HFE_type',
              label: 'Ertu þátttakandi í fræðslu um hjartabilun?',
              display: QuestionDisplayType.optional,
              options: ['Nei', 'Já', 'Óþekkt'],
            },
          },
        },
        {
          id: 'SMOKING_HABITS',
          label: 'Tóbak - Reykingar',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'SMOKING_HABITS_answer',
            label: 'Tóbak - Reykingar',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'SMOKING_HABITS_type',
              label: 'Tóbak - Reykingar',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei reykt',
                'Hætti að reykja fyrir meira en 6 mánuðum',
                'Hætti að reykja fyrir minna en 6 mánuðum',
                'Reykir en ekki daglega',
                ' Reykir daglega',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'ALCOHOL_USUAL',
          label:
            'Áfengi - Hversu margar áfengiseiningar drekkur þú vanalega á viku? (lítill bjór 1.8, stór bjór 2.5, lítið vínglas 1.5, stórt vínglas 3, vínflaska 9, einfaldur sjúss 1, flaska af sterku áfengi 30)',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'ALCOHOL_USUAL_answer',
            label:
              'Áfengi - Hversu margar áfengiseiningar drekkur þú vanalega á viku? (lítill bjór 1.8, stór bjór 2.5, lítið vínglas 1.5, stórt vínglas 3, vínflaska 9, einfaldur sjúss 1, flaska af sterku áfengi 30)',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'ALCOHOL_USUAL_type',
              label:
                'Áfengi - Hversu margar áfengiseiningar drekkur þú vanalega á viku? (lítill bjór 1.8, stór bjór 2.5, lítið vínglas 1.5, stórt vínglas 3, vínflaska 9, einfaldur sjúss 1, flaska af sterku áfengi 30)',
              display: QuestionDisplayType.optional,
              options: [
                '< 1 einingu á viku eða enga',
                '1-4 einingar á viku',
                '5-9 einingar á viku',
                '10-14 einingar á viku',
                '15 eða fleiri einingar á viku',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'ALCOHOL_HOW_OFTEN',
          label:
            'Áfengi - Hversu oft drekkur þú sem kvenmaður 4 áfengiseiningar og þú sem karlmaður 5 áfengiseiningar eða fleiri við sama tilfelli?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'ALCOHOL_HOW_OFTEN_answer',
            label:
              'Áfengi - Hversu oft drekkur þú sem kvenmaður 4 áfengiseiningar og þú sem karlmaður 5 áfengiseiningar eða fleiri við sama tilfelli?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'ALCOHOL_HOW_OFTEN_type',
              label:
                'Áfengi - Hversu oft drekkur þú sem kvenmaður 4 áfengiseiningar og þú sem karlmaður 5 áfengiseiningar eða fleiri við sama tilfelli?',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Sjaldnar en einu sinni í mánuði',
                'Í hverjum mánuði',
                'Í hverri viku',
                'Daglega eða nánast daglega',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'FATIGUE',
          label: 'Finnur þú fyrir þreytu?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'FATIGUE_answer',
            label: 'Finnur þú fyrir þreytu?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'FATIGUE_type',
              label: 'Finnur þú fyrir þreytu?',
              display: QuestionDisplayType.optional,
              options: [
                'Hvorki þreyta né hindrun á dagleg störf',
                'Þreyta og lítilsháttar hindrun við dagleg störf',
                'Veruleg hindrun, jafnvel við minniháttar áreynslu (t.d. við stutta göngu >20-100m) en líður vel í hvíld',
                'Alvarleg hindrun. Upplifir þreytu jafnvel í hvíld, aðallega rúmfastur/rúmföst',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'SHORTNESS_OF_BREATH',
          label: 'Finnur þú fyrir mæði?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'SHORTNESS_OF_BREATH_answer',
            label: 'Finnur þú fyrir mæði?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'SHORTNESS_OF_BREATH_type',
              label: 'Finnur þú fyrir mæði?',
              display: QuestionDisplayType.optional,
              options: [
                'Hvorki mæði né hindrun við dagleg störf',
                'Mæði og lítilsháttar hindrun við dagleg störf',
                'Veruleg hindrun jafnvel við minniháttar dagleg störf (t.d. við stutta göngu >20-100m) og einungis laus við óþægindi í hvíld',
                'Alvarleg hindrun vegna mæði. Upplifir þreytu jafnvel í hvíld, aðallega rúmfastur/rúmfösti',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'MOBILITY',
          label: 'Hvernig er hreyfifærni þín?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'MOBILITY_answer',
            label: 'Hvernig er hreyfifærni þín?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'MOBILITY_type',
              label: 'Hvernig er hreyfifærni þín?',
              display: QuestionDisplayType.optional,
              options: [
                'Ég á ekki í erfiðleikum við göngu',
                'Ég á í einhverjum erfiðleikum við göngu',
                'Ég er rúmfastur/rúmfösti',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'SELF_CARE',
          label: 'Hvernig er færni þín við umhirðu?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'SELF_CARE_answer',
            label: 'Hvernig er færni þín við umhirðu?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'SELF_CARE_type',
              label: 'Hvernig er færni þín við umhirðu?',
              display: QuestionDisplayType.optional,
              options: [
                'Ég er fær um að sjá um eigin umhirðu',
                'Ég á í einhverjum erfiðleikum með að baða og/eða klæða mig',
                'Ég er ófær um að baða mig og/eða klæða mig',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'USUAL_ACTIVITIES',
          label: 'Hvernig er færni þín við að sinna daglegum störfum?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'USUAL_ACTIVITIES_answer',
            label: 'Hvernig er færni þín við að sinna daglegum störfum?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'USUAL_ACTIVITIES_type',
              label: 'Hvernig er færni þín við að sinna daglegum störfum?',
              display: QuestionDisplayType.optional,
              options: [
                'Ég á ekki í vandræðum með að sinna daglegum störfum',
                'Ég á í einhverjum vandræðum með að sinna daglegum störfum',
                'Ég er ófær um að sinna daglegum störfum',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'PAIN_DISCOMFORT',
          label: 'Finnur þú fyrir sársauka eða óþægindum?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PAIN_DISCOMFORT_answer',
            label: 'Finnur þú fyrir sársauka eða óþægindum?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PAIN_DISCOMFORT_type',
              label: 'Finnur þú fyrir sársauka eða óþægindum?',
              display: QuestionDisplayType.optional,
              options: [
                'Ég finn hvorki fyrir sársauka né óþægindum',
                'Ég finn fyrir meðalmiklum sársauka og/eða óþægindum',
                'Ég finn fyrir verulegum sársauka og/eða óþægindum',
                'Óþekkt',
              ],
            },
          },
        },
        {
          id: 'ANXIETY_DEPRESSION',
          label: 'Finnur þú fyrir kvíða eða þunglyndi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'ANXIETY_DEPRESSION_answer',
            label: 'Finnur þú fyrir kvíða eða þunglyndi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'ANXIETY_DEPRESSION_type',
              label: 'Finnur þú fyrir kvíða eða þunglyndi?',
              display: QuestionDisplayType.optional,
              options: [
                'Ég upplifi hvorki kvíða né þunglyndi',
                ' Ég er í meðallagi kvíðin(n) og/eða þunglynd(ur)',
                'Ég er ákaflega kvíðin(n) og/eða þunglynd(ur)',
                'Óþekkt ',
              ],
            },
          },
        },
        {
          id: 'QUALITY_OF_LIFE',
          label:
            'Hvernig metur þú heilsu þína á bilinu 0-100 (100=Besta mögulega heilsa, 0=Versta mögulega heilsa)?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'QUALITY_OF_LIFE_answer',
            label:
              'Hvernig metur þú heilsu þína á bilinu 0-100 (100=Besta mögulega heilsa, 0=Versta mögulega heilsa)?',
            type: {
              __typename: 'HealthQuestionnaireAnswerNumber' as const,
              id: 'QUALITY_OF_LIFE_type',
              label:
                'Hvernig metur þú heilsu þína á bilinu 0-100 (100=Besta mögulega heilsa, 0=Versta mögulega heilsa)?',
              display: QuestionDisplayType.optional,
              max: 100,
            },
          },
        },
        {
          id: 'Number36920',
          label: 'Hver er hæð þín í cm?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Number36920_answer',
            label: 'Hver er hæð þín í cm?',
            type: {
              __typename: 'HealthQuestionnaireAnswerNumber' as const,
              id: 'Number36920_type',
              label: 'Hver er hæð þín í cm?',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'Number36921',
          label: 'Hver er þyngd þín í kg?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Number36921_answer',
            label: 'Hver er þyngd þín í kg?',
            type: {
              __typename: 'HealthQuestionnaireAnswerNumber' as const,
              id: 'Number36921_type',
              label: 'Hver er þyngd þín í kg?',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'Label21921',
          label:
            'Eftirfarandi spurningar eiga við hjartabilun þína og hvaða áhrif hún hefur á líf þitt. Vinsamlegast lestu yfir og svarið eftirfarandi spurningum. Það eru engin rétt eða röng svör. Vinsamlegast merktu við það svar sem á hvað best við um þig.',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Label21921_answer',
            label:
              'Eftirfarandi spurningar eiga við hjartabilun þína og hvaða áhrif hún hefur á líf þitt. Vinsamlegast lestu yfir og svarið eftirfarandi spurningum. Það eru engin rétt eða röng svör. Vinsamlegast merktu við það svar sem á hvað best við um þig.',
            type: {
              __typename: 'HealthQuestionnaireAnswerLabel' as const,
              id: 'Label21921_type',
              label:
                'Eftirfarandi spurningar eiga við hjartabilun þína og hvaða áhrif hún hefur á líf þitt. Vinsamlegast lestu yfir og svarið eftirfarandi spurningum. Það eru engin rétt eða röng svör. Vinsamlegast merktu við það svar sem á hvað best við um þig.',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'KCCQ12_Bathing',
          label:
            '1.a. Hjartabilun hefur takmarkað getu mína til að fara í sturtu/bað',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_Bathing_answer',
            label:
              '1.a. Hjartabilun hefur takmarkað getu mína til að fara í sturtu/bað',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_Bathing_type',
              label:
                '1.a. Hjartabilun hefur takmarkað getu mína til að fara í sturtu/bað',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög mikið',
                'Talsvert',
                'Í meðallagi',
                'Svolítið',
                'Ekkert',
                'Takmarkað getu mína af öðrum ástæðum eða gerði ekki',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_WalkingSlow',
          label:
            '1.b. Hjartabilun hefur takmarkað getu mína til að ganga u.þ.b. 100 metra á jafnsléttu',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_WalkingSlow_answer',
            label:
              '1.b. Hjartabilun hefur takmarkað getu mína til að ganga u.þ.b. 100 metra á jafnsléttu',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_WalkingSlow_type',
              label:
                '1.b. Hjartabilun hefur takmarkað getu mína til að ganga u.þ.b. 100 metra á jafnsléttu',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög mikið',
                'Talsvert',
                'Í meðallagi',
                'Svolítið',
                'Ekkert',
                'Takmarkað getu mína af öðrum ástæðum eða gerði ekki',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_WalkingFast',
          label:
            '1.c. Hjartabilun hefur takmarkað getu mína til að ganga rösklega eða skokka (t.d. reyna að ná strætisvagni) ',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_WalkingFast_answer',
            label:
              '1.c. Hjartabilun hefur takmarkað getu mína til að ganga rösklega eða skokka (t.d. reyna að ná strætisvagni) ',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_WalkingFast_type',
              label:
                '1.c. Hjartabilun hefur takmarkað getu mína til að ganga rösklega eða skokka (t.d. reyna að ná strætisvagni) ',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög mikið',
                'Talsvert',
                'Í meðallagi',
                'Svolítið',
                'Ekkert',
                'Takmarkað getu mína af öðrum ástæðum eða gerði ekki',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_FootSwelling',
          label:
            '2. Hve oft hefur þú haft <b>fótabjúg</b> þegar þú vaknaðir á morgnana, síðastliðnar 2 vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_FootSwelling_answer',
            label:
              '2. Hve oft hefur þú haft <b>fótabjúg</b> þegar þú vaknaðir á morgnana, síðastliðnar 2 vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_FootSwelling_type',
              label:
                '2. Hve oft hefur þú haft <b>fótabjúg</b> þegar þú vaknaðir á morgnana, síðastliðnar 2 vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Á hverjum morgni',
                'Þrisvar eða oftar í viku, en ekki daglega',
                'Einu sinni til tvisvar í viku',
                'Minna en vikulega',
                'Aldrei s.l. 2 vikur',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_Fatigue12Weeks',
          label:
            '3. Hve oft að meðaltali, hefur <b>þreyta</b> takmarkað getu þína til að gera það sem þú vilt, <u>síðastliðnar 2 vikur</u>?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_Fatigue12Weeks_answer',
            label:
              '3. Hve oft að meðaltali, hefur <b>þreyta</b> takmarkað getu þína til að gera það sem þú vilt, <u>síðastliðnar 2 vikur</u>?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_Fatigue12Weeks_type',
              label:
                '3. Hve oft að meðaltali, hefur <b>þreyta</b> takmarkað getu þína til að gera það sem þú vilt, <u>síðastliðnar 2 vikur</u>?',
              display: QuestionDisplayType.optional,
              options: [
                'Stöðugt',
                'Nokkrum sinnum á dag',
                'Alla vega einu sinni á dag',
                'Þrisvar eða oftar í viku, en ekki daglega',
                'Einu sinni til tvisvar í viku',
                'Minna en vikulega',
                'Aldrei s.l. 2 vikur',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_ShortnessOfBreath',
          label:
            '4. Hve oft, að meðaltali, hefur <b>mæði</b> takmarkað getu þína til að gera það sem þú vilt, <u>síðastliðnar 2 vikur</u>?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_ShortnessOfBreath_answer',
            label:
              '4. Hve oft, að meðaltali, hefur <b>mæði</b> takmarkað getu þína til að gera það sem þú vilt, <u>síðastliðnar 2 vikur</u>?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_ShortnessOfBreath_type',
              label:
                '4. Hve oft, að meðaltali, hefur <b>mæði</b> takmarkað getu þína til að gera það sem þú vilt, <u>síðastliðnar 2 vikur</u>?',
              display: QuestionDisplayType.optional,
              options: [
                'Stöðugt',
                'Nokkrum sinnum á dag',
                'Alla vega einu sinni á dag',
                'Þrisvar eða oftar í viku, en ekki daglega',
                'Einu sinni til tvisvar í viku',
                'Minna en vikulega',
                'Aldrei s.l. 2 vikur',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_Sleeping',
          label:
            '5. Hve oft að meðaltali hefur þú, sökum <b>mæði</b>, þurft að sofa sitjandi í stól eða liggjandi með a.m.k. 3 kodda undir höfðinu, <u>síðastliðnar 2 vikur</u>?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_Sleeping_answer',
            label:
              '5. Hve oft að meðaltali hefur þú, sökum <b>mæði</b>, þurft að sofa sitjandi í stól eða liggjandi með a.m.k. 3 kodda undir höfðinu, <u>síðastliðnar 2 vikur</u>?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_Sleeping_type',
              label:
                '5. Hve oft að meðaltali hefur þú, sökum <b>mæði</b>, þurft að sofa sitjandi í stól eða liggjandi með a.m.k. 3 kodda undir höfðinu, <u>síðastliðnar 2 vikur</u>?',
              display: QuestionDisplayType.optional,
              options: [
                'Á hverri nóttu',
                'Þrisvar eða oftar í viku, en ekki daglega',
                'Einu sinni til tvisvar í viku',
                'Minna en vikulega',
                'Aldrei s.l. 2 vikur',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_QOL',
          label:
            '6. Hve mikið hefur <b>hjartabilun</b> þín takmarkað getu þína til að njóta lífsins <u>síðastliðnar 2 vikur</u>?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_QOL_answer',
            label:
              '6. Hve mikið hefur <b>hjartabilun</b> þín takmarkað getu þína til að njóta lífsins <u>síðastliðnar 2 vikur</u>?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_QOL_type',
              label:
                '6. Hve mikið hefur <b>hjartabilun</b> þín takmarkað getu þína til að njóta lífsins <u>síðastliðnar 2 vikur</u>?',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög mikið',
                'Talsvert',
                'Í meðallagi',
                'Svolítið',
                'Alls ekkert',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_IfUnchanged',
          label:
            '7. Hvað fyndist þér um það ef <b>hjartabilun</b> þín yrði óbreytt frá því sem <u>nú</u> er, til æviloka?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_IfUnchanged_answer',
            label:
              '7. Hvað fyndist þér um það ef <b>hjartabilun</b> þín yrði óbreytt frá því sem <u>nú</u> er, til æviloka?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_IfUnchanged_type',
              label:
                '7. Hvað fyndist þér um það ef <b>hjartabilun</b> þín yrði óbreytt frá því sem <u>nú</u> er, til æviloka?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki sátt(ur)',
                'Að mestu ósátt(ur)',
                'Nokkuð sátt(ur)',
                'Að mestu sátt(ur)',
                'Algjörlega sátt(ur)',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_Hobby',
          label:
            '8.a. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að sinna áhugamálum, tómstundum',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_Hobby_answer',
            label:
              '8.a. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að sinna áhugamálum, tómstundum',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_Hobby_type',
              label:
                '8.a. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að sinna áhugamálum, tómstundum',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög mikið',
                'Talsvert',
                'Í meðallagi',
                'Svolítið',
                'Ekkert',
                'Á ekki við, eða gerði ekki af öðrum ástæðum',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_Chores',
          label:
            '8.b. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að sinna vinnu/ heimilis-störfum',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_Chores_answer',
            label:
              '8.b. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að sinna vinnu/ heimilis-störfum',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_Chores_type',
              label:
                '8.b. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að sinna vinnu/ heimilis-störfum',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög mikið',
                'Talsvert',
                'Í meðallagi',
                'Svolítið',
                'Ekkert',
                'Á ekki við, eða gerði ekki af öðrum ástæðum',
              ],
            },
          },
        },
        {
          id: 'KCCQ12_Visiting',
          label:
            '8.c. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að heimsækja fjölskyldu eða vini utan heimilisins',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'KCCQ12_Visiting_answer',
            label:
              '8.c. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að heimsækja fjölskyldu eða vini utan heimilisins',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'KCCQ12_Visiting_type',
              label:
                '8.c. Hve mikið hefur hjartabilun þín takmarkað þátttöku þína í að heimsækja fjölskyldu eða vini utan heimilisins',
              display: QuestionDisplayType.optional,
              options: [
                'Mjög mikið',
                'Talsvert',
                'Í meðallagi',
                'Svolítið',
                'Ekkert',
                'Á ekki við, eða gerði ekki af öðrum ástæðum',
              ],
            },
          },
        },
        {
          id: 'Label20011',
          label:
            'Spurningar um líðan (PHQ-9). Hversu oft hafa eftirfarandi vandamál truflað þig síðastliðnar <u>tvær vikur</u>?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Label20011_answer',
            label:
              'Spurningar um líðan (PHQ-9). Hversu oft hafa eftirfarandi vandamál truflað þig síðastliðnar <u>tvær vikur</u>?',
            type: {
              __typename: 'HealthQuestionnaireAnswerLabel' as const,
              id: 'Label20011_type',
              label:
                'Spurningar um líðan (PHQ-9). Hversu oft hafa eftirfarandi vandamál truflað þig síðastliðnar <u>tvær vikur</u>?',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'PHQ9_Q1',
          label:
            'a. Hversu oft hefur lítill áhugi eða gleði við að gera hluti truflað þig síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q1_answer',
            label:
              'a. Hversu oft hefur lítill áhugi eða gleði við að gera hluti truflað þig síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q1_type',
              label:
                'a. Hversu oft hefur lítill áhugi eða gleði við að gera hluti truflað þig síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q2',
          label:
            'b. Hversu oft hefur þú verið niðurdregin/n, dapur/döpur eða vonlaus síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q2_answer',
            label:
              'b. Hversu oft hefur þú verið niðurdregin/n, dapur/döpur eða vonlaus síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q2_type',
              label:
                'b. Hversu oft hefur þú verið niðurdregin/n, dapur/döpur eða vonlaus síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q3',
          label:
            'c. Hversu oft hefur þú átt erfitt með að sofna eða sofa alla nóttina síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q3_answer',
            label:
              'c. Hversu oft hefur þú átt erfitt með að sofna eða sofa alla nóttina síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q3_type',
              label:
                'c. Hversu oft hefur þú átt erfitt með að sofna eða sofa alla nóttina síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q4',
          label:
            'd. Hversu oft hefur þreyta og orkuleysi truflað þið síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q4_answer',
            label:
              'd. Hversu oft hefur þreyta og orkuleysi truflað þið síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q4_type',
              label:
                'd. Hversu oft hefur þreyta og orkuleysi truflað þið síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q5',
          label:
            'e. Hversu oft hefur lystaleysi eða ofát truflað þið síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q5_answer',
            label:
              'e. Hversu oft hefur lystaleysi eða ofát truflað þið síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q5_type',
              label:
                'e. Hversu oft hefur lystaleysi eða ofát truflað þið síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q6',
          label:
            'f. Hversu oft hefur þér liðið illa með sjálfan þig eða fundist að þér hafi mistekist eða ekki staðið þig í stykkinu gagnvart sjálfum þér eða fjölskyldunni þinni síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q6_answer',
            label:
              'f. Hversu oft hefur þér liðið illa með sjálfan þig eða fundist að þér hafi mistekist eða ekki staðið þig í stykkinu gagnvart sjálfum þér eða fjölskyldunni þinni síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q6_type',
              label:
                'f. Hversu oft hefur þér liðið illa með sjálfan þig eða fundist að þér hafi mistekist eða ekki staðið þig í stykkinu gagnvart sjálfum þér eða fjölskyldunni þinni síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q7',
          label:
            'g. Hversu oft hefur þú átt erfitt með einbeitingu við t.d. að lesa blöðin eða horfa á sjónvarp síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q7_answer',
            label:
              'g. Hversu oft hefur þú átt erfitt með einbeitingu við t.d. að lesa blöðin eða horfa á sjónvarp síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q7_type',
              label:
                'g. Hversu oft hefur þú átt erfitt með einbeitingu við t.d. að lesa blöðin eða horfa á sjónvarp síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q8',
          label:
            'h. Hversu oft hefur þú hreyft þig eða talað svo hægt að aðrir hafa tekið eftir því? Eða hið gagnstæða - verið svo eirðarlaus eða óróleg(ur) að þú hreyfir þig miklu meira en venjulega síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q8_answer',
            label:
              'h. Hversu oft hefur þú hreyft þig eða talað svo hægt að aðrir hafa tekið eftir því? Eða hið gagnstæða - verið svo eirðarlaus eða óróleg(ur) að þú hreyfir þig miklu meira en venjulega síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q8_type',
              label:
                'h. Hversu oft hefur þú hreyft þig eða talað svo hægt að aðrir hafa tekið eftir því? Eða hið gagnstæða - verið svo eirðarlaus eða óróleg(ur) að þú hreyfir þig miklu meira en venjulega síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'PHQ9_Q9',
          label:
            'i. Hversu oft hefur þú hugsað um að það væri betra að þú værir dáin(n) eða hugsað um að skaða þig á einhvern hátt síðastliðnar tvær vikur?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'PHQ9_Q9_answer',
            label:
              'i. Hversu oft hefur þú hugsað um að það væri betra að þú værir dáin(n) eða hugsað um að skaða þig á einhvern hátt síðastliðnar tvær vikur?',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'PHQ9_Q9_type',
              label:
                'i. Hversu oft hefur þú hugsað um að það væri betra að þú værir dáin(n) eða hugsað um að skaða þig á einhvern hátt síðastliðnar tvær vikur?',
              display: QuestionDisplayType.optional,
              options: [
                'Alls ekki',
                'Nokkra daga',
                'Meira en helming tímans',
                'Nánast alla daga',
              ],
            },
          },
        },
        {
          id: 'Label21938',
          label:
            'Spurningar um líðan (GAD-7). Hversu oft á <u>síðastliðnum 2 vikum</u> hefur þér liðið illa vegna eftirfarandi?',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'Label21938_answer',
            label:
              'Spurningar um líðan (GAD-7). Hversu oft á <u>síðastliðnum 2 vikum</u> hefur þér liðið illa vegna eftirfarandi?',
            type: {
              __typename: 'HealthQuestionnaireAnswerLabel' as const,
              id: 'Label21938_type',
              label:
                'Spurningar um líðan (GAD-7). Hversu oft á <u>síðastliðnum 2 vikum</u> hefur þér liðið illa vegna eftirfarandi?',
              display: QuestionDisplayType.optional,
            },
          },
        },
        {
          id: 'GAD7_Nervous',
          label:
            '1. Hversu oft síðastliðnar 2 vikur hefur þú verið spennt/ur á taugu, kvíðin/n eða hengd/ur upp á þráð',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'GAD7_Nervous_answer',
            label:
              '1. Hversu oft síðastliðnar 2 vikur hefur þú verið spennt/ur á taugu, kvíðin/n eða hengd/ur upp á þráð',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'GAD7_Nervous_type',
              label:
                '1. Hversu oft síðastliðnar 2 vikur hefur þú verið spennt/ur á taugu, kvíðin/n eða hengd/ur upp á þráð',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Nokkra daga',
                'Oftar en helming daganna',
                'Næstum daglega',
              ],
            },
          },
        },
        {
          id: 'GAD7_SuppressWorries',
          label:
            '2. Hversu oft síðastliðnar 2 vikur hefur þér ekki tekist að bægja frá þér áhyggjum eða hafa stjórn á þeim',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'GAD7_SuppressWorries_answer',
            label:
              '2. Hversu oft síðastliðnar 2 vikur hefur þér ekki tekist að bægja frá þér áhyggjum eða hafa stjórn á þeim',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'GAD7_SuppressWorries_type',
              label:
                '2. Hversu oft síðastliðnar 2 vikur hefur þér ekki tekist að bægja frá þér áhyggjum eða hafa stjórn á þeim',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Nokkra daga',
                'Oftar en helming daganna',
                'Næstum daglega',
              ],
            },
          },
        },
        {
          id: 'GAD7_ToMuchWorries',
          label:
            '3. Hversu oft síðastliðnar 2 vikur hefur þú haft of miklar áhyggjur af ýmsum hlutum',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'GAD7_ToMuchWorries_answer',
            label:
              '3. Hversu oft síðastliðnar 2 vikur hefur þú haft of miklar áhyggjur af ýmsum hlutum',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'GAD7_ToMuchWorries_type',
              label:
                '3. Hversu oft síðastliðnar 2 vikur hefur þú haft of miklar áhyggjur af ýmsum hlutum',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Nokkra daga',
                'Oftar en helming daganna',
                'Næstum daglega',
              ],
            },
          },
        },
        {
          id: 'GAD7_ProblemRelaxing',
          label:
            '4. Hversu oft síðastliðnar 2 vikur hefur þú átt erfitt með að slaka á',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'GAD7_ProblemRelaxing_answer',
            label:
              '4. Hversu oft síðastliðnar 2 vikur hefur þú átt erfitt með að slaka á',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'GAD7_ProblemRelaxing_type',
              label:
                '4. Hversu oft síðastliðnar 2 vikur hefur þú átt erfitt með að slaka á',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Nokkra daga',
                'Oftar en helming daganna',
                'Næstum daglega',
              ],
            },
          },
        },
        {
          id: 'GAD7_Restless',
          label:
            '5. Hversu oft síðastliðnar 2 vikur hefur þú verið svo eirðarlaus að þú áttir erfitt með að sitja kyrr',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'GAD7_Restless_answer',
            label:
              '5. Hversu oft síðastliðnar 2 vikur hefur þú verið svo eirðarlaus að þú áttir erfitt með að sitja kyrr',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'GAD7_Restless_type',
              label:
                '5. Hversu oft síðastliðnar 2 vikur hefur þú verið svo eirðarlaus að þú áttir erfitt með að sitja kyrr',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Nokkra daga',
                'Oftar en helming daganna',
                'Næstum daglega',
              ],
            },
          },
        },
        {
          id: 'GAD7_Irritated',
          label:
            '6. Hversu oft síðastliðnar tvær vikur hefur þú orðið gröm/gramur eða pirruð/pirraður af minnsta tilefni',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'GAD7_Irritated_answer',
            label:
              '6. Hversu oft síðastliðnar tvær vikur hefur þú orðið gröm/gramur eða pirruð/pirraður af minnsta tilefni',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'GAD7_Irritated_type',
              label:
                '6. Hversu oft síðastliðnar tvær vikur hefur þú orðið gröm/gramur eða pirruð/pirraður af minnsta tilefni',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Nokkra daga',
                'Oftar en helming daganna',
                'Næstum daglega',
              ],
            },
          },
        },
        {
          id: 'GAD7_Scared',
          label:
            '7. Hverstu oft síðastliðnar tvær vikur hefur þú verið hrædd/ur eins og eitthvað hræðilegt gæti gerst',
          display: QuestionDisplayType.optional,
          answerOptions: {
            id: 'GAD7_Scared_answer',
            label:
              '7. Hverstu oft síðastliðnar tvær vikur hefur þú verið hrædd/ur eins og eitthvað hræðilegt gæti gerst',
            type: {
              __typename: 'HealthQuestionnaireAnswerRadio' as const,
              id: 'GAD7_Scared_type',
              label:
                '7. Hverstu oft síðastliðnar tvær vikur hefur þú verið hrædd/ur eins og eitthvað hræðilegt gæti gerst',
              display: QuestionDisplayType.optional,
              options: [
                'Aldrei',
                'Nokkra daga',
                'Oftar en helming daganna',
                'Næstum daglega',
              ],
            },
          },
        },
      ],
    },
  ],
}
