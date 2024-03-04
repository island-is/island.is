import { defineMessages } from 'react-intl'

export const prerequisites = {
  general: defineMessages({
    sectionTitle: {
      id: 'ghb.application:prerequisites.general.section.title',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection section title',
    },
    subTitle: {
      id: 'ghb.application:prerequisites.general.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'Data collection section subtitle',
    },
    checkboxLabel: {
      id: 'ghb.application:prerequisites.general.checkbox.label',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
      description: 'Checkbox label',
    },
  }),
  errors: defineMessages({
    noResidenceTitle: {
      id: 'ghb.application:errors.noResidence.title',
      defaultMessage: 'Lögheimili ekki í Grindavík 10. nóvember 2023',
      description: 'Not eligible section title',
    },
    noResidenceDescription: {
      id: 'ghb.application:errors.noResidence.description#markdown',
      defaultMessage:
        'Samkvæmt upplýsingum um lögheimili frá **Þjóðskrá** varst þú með skráð lögheimili í **{locality}** þann 10. nóvember 2023.\n\nÞessi umsókn er aðeins fyrir einstaklinga með lögheimili í Grindavík þann 10. nóvember 2023. Vinsamlega vísið erindum [hér](https://island.is/adstod/syslumenn/hafa-samband) ef þið teljið að þessar upplýsingar séu rangar eða málið krefst endurskoðunar.',
      description: 'Not eligible description',
    },
    youAreNotTheOwnerTitle: {
      id: 'ghb.application:errors.youAreNotTheOwner.title',
      defaultMessage: 'Ekki þinglýstur eigandi',
      description: 'Not eligible section title',
    },
    youAreNotTheOwnerDescription: {
      id: 'ghb.application:errors.youAreNotTheOwner.description#markdown',
      defaultMessage:
        'Samkvæmt **húsnæðis og mannvirkjastofnun** varst þú ekki þinglýstur eigandi að **{streetName}** þar sem þú varst með lögheimili þann 10.nóvember 2023.',
      description: 'Noteligible description',
    },
    noRealEstateNumberWasFoundTitle: {
      id: 'ghb.application:errors.noRealEstateNumberWasFound.title',
      defaultMessage: 'Fasteignanúmer vantar í skráningu',
      description: 'Not eligible section title',
    },
    noRealEstateNumberWasFoundDescription: {
      id: 'ghb.application:errors.noRealEstateNumberWasFound.description#markdown',
      defaultMessage:
        'Samkvæmt **Þjóðskrá** fannst ekkert fasteignanúmer fyrir **{streetName}** þar sem þú varst með skráningu sem löghemili þann 10.nóvember 2023. Vinsamlegast komið erindinu áfram [hér](https://island.is/adstod/syslumenn/hafa-samband)',
      description: 'Not eligible description',
    },
    residendHistoryNotFoundTitle: {
      id: 'ghb.application:errors.residendHistoryNotFound.title',
      defaultMessage: 'Engar upplýsingar fundust um lögheimili',
      description: 'Residence history not found section title',
    },
    residendHistoryNotFoundDescription: {
      id: 'ghb.application:errors.residendHistoryNotFound.description#markdown',
      defaultMessage:
        'Samkvæmt **Þjóðskrá** eru engar upplýsingar skráðar um lögheimili. Ef þú telur þessar upplýsingar rangar vinsamlegast sendið inn erindi [hér](https://island.is/adstod/syslumenn/hafa-samband)',
      description: 'Residence history not found description',
    },
    noResidenceRecordForDateTitle: {
      id: 'ghb.application:errors.noResidenceRecordForDate.title',
      defaultMessage: 'Engin skráning um lögheimili fannst ',
      description: 'No residnce record found section title',
    },
    noResidenceRecordForDateDescription: {
      id: 'ghb.application:errors.noResidenceRecordForDate.description#markdown',
      defaultMessage:
        'Samkvæmt **Þjóðskrá** eru engar upplýsingar skráðar um lögheimili þann 10. nóvember 2023. Ef þú telur þessar upplýsingar rangar vinsamlegast sendið inn erindi [hér](https://island.is/adstod/syslumenn/hafa-samband)',
      description: 'No residnce record found description',
    },
    propertyNotFoundTitle: {
      id: 'ghb.application:errors.propertyNotFound.title',
      defaultMessage: 'Engin fasteign finnst',
      description: 'Property not found section title',
    },
    propertyNotFoundDescription: {
      id: 'ghb.application:errors.propertyNotFound.description#markdown',
      defaultMessage:
        'Samkvæmt **Húsnæðis- og mannvirkjastofnun** fannst engin fasteign fyrir **{streetName}** í fasteignaskrá. Vinsamlegast hafðu samband við **Húsnæðis- og mannvirkjastofnun**.',
      description: 'Property not found  description',
    },
  }),
  intro: defineMessages({
    sectionTitle: {
      id: 'ghb.application:prerequisites.intro.section.title',
      defaultMessage: 'Upplýsingar til umsækjanda',
      description: 'Introduction section title',
    },
    text: {
      id: 'ghb.application:prerequisites.intro.text#markdown',
      defaultMessage:
        '- Umsókn um kaup ríkisins á íbúðareign þinni skuldbindur þig ekki til að selja en með henni hefst söluferlið.\n- Nóg er að einn af eigendum fylli út umsóknina en þegar kemur að sölunni þurfa allir eigendur að undirrita.\n- Staðfesting umsóknar mun berast eigendum í Stafræna pósthólfið þeirra.\n- Gott er fyrir umsækjanda að þekkja öll lán eignar og uppgreiðsluverð þeirra því kallað er eftir þeim upphæðum í umsókninni.\n- Eftir að umsókn klárast hefst úrvinnsla hjá Þórkötlu en stefnt er að því að það ferli taki um 2-4 vikur.\n- Haft verður samband við eigendur ef einhver gögn vantar eða ef eitthvað stöðvar ferlið sem og til að fá staðfest formlega að óskað sé eftir að íbúðarhúsnæði verði keypt af ríkinu.',
      description: 'Introduction text',
    },
  }),
  dataProviders: defineMessages({
    nationalRegistryTitle: {
      id: 'ghb.application:prerequisites.dataproviders.nationalregistry.title',
      defaultMessage: 'Grunnupplýsingar frá Þjóðskrá Íslands',
      description: 'National registry data provider title',
    },
    nationalRegistryDescription: {
      id: 'ghb.application:prerequisites.dataproviders.nationalregistry.description',
      defaultMessage: 'Upplýsingar um nafn, kennitölu og heimilisfang.',
      description: 'National registry data provider description',
    },
    userProfileTitle: {
      id: 'ghb.application:prerequisites.dataproviders.userprofile.title',
      defaultMessage: 'Upplýsingar úr prófílgrunni á island.is',
      description: 'User profile data provider title',
    },
    userProfileDescription: {
      id: 'ghb.application:prerequisites.dataproviders.userprofile.description',
      defaultMessage:
        'Upplýsingar um símanúmer eða netfang til þess að auðvelda umsóknarferlið.',
      description: 'User profile data provider description',
    },
    getGrindavikHousingTitle: {
      id: 'ghb.application:prerequisites.dataproviders.getGrindavikHousing.title',
      defaultMessage: 'Upplýsingar frá Húsnæðis- og mannvirkjastofnun',
      description: 'Grindavik housing data provider title',
    },
    getGrindavikHousingDescription: {
      id: 'ghb.application:prerequisites.dataproviders.getGrindavikHousing.description',
      defaultMessage:
        'Upplýsingar um eignarhlutfall, notkunareiningar og brunabótamat.',
      description: 'Grindavik housing data provider description',
    },
    getResidenceHistoryTitle: {
      id: 'ghb.application:prerequisites.dataproviders.getResidenceHistory.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá um lögheimili',
      description: 'Residence history data provider title',
    },
    getResidenceHistoryDescription: {
      id: 'ghb.application:prerequisites.dataproviders.getResidenceHistory.description',
      defaultMessage:
        'Upplýsingar um hvort lögheimili sé í Grindavík 10. nóvember 2023.',
      description: 'Residence history data provider description',
    },
  }),
}
