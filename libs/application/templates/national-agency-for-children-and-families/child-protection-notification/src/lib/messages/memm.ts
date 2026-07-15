import { defineMessages } from 'react-intl'

export const memmMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:memm.shared.sectionTitle',
      defaultMessage: 'MEMM',
      description: 'MEMM section title shown in sidebar',
    },
    pageTitle: {
      id: 'cpn.application:memm.shared.pageTitle',
      defaultMessage: 'Menntun, móttaka, menning, farsæld',
      description: 'MEMM page heading',
    },
    pageDescription: {
      id: 'cpn.application:memm.shared.pageDescription',
      defaultMessage:
        'Stuðningur við börn og fjölskyldur felur í sér að byggja brýr, svo sem á grunni menningarlæsi og farsældar. Mikilvægt er því að virða og vinna með fjölbreyttar hefðir, gildi og samskiptareglur sem einkenna ólíkar kynslóðir og hópa í nærumhverfi barnsins.',
      description: 'MEMM page intro description',
    },
  }),
  education: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:memm.education.subSectionTitle',
      defaultMessage: 'Menntun',
      description: 'Menntun sub-section title in sidebar',
    },
    title: {
      id: 'cpn.application:memm.education.title',
      defaultMessage: 'Menntun eða dagvistun',
      description: 'Menntun sub-section heading on the page',
    },
    description: {
      id: 'cpn.application:memm.education.description',
      defaultMessage:
        'Öll börn eiga að fá að njóta réttar síns til náms, til að rækta sjálfa sig, eflast og þroskast og auka hæfni sína til að takast á við áskoranir daglegs lífs.',
      description: 'Menntun sub-section description',
    },
    typeLabel: {
      id: 'cpn.application:memm.education.typeLabel',
      defaultMessage: 'Menntun eða gæsla',
      description: 'Label for the education type dropdown',
    },
    typePlaceholder: {
      id: 'cpn.application:memm.education.typePlaceholder',
      defaultMessage: 'Veldu menntun eða gæslu',
      description: 'Placeholder for the education type dropdown',
    },
    typeKindergarten: {
      id: 'cpn.application:memm.education.typeKindergarten',
      defaultMessage: 'Leikskóli',
      description: 'Education type: kindergarten/preschool',
    },
    typeElementarySchool: {
      id: 'cpn.application:memm.education.typeElementarySchool',
      defaultMessage: 'Grunnskóli',
      description: 'Education type: elementary school',
    },
    typeHighSchool: {
      id: 'cpn.application:memm.education.typeHighSchool',
      defaultMessage: 'Framhaldsskóli',
      description: 'Education type: high school',
    },
    typeDaycareProvider: {
      id: 'cpn.application:memm.education.typeDaycareProvider',
      defaultMessage: 'Dagforeldri',
      description: 'Education type: daycare provider',
    },
    schoolName: {
      id: 'cpn.application:memm.education.schoolName',
      defaultMessage: 'Nafn á skóla',
      description: 'Label for school name text field',
    },
    caregiverName: {
      id: 'cpn.application:memm.education.caregiverName',
      defaultMessage: 'Nafn',
      description: 'Label for daycare provider name text field',
    },
  }),
  reception: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:memm.reception.subSectionTitle',
      defaultMessage: 'Móttaka',
      description: 'Móttaka sub-section title in sidebar',
    },
    description: {
      id: 'cpn.application:memm.reception.description',
      defaultMessage:
        'Fyrir barn getur falist mikil áskorun í því að fóta sig í breyttum aðstæðum eða nýju landi, þar sem menning, siðir og venjur geta verið ólík því sem þau eiga að venjast. Hjálpaðu okkur að skilja betur stöðu barnsins.',
      description: 'Móttaka section description',
    },
    seekingAsylumLabel: {
      id: 'cpn.application:memm.reception.seekingAsylumLabel',
      defaultMessage: 'Barn er umsækjandi um alþjóðlega vernd',
      description: 'Label for seeking asylum radio field',
    },
    seekingAsylumTooltip: {
      id: 'cpn.application:memm.reception.seekingAsylumTooltip',
      defaultMessage:
        'Er átt við barn sem hefur ekki dvalarleyfi á Íslandi en hefur óskað eftir viðurkenningu á stöðu sinni sem flóttamaður eða ríkisfangslaus einstaklingur hér á landi.',
      description: 'Tooltip for seeking asylum radio field',
    },
    refugeeStatusLabel: {
      id: 'cpn.application:memm.reception.refugeeStatusLabel',
      defaultMessage:
        'Barnið hefur hlotið viðurkenningu á stöðu sinni sem flóttamaður',
      description: 'Label for refugee status radio field',
    },
    refugeeStatusTooltip: {
      id: 'cpn.application:memm.reception.refugeeStatusTooltip',
      defaultMessage:
        'Er átt við barn sem Íslensk stjórnvöld hafa samþykkt að veita dvalarleyfi á grundvelli alþjóðlegrar verndar.',
      description: 'Tooltip for refugee status radio field',
    },
    optionDoNotKnow: {
      id: 'cpn.application:memm.reception.optionDoNotKnow',
      defaultMessage: 'Ég veit það ekki',
      description: 'I do not know option',
    },
    optionNotApplicable: {
      id: 'cpn.application:memm.reception.optionNotApplicable',
      defaultMessage: 'Á ekki við',
      description: 'Not applicable option',
    },
    fetchedDataInfo: {
      id: 'cpn.application:memm.reception.fetchedDataInfo',
      defaultMessage:
        'Upplýsingar um ríkisfang, fæðingarstað og dagsetningu nýskráningar barns inn í landið eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown when child data has been fetched from national registry',
    },
  }),
  culture: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:memm.culture.subSectionTitle',
      defaultMessage: 'Menning',
      description: 'Menning sub-section title in sidebar',
    },
    description: {
      id: 'cpn.application:memm.culture.description',
      defaultMessage:
        'Tungumál eru lykill að menningu þjóðar. Til að hægt sé að skilja betur og koma til móts við þarfir barnsins þurfum við að vita hvaða tungumál eru notuð í samskiptum við barnið í daglegu lífi fjölskyldunnar.',
      description: 'Menning sub-section description',
    },
    languageUsageQuestion: {
      id: 'cpn.application:memm.culture.languageUsageQuestion',
      defaultMessage:
        'Hvað á best við í tilfelli barnsins og tungumála sem notuð eru í daglegu lífi fjölskyldunnar?',
      description: 'Bold question text above the language usage dropdown',
    },
    languageUsageLabel: {
      id: 'cpn.application:memm.culture.languageUsageLabel',
      defaultMessage: 'Málnotkun',
      description: 'Label for the language usage dropdown',
    },
    languageUsagePlaceholder: {
      id: 'cpn.application:memm.culture.languageUsagePlaceholder',
      defaultMessage: 'Veldu málnotkun í daglegu lífi barnsins',
      description: 'Placeholder for the language usage dropdown',
    },
    languageUsageOnlyIcelandic: {
      id: 'cpn.application:memm.culture.languageUsageOnlyIcelandic',
      defaultMessage: 'Aðeins töluð íslenska',
      description: 'Language usage option: only Icelandic spoken',
    },
    languageUsageBoth: {
      id: 'cpn.application:memm.culture.languageUsageBoth',
      defaultMessage: 'Töluð íslenska og annað eða önnur tungumál',
      description: 'Language usage option: Icelandic and other language(s)',
    },
    languageUsageOnlyOther: {
      id: 'cpn.application:memm.culture.languageUsageOnlyOther',
      defaultMessage: 'Aðeins talað annað eða önnur tungumál en íslenska',
      description: 'Language usage option: only non-Icelandic language(s)',
    },
    languagesSectionTitle: {
      id: 'cpn.application:memm.culture.languagesSectionTitle',
      defaultMessage: 'Hvaða tungumál er töluð í nærumhverfi barnsins?',
      description: 'Title for the language multi-select section',
    },
    languagesSectionDescription: {
      id: 'cpn.application:memm.culture.languagesSectionDescription',
      defaultMessage:
        'Þú getur valið allt að fjórum tungumálum. Raðaðu tungumálunum eftir því hvaða tungumál er mest notað. Það sem er mest notað er nr. 1 og svo koll af kolli.',
      description: 'Description for the language multi-select section',
    },
    languagesLabel: {
      id: 'cpn.application:memm.culture.languagesLabel',
      defaultMessage: 'Tungumál',
      description: 'Label for the language multi-select field',
    },
    languagesPlaceholder: {
      id: 'cpn.application:memm.culture.languagesPlaceholder',
      defaultMessage: 'Veldu allt að fjögur tungumál',
      description: 'Placeholder for the language multi-select field',
    },
    preferredLanguageTitle: {
      id: 'cpn.application:memm.culture.preferredLanguageTitle',
      defaultMessage:
        'Af þeim tungumálum sem þú hefur valið, á hvaða tungumáli finnst barninu best að tjá sig á?',
      description: 'Question text above the preferred language dropdown',
    },
    preferredLanguageLabel: {
      id: 'cpn.application:memm.culture.preferredLanguageLabel',
      defaultMessage: 'Tungumál',
      description: 'Label for the preferred language dropdown',
    },
    preferredLanguagePlaceholder: {
      id: 'cpn.application:memm.culture.preferredLanguagePlaceholder',
      defaultMessage: 'Veldu tungumál',
      description: 'Placeholder for the preferred language dropdown',
    },
    needsInterpreter: {
      id: 'cpn.application:memm.culture.needsInterpreter',
      defaultMessage: 'Er þörf á túlkþjónustu?',
      description: 'Label for the interpreter need checkbox',
    },
  }),
  wellbeing: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:memm.wellbeing.subSectionTitle',
      defaultMessage: 'Farsæld',
      description: 'Farsæld sub-section title in sidebar',
    },
    description: {
      id: 'cpn.application:memm.wellbeing.description',
      defaultMessage:
        'Börn eru eins ólík og þau eru mörg og sum þeirra þurfa á stuðningi að halda til að líða betur og nýta styrkleika sína. Ef grunur er um fötlun, þroskafrávik eða langtímaveikindi sem geta haft áhrif á líðan og þroska barns, þá erum við þakklát fyrir þær vísbendingar.',
      description: 'Farsæld section description',
    },
    integratedServiceLabel: {
      id: 'cpn.application:memm.wellbeing.integratedServiceLabel',
      defaultMessage: 'Er barnið í samþættri þjónustu?',
      description: 'Label for integrated service radio field',
    },
    integratedServiceTooltip: {
      id: 'cpn.application:memm.wellbeing.integratedServiceTooltip',
      defaultMessage:
        'Með samþættri þjónustu er átt við að foreldri hefur óskað formlega eftir og gefið leyfi fyrir því að aðilar sem koma að stuðningi við barnið, tali sama og deili sín á milli upplýsingum sem geti hjálpað barninu',
      description: 'Tooltip for integrated service radio field',
    },
    wellbeingContactLabel: {
      id: 'cpn.application:memm.wellbeing.wellbeingContactLabel',
      defaultMessage: 'Er barnið með tengilið farsældar?',
      description: 'Label for welfare contact radio field',
    },
    wellbeingContactTooltip: {
      id: 'cpn.application:memm.wellbeing.wellbeingContactTooltip',
      defaultMessage:
        'Tengiliður farsældar er sá aðili sem veitir upplýsingar og leiðbeiningar og hefur verið foreldrum innan handar við að sækja um þjónustu fyrir barnið sitt.',
      description: 'Tooltip for welfare contact radio field',
    },
    wellbeingContactEmail: {
      id: 'cpn.application:memm.wellbeing.wellbeingContactEmail',
      defaultMessage: 'Netfang tengiliðar farsældar',
      description: 'Label for welfare contact email field',
    },
    wellbeingContactName: {
      id: 'cpn.application:memm.wellbeing.wellbeingContactName',
      defaultMessage: 'Nafn tengiliðar farsældar',
      description: 'Label for welfare contact name field',
    },
    wellbeingManagerLabel: {
      id: 'cpn.application:memm.wellbeing.wellbeingManagerLabel',
      defaultMessage: 'Er barnið með málastjóra farsældar?',
      description: 'Label for welfare manager radio field',
    },
    wellbeingManagerTooltip: {
      id: 'cpn.application:memm.wellbeing.wellbeingManagerTooltip',
      defaultMessage:
        'Málstjóri er sá aðili á vegum sveitarfélags sem tilnefndur hefur verið að stýra stuðningsteymi barns og styðja við fjölskyldu þess.',
      description: 'Tooltip for welfare manager radio field',
    },
    wellbeingManagerEmail: {
      id: 'cpn.application:memm.wellbeing.wellbeingManagerEmail',
      defaultMessage: 'Netfang málastjóra farsældar',
      description: 'Label for welfare manager email field',
    },
    wellbeingManagerName: {
      id: 'cpn.application:memm.wellbeing.wellbeingManagerName',
      defaultMessage: 'Nafn málastjóra farsældar',
      description: 'Label for welfare manager name field',
    },
    disabilityLabel: {
      id: 'cpn.application:memm.wellbeing.disabilityLabel',
      defaultMessage: 'Er grunur um fötlun barns?',
      description: 'Label for disability suspicion radio field',
    },
    disabilityTooltip: {
      id: 'cpn.application:memm.wellbeing.disabilityTooltip',
      defaultMessage:
        'Er átt við fötlun, þroskafrávik eða langtímaveikindi sem geta haft áhrif á líðan og þroska barns, til langtíma.',
      description: 'Tooltip for disability suspicion radio field',
    },
    disabilityServiceLabel: {
      id: 'cpn.application:memm.wellbeing.disabilityServiceLabel',
      defaultMessage: 'Þjónusta',
      description: 'Label for disability service dropdown',
    },
    disabilityServicePlaceholder: {
      id: 'cpn.application:memm.wellbeing.disabilityServicePlaceholder',
      defaultMessage: 'Veldu þjónustu',
      description: 'Placeholder for disability service dropdown',
    },
    disabilityServiceMunicipal: {
      id: 'cpn.application:memm.wellbeing.disabilityServiceMunicipal',
      defaultMessage: 'Þjónststofnun sveitarfélags',
      description: 'Disability service option: municipal service institution',
    },
    disabilityServiceSports: {
      id: 'cpn.application:memm.wellbeing.disabilityServiceSports',
      defaultMessage: 'Íþrótta-, tómstunda- og æskulýðsstarf',
      description: 'Disability service option: sports, leisure and youth work',
    },
    disabilityServiceHealth: {
      id: 'cpn.application:memm.wellbeing.disabilityServiceHealth',
      defaultMessage: 'Heilbrigðisaðili',
      description: 'Disability service option: health professional',
    },
    disabilityServiceEmergency: {
      id: 'cpn.application:memm.wellbeing.disabilityServiceEmergency',
      defaultMessage: 'Viðbragðsaðilar',
      description: 'Disability service option: emergency responders',
    },
  }),
}
