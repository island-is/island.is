import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'aod.application:applicationTitle',
    defaultMessage: 'Andlátstilkynning',
    description: 'Application for Announcment of Death',
  },
  applicationInstitution: {
    id: 'aod.application:applicationInstitution',
    defaultMessage: 'Sýslumenn',
    description: 'District commissioner behind the application',
  },
  applicationDelegated: {
    id: 'aod.application:applicationDelegated',
    defaultMessage: 'Andlátstilkynning færð yfir á aðra manneskju',
    description: 'Application delegated to another person',
  },

  /* Data Collection Section */
  dataCollectionTitle: {
    id: 'aod.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionSubtitle: {
    id: 'aod.application:dataCollectionSubtitle',
    defaultMessage:
      'Eftirfarandi upplýsingar um hinn látna verða sóttar rafrænt',
    description: 'Subtitle for data collection section',
  },
  dataCollectionDescription: {
    id: 'aod.application:dataCollectionDescription',
    defaultMessage:
      'Svo hægt sé að afgreiða umsókn þína um stæðiskort, þarf að sækja eftirfarandi gögn með þínu samþykki.',
    description: 'Description for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'aod.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég samþykki að láta sækja gögn',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'aod.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'aod.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage:
      'Upplýsingar frá Þjóðskrá um fæðingardag, heimilisfang, fjölskylduhagi og hjúskaparstöðu.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'cr.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'aod.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráaðar upplýsingar um síma og netfang á Mínum Síðum inná Ísland.is kemur það sjálfkrafa í umsókn þína.',
    description:
      'In order to apply for this application we need your email and phone number',
  },

  /* The deceased */
  deceasedName: {
    id: 'aod.application:deceasedName',
    defaultMessage: 'Nafn',
    description: 'Name of the deceased person',
  },
  deceasedNationalId: {
    id: 'aod.application:deceasedNationalId',
    defaultMessage: 'Kennitala',
    description: 'National id of the deceased person',
  },
  deceasedDate: {
    id: 'aod.application:deceasedDate',
    defaultMessage: 'Dánardagur',
    description: 'Date of death',
  },

  /* Confirmation of role as manager or choose another person for the role */
  roleConfirmationHeading: {
    id: 'aod.application:roleConfirmationHeading',
    defaultMessage: 'Andlátstilkynning',
    description: 'Role confirmation heading',
  },
  roleConfirmationSectionTitle: {
    id: 'aod.application:roleConfirmationSectionTitle',
    defaultMessage: 'Inngangur',
    description: 'Role confirmation section title',
  },
  roleConfirmationNotice: {
    id: 'aod.application:roleConfirmationNotice',
    defaultMessage:
      'Ferlið vistast sjálfkrafa á meðan það er fyllt út og hægt er að opna það aftur inn á Mínar síður á Ísland.is. Sjáir þú þér ekki fært um að sinna þessu ferli skaltu senda umsóknina áfram á réttan aðila.',
    description: 'Role confirmation notice',
  },
  roleConfirmationDescription: {
    id: 'aod.application:roleConfirmationDescription',
    defaultMessage:
      'Þú hefur fengið umsjón yfir andlátstilkynningu fyrir viðkomandi aðila. Sem nánasti aðstandandi færðu það hlutverk að sækja um dánarvottorð, tilkynna um eignir í dánarbúi og fá heimild til úttektar fyrir útfararkostnað. Andlát ber að tilkynna til sýslumanns í því umdæmi sem hinn látni hafði lögheimili og getur útför farið fram þegar sýslumaður hefur staðfest móttöku dánarvottorðs.',
    description: 'Role confirmation description',
  },
  roleConfirmationContinue: {
    id: 'aod.application:roleConfirmationContinue',
    defaultMessage: 'Samþykki að halda áfram með tilkynningu.',
    description: 'Role confirmation continue with role',
  },
  roleConfirmationDelegate: {
    id: 'aod.application:roleConfirmationDelegate',
    defaultMessage: 'Senda umsókn áfram á annan aðila.',
    description: 'Role confirmation delegate role',
  },
  delegateRoleDisclaimer: {
    id: 'aod.application:delegateRoleDisclaimer',
    defaultMessage:
      'Þegar andlátstilkynning hefur verið send á annan aðila verður hún eingöngu virk hjá þeim aðila.',
    description: 'Delegate role disclaimer',
  },
  delegateRoleSSN: {
    id: 'aod.application:delegateRoleSSN',
    defaultMessage: 'Kennitala viðtakanda',
    description: 'Delegate role SSN',
  },
  delegateRoleName: {
    id: 'aod.application:delegateRoleName',
    defaultMessage: 'Nafn',
    description: 'Delegate role name',
  },

  /* Testament step */
  testamentTitle: {
    id: 'aod.application:testamentTitle',
    defaultMessage: 'Erfðaskrá og kaupmáli',
    description: 'Testament step title',
  },
  testamentDescription: {
    id: 'aod.application:testamentDescription',
    defaultMessage:
      'Upplýsingar um erfðaskrá og kaupmála eru sóttar til Sýslumanns. Ef fleiri en ein erfðaskrá er til staðar er mikilvægt að koma frumriti eða upplýsingum um þær til sýslumanns eins fljótt og kostur er.',
    description: 'Testament step description',
  },
  testamentTestamentAvailable: {
    id: 'aod.application:testamentTestamentAvailable',
    defaultMessage: 'Erfðaskrá í vörslu sýslumanns',
    description: 'Testament step testament available',
  },
  testamentBuyration: {
    id: 'aod.application:testamentBuyration',
    defaultMessage: 'Kaupmáli',
    description: 'Testament step buyration',
  },
  testamentKnowledgeOfOtherTestament: {
    id: 'aod.application:testamentKnowledgeOfOtherTestament',
    defaultMessage: 'Vitneskja um aðra erfðaskrá',
    description: 'Testament step knowledge of other testament',
  },
  testamentKnowledgeOfOtherTestamentYes: {
    id: 'aod.application:testamentKnowledgeOfOtherTestamentYes',
    defaultMessage: 'Já',
    description: 'Testament step knowledge of other testament answer yes',
  },
  testamentKnowledgeOfOtherTestamentNo: {
    id: 'aod.application:testamentKnowledgeOfOtherTestamentNo',
    defaultMessage: 'Nei',
    description: 'Testament step knowledge of other testament answer no',
  },

  /* Inheritance step */
  inheritanceTitle: {
    id: 'aod.application:inheritanceTitle',
    defaultMessage: 'Erfingjar',
    description: 'Inheritance step title',
  },
  inheritanceDescription: {
    id: 'aod.application:inheritanceDescription#markdown',
    defaultMessage: `Erfðaréttur byggist á skyldleika, ættleiðingu, hjúskap og erfðaskrá hins látna. Ef hinn látni var:

* Í hjúskap og/eða átti börn: erfa maki og/eða börn hinn látna. Ef barn er látið taka afkomendur barnsins arf í þess stað.
* Einhleypur: erfa foreldrar og/eða systkini og/eða afkomendur þeirra hinn látna. Ef enginn þeirra er á lífi erfa afar og ömmur hinn látna eða börn þeirra.
* Búinn að gera erfðaskrá: erfir einstaklingur og/eða lögaðili, sem tilgreindur er í erfðaskránni, hinn látna.

Ef ekkert á við sem hér að ofan er talið rennur arfur í ríkissjóð. Nánari upplýsingar má finna á (Ísland.is)[https://island.is]`,
    description: 'Inheritance step title',
  },
  inheritanceMembersOfEstateTitle: {
    id: 'aod.application:inheritanceMembersOfEstateTitle',
    defaultMessage: 'Aðilar að dánarbúi',
    description: 'Inheritance step members of estate title',
  },
  inheritanceAddMember: {
    id: 'aod.application:inheritanceAddMember',
    defaultMessage: 'Bæta við erfingja',
    description: 'Inheritance step add member of estate',
  },
  inheritanceRemoveMember: {
    id: 'aod.application:inheritanceRemoveMember',
    defaultMessage: 'Eyða',
    description: 'Inheritance step remove member of estate',
  },
  inheritanceKtLabel: {
    id: 'aod.application:inheritanceKtLabel',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },
  inheritanceRelationLabel: {
    id: 'aod.application:inheritanceRelationLabel',
    defaultMessage: 'Tengsl',
    description: 'Relation label',
  },
  inheritanceRelationPlaceholder: {
    id: 'aod.application:inheritanceRelationPlaceholder',
    defaultMessage: 'Veldu tengsl',
    description: 'Relation placeholder',
  },
  inheritanceNameLabel: {
    id: 'aod.application:inheritanceNameLabel',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  inheritanceCustodyLabel: {
    id: 'aod.application:inheritanceCustodyLabel',
    defaultMessage: 'Forsjáraðili',
    description: 'Custody label',
  },
  inheritanceForeignCitizenshipLabel: {
    id: 'aod.application:inheritanceForeignCitizenshipLabel',
    defaultMessage: 'Aðili án íslenskrar kennitölu',
    description: 'No icelandic ssn label',
  },
  inheritanceDayOfBirthLabel: {
    id: 'aod.application:inheritanceDayOfBirthLabel',
    defaultMessage: 'Fæðingardagur',
    description: 'Day of birth label',
  },

  /* Properties step */
  propertiesTitle: {
    id: 'aod.application:propertiesTitle',
    defaultMessage: 'Eignir',
    description: 'Properties title',
  },
  propertiesDescription: {
    id: 'aod.application:propertiesDescription',
    defaultMessage:
      'Upplýsingar um eignir og ökutæki hafa verið sóttar rafrænt. Vinsamlega bætið við upplýsingum ef eitthvað vantar. Taktu þér góðan tíma í að fylla þetta út eftir bestu getu. ',
    description: 'Properties description',
  },
  realEstatesTitle: {
    id: 'aod.application:realEstatesTitle',
    defaultMessage: 'Fasteignir',
    description: 'Real estates and lands title',
  },
  realEstatesDescription: {
    id: 'aod.application:realEstatesDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir.',
    description: 'Real estates and lands description',
  },
  vehiclesTitle: {
    id: 'aod.application:vehiclesTitle',
    defaultMessage: 'Faratæki',
    description: 'Vehicles title',
  },
  vehiclesDescription: {
    id: 'aod.application:vehiclesDescription',
    defaultMessage: 'Til dæmis bifreiðar, flugvélar og bátar.',
    description: 'Vehicles description',
  },
  otherPropertiesTitle: {
    id: 'aod.application:otherPropertiesTitle',
    defaultMessage: 'Aðrar eignir',
    description: 'Other properties title',
  },
  otherPropertiesDescription: {
    id: 'aod.application:otherPropertiesDescription',
    defaultMessage: 'Merktu við það sem á við eftir bestu vitund.',
    description: 'Other properties description',
  },
  otherPropertiesAccounts: {
    id: 'aod.application:otherPropertiesAccounts',
    defaultMessage: 'Bankareikningar, verðbréf eða hlutabréf',
    description: 'Other properties option: Accounts',
  },
  otherPropertiesOwnBusiness: {
    id: 'aod.application:otherPropertiesOwnBusiness',
    defaultMessage: 'Eigin rekstur',
    description: 'Other properties option: Own business',
  },
  otherPropertiesResidence: {
    id: 'aod.application:otherPropertiesResidence',
    defaultMessage: 'Búseturéttur vegna kaupleigu íbúða',
    description: 'Other properties option: Residence',
  },
  otherPropertiesAssetsAbroad: {
    id: 'aod.application:otherPropertiesAssetsAbroad',
    defaultMessage: 'Eignir erlendis',
    description: 'Other properties option: Assets abroad',
  },
  propertyNumber: {
    id: 'aod.application:propertyNumber',
    defaultMessage: 'Fastanúmer',
    description: 'Property number label',
  },
  address: {
    id: 'aod.application:address',
    defaultMessage: 'Heimilisfang',
    description: 'Address label',
  },
  addProperty: {
    id: 'aod.application:addProperty',
    defaultMessage: 'Bæta við fasteign eða lóð',
    description: 'Add property',
  },
  addVehicle: {
    id: 'aod.application:addVehicle',
    defaultMessage: 'Bæta við ökutæki',
    description: 'Add vehicle',
  },
  vehicleNumberLabel: {
    id: 'aod.application:vehicleNumberLabel',
    defaultMessage: 'Skráninganúmer ökutækis',
    description: 'Vehicle number label',
  },
  vehicleTypeLabel: {
    id: 'aod.application:vehicleTypeLabel',
    defaultMessage: 'Tegund faratækis',
    description: 'Vehicle type label',
  },

  /* Validation */
  errorRoleConfirmation: {
    id: 'aod.application:error.errorRoleConfirmation',
    defaultMessage: 'Þú verður að velja einn möguleika',
    description: 'Role confirmation is invalid',
  },
  errorNationalIdIncorrect: {
    id: 'aod.application:error.nationalIdIncorrect',
    defaultMessage: 'Þessi kennitala virðist ekki vera rétt',
    description: 'National id is invalid',
  },
  errorPhoneNumber: {
    id: 'aod.application:error.errorPhoneNumber',
    defaultMessage: 'Símanúmer virðist ekki vera rétt',
    description: 'Phone number is invalid',
  },
  errorEmail: {
    id: 'aod.application:error.errorEmail',
    defaultMessage: 'Netfang virðist ekki vera rétt',
    description: 'Email is invalid',
  },
  errorRelation: {
    id: 'aod.application:error.errorRelation',
    defaultMessage: 'Netfang virðist ekki vera rétt',
    description: 'Email is invalid',
  },

  /* Announcement */
  announcementTitle: {
    id: 'aod.application:announcementTitle',
    defaultMessage: 'Tilkynnandi',
    description: 'Announcement section title',
  },
  announcementDescription: {
    id: 'aod.application:announcementDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: 'Announcement description',
  },

  /* Applicant - used in information and overview sections */
  infoSectionTitle: {
    id: 'aod.application:infoSectionTitle',
    defaultMessage: 'Upplýsingar',
    description: 'info section title',
  },
  applicantsName: {
    id: 'aod.application:applicantsName',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  applicantsNationalId: {
    id: 'aod.application:applicantsNationalId',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },
  applicantsAddress: {
    id: 'aod.application:applicantsAddress',
    defaultMessage: 'Heimilisfang',
    description: 'Address label',
  },
  applicantsCity: {
    id: 'aod.application:applicantsCity',
    defaultMessage: 'Staður',
    description: 'City label',
  },
  applicantsEmail: {
    id: 'aod.application:applicantsEmail',
    defaultMessage: 'Netfang',
    description: 'Email label',
  },
  applicantsPhoneNumber: {
    id: 'aod.application:applicantsPhoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Phone number label',
  },
  applicantsRelation: {
    id: 'aod.application:applicantsRelation',
    defaultMessage: 'Tengsl',
    description: 'Relation label',
  },
  applicantsRelationPlaceholder: {
    id: 'aod.application:applicantsRelationPlaceholder',
    defaultMessage: 'Veldu tengsl',
    description: 'Relation placeholder',
  },
  cardValidityPeriod: {
    id: 'aod.application:cardValidityPeriod',
    defaultMessage: 'Gildistími',
    description: 'Card validity label',
  },

  /* Delegated */
  delegatedTitle: {
    id: 'aod.application:delegatedTitle',
    defaultMessage: 'Takk fyrir',
    description: 'Delegated title',
  },
  delegatedDescription: {
    id: 'aod.application:delegatedDescription',
    defaultMessage:
      'Tilkynningarferlið hefur verið sent áfram. Viðkomandi fær send skilaboð á næstu mínútum til þess að taka við ferlinu.',
    description: 'Delegated title',
  },
  delegatedMyPagesLinkText: {
    id: 'aod.application:delegatedMyPagesLinkText',
    defaultMessage: 'Mínar síður',
    description: 'My pages link text',
  },
  delegatedSubSectionTitle: {
    id: 'aod.application:delegatedSubSectionTitle',
    defaultMessage: 'Áframsenda',
    description: 'Delegate section title',
  },

  /* Completed */
  congratulationsTitleSuccess: {
    id: 'aod.application:congratulationsTitleSuccess',
    defaultMessage:
      'Umsókn þín um stæðiskort hefur verið móttekin. Þú færð stæðiskortið afhent á uppgefið heimilisfang/afhendingarstað eftir 3-5 virka daga.',
    description: 'Your application for P-sign was successful.',
  },
  congratulationsTitle: {
    id: 'aod.application:congratulationsTitle',
    defaultMessage: 'Til hamingju',
    description: 'Congratulations',
  },
  errorDataProvider: {
    id: 'aod.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },

  /* Error */
  errorUnknown: {
    id: 'aod.application:error.unknown',
    defaultMessage: 'Úps, óvænt villa kom upp!',
    description: 'An unknown error has occurred',
  },
  errorTryAgain: {
    id: 'aod.application:error.tryAgain',
    defaultMessage: 'Reyna aftur?',
    description: 'Try again',
  },

  /* Overview */
  overviewSectionTitle: {
    id: 'aod.application:overviewSectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview title',
  },
  overviewSectionDescription: {
    id: 'aod.application:overviewSectionDescription',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að réttar upplýsingar hafi verið gefnar.',
    description: 'Overview description',
  },
})
