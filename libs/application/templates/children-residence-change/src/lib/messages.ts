import { defineMessages } from 'react-intl'

// Global string for the application
export const application = defineMessages({
  name: {
    id: 'crc.application:application.name',
    defaultMessage: 'Breytt lögheimili barna',
    description: 'Name of the Children Residence Change application',
  },
})

// All sections in the application
export const section = defineMessages({
  backgroundInformation: {
    id: 'crc.application:section.backgroundInformation',
    defaultMessage: 'Grunnupplýsingar',
    description: 'Background information',
  },
  arrangement: {
    id: 'crc.application:section.arrangement',
    defaultMessage: 'Fyrirkomulag',
    description: 'Arrangement',
  },
  effect: {
    id: 'crc.application:section.effect',
    defaultMessage: 'Áhrif umsóknar',
    description: 'Effect of Application',
  },
  overview: {
    id: 'crc.application:section.overview',
    defaultMessage: 'Yrirlit og undirritun',
    description: 'Overview and Signing',
  },
  received: {
    id: 'crc.application:section.received',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application Received',
  },
})

// External information retrieval
export const externalData = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'crc.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
      description: 'External information retrieval subtitle',
    },
    checkboxLabel: {
      id: 'crc.application:section.backgroundInformation.externalData.subTitle',
      defaultMessage: 'Ég samþykki gagnaöflun',
      description: 'External information retrieval checkbox label',
    },
  }),
  applicant: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.applicant.title',
      defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
      description:
        'Title: External Info about applicant from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.applicant.subTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description:
        'Subtitle: External Info about applicant from the National Registry',
    },
  }),
  children: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.children.title',
      defaultMessage: 'Grunnupplýsingar um börn',
      description:
        'Title: External Info about applicants children from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.children.subTitle',
      defaultMessage:
        'Nöfn, kennitölur og núverandi lögheimili barna í þinni forsjá.',
      description:
        'Subtitle: External Info about applicants children from the National Registry',
    },
  }),
  otherParents: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.externalData.otherParents.title',
      defaultMessage: 'Grunnupplýsingar um foreldra',
      description:
        'Title: External Info about other parents from the National Registry',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.externalData.otherParents.subTitle',
      defaultMessage: 'Nöfn, kennitölur og lögheimili forelda barnanna.',
      description:
        'Subtitle: External Info about other parents from the National Registry',
    },
  }),
}

// Select children
export const selectChildren = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.sectionTitle',
      defaultMessage: 'Velja barn/börn',
      description: 'Select children section title',
    },
    pageTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.pageTitle',
      defaultMessage: 'Veldu barn/börn',
      description: 'Select children page title',
    },
    subTitle: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.subTitle',
      defaultMessage:
        'Hér sérðu lista yfir börn sem eru skráð í þinni forsjá. Þú getur valið fyrir hvaða barn/börn á að flytja lögheimili.',
      description: 'Select children subtitle',
    },
  }),
  checkboxes: defineMessages({
    title: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.checkboxes.title',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Title: displayed above checkboxes',
    },
    subLabel: {
      id:
        'crc.application:section.backgroundInformation.selectChildren.checkboxes.sublabel',
      defaultMessage: 'Hitt forsjárforeldrið er {parentName}',
      description: 'Sublabel: displayed below a childs name',
    },
  }),
}

// Confirm other parent
export const otherParent = {
  general: defineMessages({
    sectionTitle: {
      id:
        'crc.application:section.backgroundInformation.otherParent.sectionTitle',
      defaultMessage: 'Staðfesta foreldri',
      description: 'Other parent section title',
    },
    pageTitle: {
      id: 'crc.application:section.backgroundInformation.otherParent.pageTitle',
      defaultMessage: 'Staðfestu upplýsingar um hitt foreldrið',
      description: 'Other parent page title',
    },
    description: {
      id:
        'crc.application:section.backgroundInformation.otherParent.description',
      defaultMessage: 'Hitt foreldrið er ${parentName} (${parentSSN})',
      description: 'Other parent page description',
    },
  }),
  inputs: defineMessages({
    description: {
      id:
        'crc.application:section.backgroundInformation.otherParent.inputs.description',
      defaultMessage:
        'Til að afla samþykkis hins foreldrisins þurfum við að fá netfang og símanúmer viðkomandi.',
      description: 'Description for inputs',
    },
    emailLabel: {
      id:
        'crc.application:section.backgroundInformation.otherParent.inputs.emailLabel',
      defaultMessage: 'Netfang',
      description: 'Email label',
    },
    phoneNumberLabel: {
      id:
        'crc.application:section.backgroundInformation.otherParent.inputs.phoneNumberLabel',
      defaultMessage: 'Símanúmer',
      description: 'Phone number label',
    },
  }),
}

// Reason
export const reason = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.reason.sectionTitle',
      defaultMessage: 'Tilefni',
      description: 'Reason for change section title',
    },
    pageTitle: {
      id: 'crc.application:section.arrangement.reason.pageTitle',
      defaultMessage: 'Hvert er tilefni breytingar á lögheimili?',
      description: 'Reason for change page title',
    },
  }),
  input: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.reason.input.label',
      defaultMessage: 'Tilefni',
      description: 'Label for reason for change input',
    },
    placeholder: {
      id: 'crc.application:section.arrangement.reason.input.placeholder',
      defaultMessage:
        'Skrifaðu hér í stuttu máli ástæðu þess að lögheimili barnsins er að færast á milli foreldra',
      description: 'Placeholder for reason for change input',
    },
  }),
}

// New Legal Residence
export const newResidence = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.newResidence.sectionTitle',
      defaultMessage: 'Nýtt lögheimili',
      description: 'New legal residence section title',
    },
    pageTitle: {
      id: 'crc.application:section.arrangement.newResidence.pageTitle',
      defaultMessage: 'Hvert á að flytja lögheimilið?',
      description: 'New legal residence page title',
    },
    description: {
      id: 'crc.application:section.arrangement.newResidence.description',
      defaultMessage:
        '<p>Sem foreldrar með sameiginlega forsjá getið þið óskað eftir því að lögheimili barns færist frá þér til hins foreldrisins, eða öfugt.</p><p>Vinsamlegast staðfestu að lögheimilisflutningur sé eins og fram kemur hér fyrir neðan:</p>',
      description: 'New legal residence page description',
    },
  }),
  information: defineMessages({
    currentResidenceLabel: {
      id:
        'crc.application:section.arrangement.newResidence.information.currentResidenceLabel',
      defaultMessage: 'Núverandi lögheimili barna:',
      description: 'Label for current residence',
    },
    newResidenceLabel: {
      id:
        'crc.application:section.arrangement.newResidence.information.newResidenceLabel',
      defaultMessage: 'Nýtt lögheimili barna:',
      description: 'Label for new residence',
    },
  }),
  checkbox: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.newResidence.checkbox.label',
      defaultMessage: 'Ég staðfesti að ofangreindar upplýsingar séu réttar',
      description: 'Confirm new residence label',
    },
  }),
}

// Transfer duration
export const duration = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.arrangement.duration.sectionTitle',
      defaultMessage: 'Gildistími samnings',
      description: 'Duration section title',
    },
    pageTitle: {
      id: 'crc.application:section.arrangement.duration.pageTitle',
      defaultMessage: 'Í hve langan tíma á samningurinn að gilda?',
      description: 'Duration page title',
    },
    description: {
      id: 'crc.application:section.arrangement.duration.description',
      defaultMessage:
        '<p>Veldu í hversu langan tíma samningurinn á að gilda. Hægt er að gera tímabundna lögheimilsbreytingu til a.m.k. 6 mánaða eða lengur eða velja að samningur gildi til frambúðar.</p><p>Ekki er hægt að gera nýjan samning innan 6 mánaða frá gildistöku breytingar.</p><p>Athugið að samningurinn tekur gildi þann dag sem sýslumaður staðfestir samninginn og getur þar af leiðandi ekki verið afturvirkur.</p><p>Samningurinn verður staðfestur innan 14 daga.</p>',
      description: 'Duration page description',
    },
  }),
  permanentInput: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.duration.permanent.label',
      defaultMessage: 'Til frambúðar',
      description: 'Label for permanent change',
    },
    subLabel: {
      id: 'crc.application:section.arrangement.duration.permanent.subLabel',
      defaultMessage: 'Samningurinn gildir til 18 ára aldurs barns',
      description: 'Sub label for permanent change',
    },
    tooltip: {
      id: 'crc.application:section.arrangement.duration.permanent.tooltip',
      defaultMessage:
        'Varanlegur samningur gildir þar til barnið hefur náð 18 ára aldri. Til að breyta fyrirkomulaginu til baka þarf að útbúa og undirrita nýjan samning.',
      description: 'Tooltip for permanent change',
    },
  }),
  temporaryInput: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.duration.temporary.label',
      defaultMessage: 'Tímabundið',
      description: 'Label for temporary change',
    },
    subLabel: {
      id: 'crc.application:section.arrangement.duration.temporary.subLabel',
      defaultMessage: '6 mánuðir eða lengur',
      description: 'Sub label for temporary change',
    },
    tooltip: {
      id: 'crc.application:section.arrangement.duration.temporary.tooltip',
      defaultMessage:
        'Tímabundinn samningur getur minnst verið til 6 mánaða. Að tímabili loknu þurfa foreldrar að óska eftir því við Þjóðskrá að lögheimilisskráning fari til fyrra horfs.',
      description: 'Tooltip for temporary change',
    },
  }),
  dateInput: defineMessages({
    label: {
      id: 'crc.application:section.arrangement.duration.dateInput.label',
      defaultMessage: 'Gildir til',
      description: 'Label for date input',
    },
    placeholder: {
      id: 'crc.application:section.arrangement.duration.dateInput.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Sub label for date input',
    },
  }),
}

// Terms
export const terms = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.effect.terms.sectionTitle',
      defaultMessage: 'Áhrif umsóknar',
      description: 'Terms section title',
    },
    pageTitle: {
      id: 'crc.application:section.effect.terms.pageTitle',
      defaultMessage: 'Hvaða áhrif hefur breytingin?',
      description: 'Terms page title',
    },
    description: {
      id: 'crc.application:section.effect.terms.description',
      defaultMessage:
        '<h4>Meiri heimildir lögheimilisforeldris</h4><p>Barn getur aðeins átt eitt lögheimili og hefur skráning þess margvísleg áhrif. Réttarstaða lögheimilisforeldris er önnur en réttarstaða umgengnisforeldris. Það hefur ríkari heimildir til ákvarðanatöku um málefni barns en umgengnisforeldri. </p><h4>Samráð foreldra um ákvarðanir</h4><p>Foreldrar sem fara sameiginlega með forsjá barns eiga alltaf að leitast við að hafa samráð áður en teknar eru afgerandi ákvarðanir um málefni barns er varða daglegt líf þess, til dæmis um hvar barnið skuli eiga lögheimili og um val á leik- og grunnskóla, um venjulega eða nauðsynlega heilbrigðisþjónustu og reglubundið tómstundastarf.</p><h4>Ef samráð foreldra skilar ekki árangri</h4><p>Lögheimilisforeldrið hefur á hinn bóginn heimild til þess að taka þessar ákvarðanir, ef samráðið skilar ekki árangri. Lögheimilisforeldri hefur því heimild til þess að flytja með barn innanlands og ákveða í hvaða skóla barn skuli ganga. Þá á foreldrið sem barn er með lögheimili hjá, rétt á að fá meðlag með barninu frá hinu foreldrinu og barnabætur falla til lögheimilisforeldrisins. Jafnframt getur lögheimili barns haft áhrif í ýmsu öðru tilliti, svo sem á húsaleigubætur, námslán, greiðslur vegna örorku, umönnunarbætur og fleira sem þarf að skoða í hverju tilviki. Það er því mjög þýðingarmikið atriði að ákveða hjá hvoru foreldri barn skuli eiga lögheimili.</p><h4>Réttur barns til umgengni við hitt foreldrið</h4><p>Litið er svo á að barn hafi fasta búsetu hjá því foreldri sem það á lögheimili hjá. Barn á rétt til að umgangast með reglubundnum hætti það foreldri sem það býr ekki hjá og bera foreldrarnir sameiginlega þá skyldu að tryggja rétt barns til umgengni.</p>',
      description: 'Duration page description',
    },
  }),
  residenceChangeCheckbox: defineMessages({
    label: {
      id: 'crc.application:section.effect.terms.residenceChange.label',
      defaultMessage: 'Ég skil hvaða áhrif lögheimilisbreyting hefur',
      description: 'Label for residence change checkbox',
    },
  }),
  childBenefitCheckbox: defineMessages({
    label: {
      id: 'crc.application:section.effect.terms.childBenefit.label',
      defaultMessage:
        'Ég skil að réttur til meðlagsgreiðslna flyst með barninu',
      description: 'Label for child benefit checkbox',
    },
  }),
  familySupportCheckbox: defineMessages({
    label: {
      id: 'crc.application:section.effect.terms.familySupport.label',
      defaultMessage:
        'Ég skil að réttur til barnabótagreiðslna flyst með barninu',
      description: 'Label for family support checkbox',
    },
  }),
}

// Contract
export const contract = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.contract.overview.sectionTitle',
      defaultMessage: 'Yfirlit og undirritun',
      description: 'Contract section title',
    },
    pageTitle: {
      id: 'crc.application:section.contract.overview.pageTitle',
      defaultMessage: 'Samningur',
      description: 'Contract page title',
    },
    description: {
      id: 'crc.application:section.contract.overview.description',
      defaultMessage:
        '<p>Hér er yfirlit yfir samning um breytt lögheimili. <strong>Þú og {otherParent}</strong> þurfa að staðfesta með undirritun áður en umsóknin fer í afgreiðslu hjá sýslumanni.</p>',
      description: 'Contract page description',
    },
  }),
  labels: defineMessages({
    childName: {
      id: 'crc.application:section.contract.overview.labels.childName',
      defaultMessage:
        '{count, plural, =0 {Nafn barns} one {Nafn barns} other {Nöfn barna}}',
      description: 'Label for a child names',
    },
    otherParentContactInformation: {
      id:
        'crc.application:section.contract.overview.labels.otherParentContactInformation',
      defaultMessage: 'Tengiliðaupplýsingar hins foreldrisins',
      description: 'Label for other parent contact information',
    },
    currentResidence: {
      id: 'crc.application:section.contract.overview.labels.currentResidence',
      defaultMessage:
        'Núverandi lögheimili {count, plural, =0 {barns} one {barns} other {barna}}:',
      description: 'Label for current residence',
    },
    newResidence: {
      id: 'crc.application:section.contract.overview.labels.newResidence',
      defaultMessage:
        'Nýtt lögheimili {count, plural, =0 {barns} one {barns} other {barna}}:',
      description: 'Label for new residence',
    },
  }),
}
