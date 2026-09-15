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
  }),
  education: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:memm.education.subSectionTitle',
      defaultMessage: 'Menntun',
      description: 'Menntun sub-section title in sidebar',
    },
    title: {
      id: 'cpn.application:memm.education.title',
      defaultMessage: 'Menntun eða dagvistun barns',
      description: 'Menntun sub-section heading on the page',
    },
    description: {
      id: 'cpn.application:memm.education.description',
      defaultMessage: 'Skólastig eða dagvistun sem við á og heiti.',
      description: 'Menntun sub-section description',
    },
    typeLabel: {
      id: 'cpn.application:memm.education.typeLabel',
      defaultMessage: 'Skólastig eða dagvistun',
      description: 'Label for the education type dropdown',
    },
    typePlaceholder: {
      id: 'cpn.application:memm.education.typePlaceholder',
      defaultMessage: 'Veldu skólastig eða dagvistun',
      description: 'Placeholder for the education type dropdown',
    },
    schoolName: {
      id: 'cpn.application:memm.education.schoolName',
      defaultMessage: 'Nafn á skóla',
      description: 'Label for school name text field',
    },
  }),
  reception: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:memm.reception.subSectionTitle',
      defaultMessage: 'Móttaka',
      description: 'Móttaka sub-section title in sidebar',
    },
    seekingAsylumLabel: {
      id: 'cpn.application:memm.reception.seekingAsylumLabel',
      defaultMessage: 'Barnið er umsækjandi um alþjóðlega vernd',
      description: 'Label for seeking asylum radio field',
    },
    seekingAsylumTooltip: {
      id: 'cpn.application:memm.reception.seekingAsylumTooltip',
      defaultMessage:
        'Barnið hefur ekki dvalarleyfi á Íslandi en hefur óskað eftir viðurkenningu á stöðu sinni sem flóttamaður eða ríkisfangslaus einstaklingur hér á landi.',
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
        'Barnið er með dvalarleyfi á grundvelli alþjóðlegrar verndar.',
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
        'Upplýsingar t.d. um ríkisfang, fæðingarstað og dagsetningu nýskráningar barns inn í landið eru ekki birtar hér en hafa verið sóttar og verða sendar með tilkynningunni til barnaverndar.',
      description:
        'Info alert shown when child data has been fetched from national registry',
    },
  }),
  culture: defineMessages({
    title: {
      id: 'cpn.application:memm.culture.title',
      defaultMessage: 'Tungumál',
      description: 'Menning sub-section title on the page',
    },
    subSectionTitle: {
      id: 'cpn.application:memm.culture.subSectionTitle',
      defaultMessage: 'Menning',
      description: 'Menning sub-section title in sidebar',
    },
    languageUsageQuestion: {
      id: 'cpn.application:memm.culture.languageUsageQuestion',
      defaultMessage: 'Hvað á best við tungumála notkun á heimili barnsins?',
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
      description: 'Language usage option: only Icelandic',
    },
    languageUsageIcelandicAndOther: {
      id: 'cpn.application:memm.culture.languageUsageIcelandicAndOther',
      defaultMessage: 'Töluð íslenska og annað eða önnur tungumál',
      description: 'Language usage option: Icelandic and other language',
    },
    languageUsageOnlyOther: {
      id: 'cpn.application:memm.culture.languageUsageOnlyOther',
      defaultMessage: 'Aðeins talað annað eða önnur tungumál en íslenska',
      description: 'Language usage option: only other language than Icelandic',
    },
    languagesSectionTitle: {
      id: 'cpn.application:memm.culture.languagesSectionTitle',
      defaultMessage: 'Hvaða tungumál eru töluð á heimili barnsins?',
      description: 'Title for the language multi-select section',
    },
    languagesSectionDescription: {
      id: 'cpn.application:memm.culture.languagesSectionDescription',
      defaultMessage:
        'Þú getur valið allt að fjögur tungumál. Raðaðu tungumálunum eftir því hvaða tungumál er mest notað. Það sem er mest notað er nr. 1 og svo koll af kolli.',
      description: 'Description for the language multi-select section',
    },
    languagesPlaceholder: {
      id: 'cpn.application:memm.culture.languagesPlaceholder',
      defaultMessage: 'Veldu allt að fjögur tungumál',
      description: 'Placeholder for the language multi-select field',
    },
    preferredLanguageTitle: {
      id: 'cpn.application:memm.culture.preferredLanguageTitle',
      defaultMessage: 'Á hvaða tungumáli finnst barninu best að tjá sig?',
      description: 'Question text above the preferred language dropdown',
    },
    disabilityLabel: {
      id: 'cpn.application:memm.culture.disabilityLabel',
      defaultMessage: 'Er grunur um fötlun barns?',
      description: 'Label for disability suspicion radio field',
    },
    disabilityTooltip: {
      id: 'cpn.application:memm.culture.disabilityTooltip',
      defaultMessage:
        'Er átt við fötlun, þroskafrávik eða langtímaveikindi sem geta haft áhrif á líðan og þroska barns, til langtíma.',
      description: 'Tooltip for disability suspicion radio field',
    },
    disabilityServiceLabel: {
      id: 'cpn.application:memm.culture.disabilityServiceLabel',
      defaultMessage: 'Lýsing',
      description: 'Label for disability service dropdown',
    },
  }),
  wellbeing: defineMessages({
    subSectionTitle: {
      id: 'cpn.application:memm.wellbeing.subSectionTitle',
      defaultMessage: 'Farsæld',
      description: 'Farsæld sub-section title in sidebar',
    },
    integratedServiceLabel: {
      id: 'cpn.application:memm.wellbeing.integratedServiceLabel',
      defaultMessage: 'Er barnið í samþættri þjónustu?',
      description: 'Label for integrated service radio field',
    },
    integratedServiceTooltip: {
      id: 'cpn.application:memm.wellbeing.integratedServiceTooltip',
      defaultMessage:
        'Með samþættri þjónustu er átt við að foreldri hefur óskað formlega eftir og gefið leyfi fyrir því að aðilar sem koma að stuðningi við barnið, tali saman og deili sín á milli upplýsingum sem hjálpað getað barni.',
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
        'Tengiliður farsældar er sá aðili sem styður við samþættingu fyrsta stigs þjónustu í þágu farsældar barna.',
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
      defaultMessage: 'Er barnið með málstjóra farsældar?',
      description: 'Label for welfare manager radio field',
    },
    wellbeingManagerTooltip: {
      id: 'cpn.application:memm.wellbeing.wellbeingManagerTooltip',
      defaultMessage:
        'Málstjóri er sá aðili á vegum sveitarfélags sem tilnefndur hefur verið til að stýra stuðningsteymi barns og styðja við fjölskyldu þess.',
      description: 'Tooltip for welfare manager radio field',
    },
    wellbeingManagerEmail: {
      id: 'cpn.application:memm.wellbeing.wellbeingManagerEmail',
      defaultMessage: 'Netfang málstjóra farsældar',
      description: 'Label for welfare manager email field',
    },
    wellbeingManagerName: {
      id: 'cpn.application:memm.wellbeing.wellbeingManagerName',
      defaultMessage: 'Nafn málstjóra farsældar',
      description: 'Label for welfare manager name field',
    },
  }),
}
