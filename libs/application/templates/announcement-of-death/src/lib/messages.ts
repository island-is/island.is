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
    id: 'aod.application:dataCollectionUserProfileTitle',
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
  dataCollectionEstateTitle: {
    id: 'aod.application:dataCollectionEstateTitle',
    defaultMessage: 'Uppfletting dánarbús hjá sýslumanni',
    description: 'Title for notifying user of estate registry lookup',
  },
  dataCollectionEstateSubtitle: {
    id: 'aod.application:dataCollectionEstateSubtitle',
    defaultMessage:
      'Athugað verður hjá sýslumanni hvort að kennitalan þín sé tengd dánarbúi.',
    description:
      'Subtitle for estates, notifying the user about the lookup at Sysla in regards to estates',
  },
  dataCollectionNoEstatesError: {
    id: 'aod.application:dataCollectionNoEstatesError',
    defaultMessage:
      'Þú ert ekki skráð/ur fyrir dánarbúi hjá sýslumanni. Ef þú telur svo vera skaltu hafa samband við sýslumann.',
    description:
      'User not eligible for estate or no estates found bound to their national id',
  },
  existingApplicationTitle: {
    id: 'aod.application:error.existingApplication',
    defaultMessage: 'Fyrri umsóknir um andlátstilkynningu',
    description: 'Title of the data needed to fetch existing applications',
  },
  existingApplicationExists: {
    id: 'aod.application:error.existingApplicationExists#markdown',
    defaultMessage: 'Þú átt nú þegar umsókn í vinnslu',
    description:
      'Message letting the applicant know they already have an application in progress',
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
    id: 'aod.application:roleConfirmationNotice#markdown',
    defaultMessage:
      'Ferlið vistast sjálfkrafa á meðan það er fyllt út og hægt er að opna það aftur inn á Mínar síður á Ísland.is. Sjáir þú þér ekki fært um að sinna þessu ferli skaltu senda umsóknina áfram á réttan aðila.',
    description: 'Role confirmation notice',
  },
  roleConfirmationDescription: {
    id: 'aod.application:roleConfirmationDescription#markdown',
    defaultMessage:
      'Þú hefur fengið umsjón yfir andlátstilkynningu fyrir viðkomandi aðila. Sem nánasti aðstandandi færðu það hlutverk að sækja um dánarvottorð, tilkynna um eignir í dánarbúi og fá heimild til úttektar fyrir útfararkostnað. Andlát ber að tilkynna til sýslumanns í því umdæmi sem hinn látni hafði lögheimili og getur útför farið fram þegar sýslumaður hefur staðfest móttöku dánarvottorðs.',
    description: 'Role confirmation description',
  },
  roleConfirmationContinue: {
    id: 'aod.application:roleConfirmationContinue',
    defaultMessage: 'Samþykki að halda áfram með tilkynningu',
    description: 'Role confirmation continue with role',
  },
  roleConfirmationDelegate: {
    id: 'aod.application:roleConfirmationDelegate',
    defaultMessage: 'Senda umsókn áfram á annan aðila',
    description: 'Role confirmation delegate role',
  },
  delegateRoleDisclaimer: {
    id: 'aod.application:delegateRoleDisclaimer#markdown',
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
    defaultMessage: 'Erfðaskrá',
    description: 'Testament step title',
  },
  testamentDescription: {
    id: 'aod.application:testamentDescription#markdown',
    defaultMessage:
      'Upplýsingar um erfðaskrá eru sóttar til Sýslumanns. Ef fleiri en ein erfðaskrá er til staðar er mikilvægt að koma frumriti eða upplýsingum um þær til sýslumanns eins fljótt og kostur er.',
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
  willValidationError: {
    id: 'aod.application:willValidationError',
    defaultMessage:
      'Þú verður að velja einn af tveimur valmöguleikum til að halda áfram',
    description: 'Error message when will knowledge question is not answered',
  },
  filesValidationError: {
    id: 'aod.application:filesValidationError',
    defaultMessage: 'Þú átt eftir að velja viðtakendur.',
    description: 'Error message when file recipients are not selected',
  },

  /* Firearms step */
  firearmsTitle: {
    id: 'aod.application:firearmsTitle',
    defaultMessage: 'Skotvopn',
    description: 'Firearms step title',
  },
  firearmsDescription: {
    id: 'aod.application:firearmsDescription#markdown',
    defaultMessage: `Skrá þarf upplýsingar um skotvopn látna og nafn og kennitölu þess sem hefur samþykkt að taka við vörslu þeirra.
      Vörsluaðili þarf að vera með gilt leyfi til að varsla skotvopnin.
      Hann fær sms/tölvupóst með beiðni um að samþykkja að taka við vörslu skotvopnanna.`,
    description: 'Firearms step description',
  },
  firearmsHadFirearms: {
    id: 'aod.application:firearmsHadFirearms',
    defaultMessage: 'Hafði hinn látni skotvopn?',
    description: 'Firearms step had firearms',
  },
  firearmsYes: {
    id: 'aod.application:firearmsYes',
    defaultMessage: 'Já',
    description: 'Firearms step answer yes',
  },
  firearmsNo: {
    id: 'aod.application:firearmsNo',
    defaultMessage: 'Nei',
    description: 'Firearms step answer no',
  },
  firearmsApplicantHeader: {
    id: 'aod.application:firearmsApplicantHeader#markdown',
    defaultMessage: 'Skráning vörsluaðila:',
    description: '',
  },
  firearmsApplicant: {
    id: 'aod.application:firearmsApplicant',
    defaultMessage: 'Skráður vörsluaðili',
    description: '',
  },
  firearmsApplicantOverviewHeader: {
    id: 'aod.application:firearmsApplicantOverviewHeader',
    defaultMessage: 'Skotvopn',
    description: '',
  },
  firearmsApplicantName: {
    id: 'aod.application:firearmsApplicantName',
    defaultMessage: 'Nafn',
    description: 'Firearms step applicant name',
  },
  firearmsApplicantNationalId: {
    id: 'aod.application:firearmsApplicantNationalId',
    defaultMessage: 'Kennitala',
    description: 'Firearms step applicant national id',
  },
  firearmsApplicantEmail: {
    id: 'aod.application:firearmsApplicantEmail',
    defaultMessage: 'Netfang',
    description: 'Firearms step applicant email',
  },
  firearmsApplicantPhone: {
    id: 'aod.application:firearmsApplicantPhone',
    defaultMessage: 'Símanúmer',
    description: 'Firearms step applicant phone',
  },

  /* Inheritance step */
  inheritanceTitle: {
    id: 'aod.application:inheritanceTitle',
    defaultMessage: 'Erfingjar',
    description: 'Inheritance step title',
  },
  inheritanceDescription: {
    id: 'aod.application:inheritanceDescription#markdown',
    defaultMessage: `Erfðaréttur byggist á skyldleika, ættleiðingu, hjúskap og erfðaskrá hins látna. Ef hinn látni var:\\n\\n
* Í hjúskap og/eða átti börn: erfa maki og/eða börn hinn látna. Ef barn er látið taka afkomendur barnsins arf í þess stað.\\n\\n
* Einhleypur: erfa foreldrar og/eða systkini og/eða afkomendur þeirra hinn látna. Ef enginn þeirra er á lífi erfa afar og ömmur hinn látna eða börn þeirra.\\n\\n
* Búinn að gera erfðaskrá: erfir einstaklingur og/eða lögaðili, sem tilgreindur er í erfðaskránni, hinn látna.\\n\\n\\n\\n
Ef ekkert á við sem hér að ofan er talið rennur arfur í ríkissjóð. Nánari upplýsingar má finna á [Ísland.is](https://island.is)`,
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
  inheritanceConfirmationDescription: {
    id: 'aod.application:inheritanceConfirmationDescription#markdown',
    defaultMessage:
      'Ath. Það þarf alltaf að fylla út upplýsingar um alla erfingja, til dæmis þótt maki ætli að sitja í óskiptu búi. Ef barn hins látna var fallið frá á undan þarf að gefa upplýsingar um barnabörn. Ef látni sat í óskiptu búi þarf að veita upplýsingar um stjúpbörn.',
    description: 'Inheritance confirmation',
  },
  inheritanceConfirmation: {
    id: 'aod.application:inheritanceConfirmation',
    defaultMessage:
      'Ég staðfesti að hafa fært inn upplýsingar um alla erfingja',
    description: 'Inheritance confirmation',
  },

  /* Properties step */
  propertiesTitle: {
    id: 'aod.application:propertiesTitle',
    defaultMessage: 'Eignir',
    description: 'Properties title',
  },
  propertiesDescription: {
    id: 'aod.application:propertiesDescription#markdown',
    defaultMessage: 'Merktu við það sem á við eftir bestu vitund.',
    description: 'Properties description',
  },
  realEstatesTitle: {
    id: 'aod.application:realEstatesTitle',
    defaultMessage: 'Fasteignir',
    description: 'Real estates and lands title',
  },
  vehiclesTitle: {
    id: 'aod.application:vehiclesTitle',
    defaultMessage: 'Faratæki',
    description: 'Vehicles title',
  },
  vehiclesPlaceholder: {
    id: 'aod.application:vehiclesPlaceholder',
    defaultMessage: 't.d. Toyota Yaris',
    description: 'Placeholder for vehicles type',
  },
  propertiesRealEstate: {
    id: 'aod.application:propertiesRealEstate',
    defaultMessage: 'Fasteignir',
    description: 'Properties option: Real estate',
  },
  propertiesVehicles: {
    id: 'aod.application:propertiesVehicles',
    defaultMessage: 'Faratæki',
    description: 'Properties option: Vehicles',
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
  propertyShare: {
    id: 'aod.application:propertyShare',
    defaultMessage: 'Eignarhluti',
    description: 'Property share label',
  },
  address: {
    id: 'aod.application:address',
    defaultMessage: 'Heimilisfang',
    description: 'Address label',
  },
  addProperty: {
    id: 'aod.application:addProperty',
    defaultMessage: 'Bæta við fasteign',
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

  /* Files Step */
  filesTitle: {
    id: 'aod.application:filesTitle',
    defaultMessage: 'Skjöl',
    description: 'Files title',
  },
  filesDescription: {
    id: 'aod.application:filesDescription#markdown',
    defaultMessage:
      'Skjölin verða send og gerð aðgengileg í pósthólfi inni á Mínar síður Ísland.is.',
    description: 'Files description',
  },
  filesSelectMainRecipient: {
    id: 'aod.application:filesSelectMainRecipient',
    defaultMessage: 'Veldu hver fær sent skjal:',
    description: 'Files select main recipients description',
  },
  filesRecipientLabel: {
    id: 'aod.application:filesRecipientLabel',
    defaultMessage: 'Erfingi',
    description: 'Files dropdown label',
  },
  filesRecipientPlaceholder: {
    id: 'aod.application:filesRecipientPlaceholder',
    defaultMessage: 'Veldu viðtakanda',
    description: 'Files recipient placeholder',
  },
  certificateOfDeathAnnouncementTitle: {
    id: 'aod.application:certificateOfDeathAnnouncementTitle',
    defaultMessage: 'Vottorð um tilkynningu andláts',
    description: 'Certificate of death announcement title',
  },
  certificateOfDeathAnnouncementDescription: {
    id: 'aod.application:certificateOfDeathAnnouncementDescription#markdown',
    defaultMessage:
      'Heimilar að útför hins látna megi fara fram. Prestur eða sá aðili sem sér um útför þarf að fá þetta vottorð áður en útför fer fram.',
    description: 'Certificate of death announcement description',
  },
  certificateOfDeathAnnouncementPlaceholder: {
    id: 'aod.application:certificateOfDeathAnnouncementPlaceholder',
    defaultMessage: 'Veldu erfingja sem á að fá sent skjal',
    description: 'Certificate of death announcement placeholder',
  },
  financesDataCollectionPermissionTitle: {
    id: 'aod.application:financesDataCollectionPermissionTitle',
    defaultMessage: 'Heimild til að afla upplýsinga um fjárhag',
    description: 'Finances data collection permission title',
  },
  financesDataCollectionPermissionDescription: {
    id: 'aod.application:financesDataCollectionPermissionDescription#markdown',
    defaultMessage:
      'Heimild veitt til erfingja svo þau geti aflað sér upplýsinga um fjárhagsstöðu dánarbúsins.',
    description: 'Finances data collection permission description',
  },
  financesDataCollectionPermissionPlaceholder: {
    id: 'aod.application:financesDataCollectionPermissionPlaceholder',
    defaultMessage: 'Veldu erfingja sem á að fá sent skjal',
    description: 'Finances data collection permission placeholder',
  },
  authorizationForFuneralExpensesTitle: {
    id: 'aod.application:authorizationForFuneralExpensesTitle',
    defaultMessage: 'Heimild til að afla upplýsinga um fjárhag',
    description: 'Authorization for funeral expenses title',
  },
  authorizationForFuneralExpensesDescription: {
    id: 'aod.application:authorizationForFuneralExpensesDescription#markdown',
    defaultMessage:
      'Heimild veitt til erfingja svo þau geti aflað sér upplýsinga um fjárhagsstöðu dánarbúsins.',
    description: 'Authorization for funeral expenses description',
  },
  authorizationForFuneralExpensesPlaceholder: {
    id: 'aod.application:authorizationForFuneralExpensesPlaceholder',
    defaultMessage: 'Veldu erfingja sem á að fá sent skjal',
    description: 'Authorization for funeral expenses placeholder',
  },
  selectOptionNobody: {
    id: 'aod.application:selectOptionNobody',
    defaultMessage: 'Enginn viðtakandi valinn',
    description:
      'Text for the option of choosing nobody as a file recipient in the file step',
  },

  /* Validation */
  errorRoleConfirmation: {
    id: 'aod.application:error.errorRoleConfirmation',
    defaultMessage: 'Þú verður að velja einn möguleika',
    description: 'Role confirmation is invalid',
  },
  errorNationalIdNoName: {
    id: 'aod.application:error.errorNationalIdNoName',
    defaultMessage:
      'Villa kom upp við að sækja nafn útfrá kennitölu. Vinsamlegast prófaðu aftur síðar',
    description: 'No name found for national id in national registry',
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
    defaultMessage: 'Tengsl virðast ekki vera rétt',
    description: 'Relation is invalid',
  },
  errorAge: {
    id: 'aod.application:error.errorAge',
    defaultMessage: 'Viðtakandi þarf að hafa náð 18 ára aldri',
    description: 'Elected person must be at least 18 years old.',
  },
  errorAssetNumber: {
    id: 'aod.application:error.errorAssetNumber',
    defaultMessage:
      'Fasteignanúmer þarf að vera bókstafurinn F og sjö tölustafir',
    description: 'Invalid asset number error message',
  },
  errorNumberEmpty: {
    id: 'aod.application:error.errorNumberEmpty',
    defaultMessage: 'Númer má ekki vera tómt',
    description: 'Invalid general asset number error message',
  },
  errorNoDateOfBirthProvided: {
    id: 'aod.application:error.errorNoDateOfBirthProvided',
    defaultMessage: 'Fæðingardagur þarf að vera fylltur út',
    description: 'Date of birth is required',
  },
  errorSelectRecipient: {
    id: 'aod.application:error.errorSelectRecipient',
    defaultMessage: 'Þú verður að velja viðtakanda',
    description: 'Recipient must be selected',
  },

  /* Announcement */
  announcementTitle: {
    id: 'aod.application:announcementTitle',
    defaultMessage: 'Tilkynnandi',
    description: 'Announcement section title',
  },
  announcementDescription: {
    id: 'aod.application:announcementDescription#markdown',
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
  addApplicantToEstateMembers: {
    id: 'aod.application:addApplicantToEstateMembers',
    defaultMessage: 'Bæta mér við sem erfingja',
    description: 'Checkbox label for adding applicant to estate members list',
  },
  cardValidityPeriod: {
    id: 'aod.application:cardValidityPeriod',
    defaultMessage: 'Gildistími',
    description: 'Card validity label',
  },
  additionalInfoTitle: {
    id: 'aod.application:additionalInfoTitle',
    defaultMessage: 'Viðbótarupplýsingar',
    description: 'Additional info title',
  },
  additionalInfoDescription: {
    id: 'aod.application:additionalInfoDescription',
    defaultMessage: 'Hér getur þú skráð viðbótarupplýsingar ef við á. ',
    description: 'Additional info description',
  },
  additionalInfoLabel: {
    id: 'aod.application:additionalInfoLabel',
    defaultMessage: 'Upplýsingar',
    description: 'Additional info label',
  },
  additionalInfoPlaceholder: {
    id: 'aod.application:additionalInfoPlaceholder',
    defaultMessage: 'Skráðu inn viðbótarupplýsingar hér.',
    description: 'Additional info placeholder',
  },

  /* Delegated */
  delegatedTitle: {
    id: 'aod.application:delegatedTitle',
    defaultMessage: 'Takk fyrir',
    description: 'Delegated title',
  },
  delegatedDescription: {
    id: 'aod.application:delegatedDescription#markdown',
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
  nextStepsText: {
    id: 'aod.application:nextStepsText#markdown',
    defaultMessage: `* Þegar búið er að staðfesta tilkynninguna og móttöku dánarvottorðs getur útför farið fram.
    * Heimildir verða sendar í pósthólf á Mínar síður á Ísland.is hjá þeim aðilum sem óskað var eftir.
    * Erfingjar þurfa að taka ákvörðun um frágang dánarbúsins innan fjögurra mánaða frá dánardegi. Nánari upplýsingar má finna á vefsíðu sýslumanns.
    * Mikilvægt er að koma frumriti af erfðaskrám til sýslumanns sem fyrst þar sem innihald hennar getur haft áhrif á dánarbú hins látna.
    * Ef spurningar vakna varðandi næstu skref þá er hægt að snúa sér til "réttur  sýslumaður"`,
    description: 'Inheritance step title',
  },
  announcementComplete: {
    id: 'aod.application:announcementComplete',
    defaultMessage: 'Tilkynning móttekin',
    description: 'announcement complete text',
  },
  announcementCompleteDescription: {
    id: 'aod.application:announcementCompleteDescription#markdown',
    defaultMessage:
      'Takk fyrir að gefa þér tíma til þess að sinna þessu ferli. Þegar tilkynningin hefur verið afgreidd færðu senda staðfestingu og heimildir í þitt pósthólf á Mínar síður á Ísland.is.',
    description: '',
  },
  viewNextStepsButton: {
    id: 'aod.application:viewNextStepsButton',
    defaultMessage: 'Sjá næstu skréf',
    description: '',
  },
  viewOverviewButton: {
    id: 'aod.application:viewOverviewButton',
    defaultMessage: 'Sjá yfirlit',
    description: '',
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
    id: 'aod.application:overviewSectionDescription#markdown',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að réttar upplýsingar hafi verið gefnar.',
    description: 'Overview description',
  },
  overviewTheDeceased: {
    id: 'aod.application:overviewTheDeceased',
    defaultMessage: 'Hinn látni',
    description: 'Overview the deceased title',
  },
  submitApplication: {
    id: 'aod.application:submitApplication',
    defaultMessage: 'Staðfesta andlátstilkynningu',
    description: 'Submit announcement of death',
  },

  /* History logs */
  logApplicationDelegated: {
    id: 'aod.application:logApplicationDelegated',
    defaultMessage: 'Umsókn sent á annan aðila',
    description: '',
  },
})
