import { defineMessages } from 'react-intl'

export const m = defineMessages({
  formTitle: {
    id: 'hi.application:title',
    defaultMessage: 'Umsókn um sjúkratryggingu',
    description: 'Apply for health insurance',
  },
  applicantInfoSection: {
    id: 'hi.application:applicant.section',
    defaultMessage: 'Tengiliðaupplýsingar',
    description: 'Your contact information',
  },
  externalDataTitle: {
    id: 'hi.application:externalData.title',
    defaultMessage: 'Gögn sótt frá öðrum aðilum',
    description: 'Information retrieval',
  },
  nationalRegistryTitle: {
    id: 'hi.application:externalData.nationalRegistry.title',
    defaultMessage: 'Þjóðskrá',
    description: 'Registers Iceland',
  },
  nationalRegistrySubTitle: {
    id: 'hi.application:externalData.nationalRegistry.subtitle#markdown',
    defaultMessage:
      'Upplýsingar um nafn, kennitölu og heimilisfang \n \n Upplýsingar um börn og maka \n \nUpplýsingar um síðasta búsetuland \n \nUpplýsingar um hvernær viðkomandi var skráður í landið',
    description:
      'Info about name, national id and address <br>Information about children and spouse <br>Information about the last country of residence <br>Information on when the person was registered in the country.',
  },
  directorateOfLaborTitle: {
    id: 'hi.application:externalData.directorateOfLabor.title',
    defaultMessage: 'Vinnumálastofnun',
    description: 'Directorate of Labor',
  },
  directorateOfLaborSubTitle: {
    id: 'hi.application:externalData.directorateOfLabor.subtitle#markdown',
    defaultMessage:
      'Upplýsingar um atvinnuleysisbætur \n \nUpplýsingar um atvinnuleysisbætur erlendis (U2 vottorð) \n \nUpplýsingar um brottför frá öðru landi til Íslands: Réttur til atvinnuleysisbóta (U1 vottorð)',
    description:
      'Information on unemployment benefits <br>Information on unemployment benefits abroad (U2 certificate) <br>Information on departure from another country to Iceland: Entitlement to unemployment benefits (U1 certificate)',
  },
  internalRevenueTitle: {
    id: 'hi.application:externalData.internalRevenue.title',
    defaultMessage: 'Skatturinn',
    description: 'Directorate of Internal Revenue',
  },
  internalRevenueSubTitle: {
    id: 'hi.application:externalData.internalRevenue.subtitle#markdown',
    defaultMessage:
      'Upplýsingar um skattgreiðslur (mán/ár)\n \nNafn atvinnurekanda',
    description:
      'Information on tax payments (month/year) <br> Name of employer',
  },
  prerequisiteStartApplication: {
    id: 'hi.application:externalData.prerequisiteStartApplication',
    defaultMessage: 'Hefja umsókn',
    description: 'Start application',
  },
  socialInsuranceAdministrationTitle: {
    id: 'hi.application:externalData.insuranceAdministration.title',
    defaultMessage: 'Tryggingastofnun ríkisins',
    description: 'Insurance administration',
  },
  socialInsuranceAdministrationSubtitle: {
    id: 'hi.application:externalData.insuranceAdministration.subTitle#markdown',
    defaultMessage:
      'Upplýsingar um örorkumat (stöðu) \n \nUpplýsingar um greiðslur vegna örorku (stöðu)',
    description:
      'Information on disability assessment (status) <br> Information on disability payments (status)',
  },
  dataProvidersMoreInfo: {
    id: 'hi.application:externalData.moreInfo#markdown',
    defaultMessage:
      'Nánari upplýsingar um vinnslu persónuupplýsinga hjá Sjúkratryggingum Íslands [Persónuverndarsíðu SÍ](https://www.sjukra.is/personuvernd)',
    description:
      'Further information on the processing of personal information by Sjúkratryggingar Íslands <a href="https://www.sjukra.is/personuvernd" target="_blank" style="color:#0061ff"> SÍ Privacy Page </a>',
  },
  confirmationOfResidencyTitle: {
    id: 'hi.application:confirmationOfResidency.title',
    defaultMessage: 'Staðfesting á búsetu',
    description: 'Confirmation of residency',
  },
  confirmationOfResidencyDescription: {
    id: 'hi.application:confirmationOfResidency.description',
    defaultMessage:
      'Samkvæmt Þjóðskrá fluttir þú til Íslands frá Grænlandi eða Færeyjum. Til að sækja um sjúkratryggingu þarf búsetuvottorð frá Grænlændi eða Færeyjum ',
    description:
      'According to Registers Iceland’s data it seems like you are moving to Iceland from Greenland or the Faroe Islands. To apply for the national health insurance, you need to provide a confirmation of residency from Greenland or the Faroe Islands.',
  },
  confirmationOfResidencyFileUpload: {
    id: 'hi.application:confirmationOfResidency.fileUpload',
    defaultMessage: 'Setjið inn búsetuvottorð.',
    description: 'Please add your confirmation of residency',
  },
  contactInfoTitle: {
    id: 'hi.application:contactInfo.title',
    defaultMessage: 'Staðfestið tengiliðaupplýsingar',
    description: 'Confirm your contact information',
  },
  name: {
    id: 'hi.application:applicant.name',
    defaultMessage: 'Fullt nafn',
    description: 'Full name',
  },
  nationalId: {
    id: 'hi.application:applicant.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Icelandic ID number',
  },
  address: {
    id: 'hi.application:applicant.address',
    defaultMessage: 'Lögheimili',
    description: 'Address',
  },
  postalCode: {
    id: 'hi.application:applicant.postalCode',
    defaultMessage: 'Póstnúmer',
    description: 'Postal code',
  },
  city: {
    id: 'hi.application:applicant.city',
    defaultMessage: 'Staður',
    description: 'City',
  },
  nationality: {
    id: 'hi.application:applicant.nationality',
    defaultMessage: 'Ríkisfang',
    description: 'Nationality',
  },
  editNationalRegistryData: {
    id: 'hi.application:nationalRegistryData.edit#markdown',
    defaultMessage:
      'Tilkynna [flutning lögheimilis](https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/).',
    description:
      'Need to update your address? Go to <a href="https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/" target="_blank" style="color:#0061ff">Change of Address</a>',
  },
  email: {
    id: 'hi.application:applicant.email',
    defaultMessage: 'Netfang',
    description: 'E-mail',
  },
  phoneNumber: {
    id: 'hi.application:applicant.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Phone number',
  },
  editDigitalIslandData: {
    id: 'hi.application:digitalIslandData.edit#markdown',
    defaultMessage:
      'Vinsamlegast uppfærið netfang og símanúmer á [Mínum síðum](https://island.is/minarsidur/stillingar/minar-stillingar/) ef með þarf. Eftir að búið er að skrá inn nýjar upplýsingar, uppfærið þessa síðu.',
    description:
      'Update your e-mail and phone number on <a href="https://island.is/minarsidur/stillingar/minar-stillingar" target="_blank" style="color:#0061ff">My Pages</a> if incorrect. Refresh this page once updated.',
  },
  statusAndChildren: {
    id: 'hi.application:statusAndChildrend.section',
    defaultMessage: 'Staða og börn',
    description: 'Status and children',
  },
  statusDescription: {
    id: 'hi.application:status.description',
    defaultMessage: 'Staða í fyrra tryggingarlandi',
    description: 'Status in former country of insurance?',
  },
  statusEmployed: {
    id: 'hi.application:status.employed',
    defaultMessage: 'Launþegi',
    description: 'Employed',
  },
  statusEmployedInformation: {
    id: 'hi.application:status.employed.information',
    defaultMessage: 'Þú varst í vinnu hjá fyrirtæki eða sjálfstætt starfandi.',
    description: 'You were employed by a company or self-employed',
  },
  statusOther: {
    id: 'hi.application:status.other',
    defaultMessage: 'Annað',
    description: 'Other',
  },
  statusOtherInformation: {
    id: 'hi.application:other.information',
    defaultMessage: 'Allar aðrar stöður',
    description: 'All other statuses',
  },
  statusPensioner: {
    id: 'hi.application:status.pensioner',
    defaultMessage: 'Lífeyrisþegi',
    description: 'Pensioner',
  },
  statusPensionerInformation: {
    id: 'hi.application:pensioner.information',
    defaultMessage: 'Þú færð lífeyri eða örorkubætur frá Íslandi.',
    description:
      'You are receiving old age pension or disability pension from Iceland',
  },
  statusStudent: {
    id: 'hi.application:status.student',
    defaultMessage: 'Námsmaður',
    description: 'Student',
  },
  statusStudentInformation: {
    id: 'hi.application:student.information',
    defaultMessage:
      'Þú fluttir frá Íslandi til að stunda nám erlendis og flytur til baka til Íslands innan sex mánaða frá lokum náms.',
    description:
      'You moved away from Iceland for the purpose of studying abroad and are moving back to Iceland within six months of the end of studies',
  },
  confirmationOfStudies: {
    id: 'hi.application:student.confirmationOfStudies',
    defaultMessage: 'Senda þarf inn staðfestingu á námi',
    description: 'Confirmation of studies must be submitted',
  },
  confirmationOfStudiesTooltip: {
    id: 'hi.application:student.confirmationOfStudiesTooltip',
    defaultMessage:
      'Þú þarft að senda inn afrit af útskriftarskírteini eða staðfestingu á námsferli fyrir hverja önn. Skráningar- eða inntökustaðfesting nægir ekki',
    description:
      'You need to submit a copy of your Graduation certificate or a confirmation of completed credits for each semester. Admission or enrollement letters are not sufficient.',
  },
  childrenDescription: {
    id: 'hi.application:children.description',
    defaultMessage: 'Flytja börn undir 18 ára aldri með þér til Íslands?',
    description:
      'Are there any children under the age of 18 moving to Iceland with you?',
  },
  childrenInfoMessageTitle: {
    id: 'hi.application:children.infoMessageTitle',
    defaultMessage: 'Sjúkratryggingar barna',
    description: 'Health insurance for children',
  },
  childrenInfoMessageText: {
    id: 'hi.application:children.infoMessageText',
    defaultMessage:
      'Börn skráð á þér munu sjálfkrafa verða sjúkratryggð á sama tíma og þú',
    description:
      'Any children registered to you will automatically get health insurance once you get insured.',
  },
  yesOptionLabel: {
    id: 'hi.application:option.yes',
    defaultMessage: 'Já',
    description: 'Yes',
  },
  noOptionLabel: {
    id: 'hi.application:option.no',
    defaultMessage: 'Nei',
    description: 'No',
  },
  fileUploadHeader: {
    id: 'hi.application:fileUpload.header',
    defaultMessage: 'Dragið skrár hingað',
    description: 'Drag & drop your files here',
  },
  fileUploadDescription: {
    id: 'hi.application:fileUpload.description',
    defaultMessage:
      'Hámark 10 MB á skrá. Samþykktar skráartegundir eru .pdf .docx og .jpg',
    description:
      'Max 10 MB per file. Accepted documents is .pdf .docx and .jpg',
  },
  fileUploadButton: {
    id: 'hi.application:fileUpload.button',
    defaultMessage: 'Veljið skjöl til að hlaða upp',
    description: 'Select documents to upload',
  },
  formerInsuranceSection: {
    id: 'hi.application:formerInsurance.section',
    defaultMessage: 'Fyrra tryggingarland',
    description: 'Former country of insurance',
  },
  formerInsuranceTitle: {
    id: 'hi.application:formerInsurance.title',
    defaultMessage: 'Fyrra tryggingarland',
    description: 'Former country of insurance',
  },
  formerInsuranceRegistration: {
    id: 'hi.application:formerInsurance.registration',
    defaultMessage:
      'Varst þú skráður í almannatryggingakerfi í fyrra tryggingarlandi?',
    description:
      'Were you registered with a national health insurance institution in your former country of insurance?',
  },
  formerInsuranceCountryPlaceholder: {
    id: 'hi.application:formerInsurance.countryPlaceholder',
    defaultMessage: 'Veldu land',
    description: 'Select a country',
  },
  formerInsuranceCountryError: {
    id: 'hi.application:formerInsurance.countryError',
    defaultMessage: 'Error when loading countries',
    description: 'Error when loading countries',
  },
  formerInsuranceDetails: {
    id: 'hi.application:formerInsurance.details',
    defaultMessage:
      'Vinsamlegast gefið upplýsingar um fyrra tryggingarland. Veldu landsheiti á ensku.',
    description:
      'Please provide the following details regarding your former country of residence.',
  },
  formerInsuranceEntitlement: {
    id: 'hi.application:formerInsurance.entitlement',
    defaultMessage:
      'Átt þú rétt á áframhaldandi tryggingu í fyrra tryggingarlandi á meðan búsetu á Íslandi stendur?',
    description:
      'Are you entitled to continued insurance in your former country of residence while living in Iceland?',
  },
  formerInsuranceEntitlementTooltip: {
    id: 'hi.application:formerInsurance.entitlementTooltip',
    defaultMessage:
      'Líklega Já ef þú ert enn í vinnu eða ert að fá atvinnuleysisbætur, lífeyri, fæðingarorlof eða annars konar bætur í peningum frá fyrra tryggingarlandi. ',
    description:
      'Most likely yes if you are still employed/receiving unemployment benefits, pension, benefits in cash or paternity/maternity benefits from your former country of insurance.',
  },
  formerInsuranceAdditionalInformation: {
    id: 'hi.application:formerInsurance.additionalInformation',
    defaultMessage: 'Skýrið ástæðuna ef já',
    description: 'If yes, please explain why',
  },
  formerInsuranceAdditionalInformationPlaceholder: {
    id: 'hi.application:formerInsurance.additionalInformationPlaceholder',
    defaultMessage: 'Ég á enn rétt á sjúkratryggingu vegna þess að ...',
    description: "I'm still entitled to health insurance because...",
  },
  formerInsuranceNoOption: {
    id: 'hi.application:formerInsurance.noOption',
    defaultMessage: 'Nei, eingöngu einkatrygging, eða engin trygging',
    description: 'No, only private insurance or no insurance',
  },
  formerInsuranceCountry: {
    id: 'hi.application:formerInsurance.country',
    defaultMessage: 'Land',
    description: 'Country',
  },
  formerPersonalId: {
    id: 'hi.application:formerInsurance.formerPersonalId',
    defaultMessage: 'Kennitala í fyrra búsetulandi',
    description: 'ID number in previous country',
  },
  formerInsuranceInstitution: {
    id: 'hi.application:formerInsurance.instituiton',
    defaultMessage: 'Nafn sjúkratryggingarstofnunar',
    description: 'Name of the health insurance institution',
  },
  confirmationSection: {
    id: 'hi.application:confirmationSection',
    defaultMessage: 'Staðfesta og senda',
    description: 'Confirm and submit',
  },
  confirmationTitle: {
    id: 'hi.application:confirmationTitle',
    defaultMessage: 'Staðfesta og senda inn umsókn',
    description: 'Confirm and submit your application',
  },
  additionalInfo: {
    id: 'hi.application:hasAdditionalRemarks',
    defaultMessage: 'Hefur þú frekari upplýsingar?',
    description: 'Do you have any additional information or remarks?',
  },
  additionalRemarks: {
    id: 'hi.application:additionalRemarks',
    defaultMessage: 'Viðbótarupplýsingar',
    description: 'Additional information or remarks',
  },
  additionalRemarksPlaceholder: {
    id: 'hi.application:additionalRemarks.placeholder',
    defaultMessage: 'Setið athugasemd hér',
    description: 'Enter your text here',
  },
  confirmCorrectInfo: {
    id: 'hi.application:confirmCorrectInfo',
    defaultMessage: 'Ég staðfesti að upplýsingar þessar eru réttar og sannar',
    description: 'I am ensuring that the information is true and correct',
  },
  submitLabel: {
    id: 'hi.application:submit',
    defaultMessage: 'Staðfesta umsókn',
    description: 'Submit',
  },
  successfulSubmissionTitle: {
    id: 'hi.application:successfulSubmission.title',
    defaultMessage: 'Við höfum sent umsóknina þína!',
    description: 'Your application is sent!',
  },
  successfulSubmissionMissingInfoTitle: {
    id: 'hi.application:successfulSubmission.missingInfoTitle',
    defaultMessage: 'Við höfum móttekið svar þitt!',
    description: 'We have received your answer!',
  },
  successfulSubmissionMessage: {
    id: 'hi.application:successfulSubmission.message',
    defaultMessage:
      'Þú færð staðfestingapóst með skjalanúmerinu þínu sendann á netfangið þitt',
    description: 'A confirmation e-mail with your case number will be sent',
  },
  successfulExpendableHeader: {
    id: 'hi.application:successfulExpendable.header',
    defaultMessage: 'Hvað gerist næst?',
    description: 'What happens next title in expandable field',
  },
  nextStepReviewTime: {
    id: 'hi.application:nextStep.duration#markdown',
    defaultMessage:
      '* Tekið getur allt að 2-6 vikur að fara yfir umsókn. Lengd svartíma fer eftir því hversu fljótt fyrra tryggingarland þitt svarar fyrirspurn okkar og getur það tekið lengri tíma.',
    description:
      'An application may take up to 2–6 weeks to process. Depending on how fast your former country of insurance responds to our request, it may take longer.',
  },
  actionCardSuccessFullSubmissionTitle: {
    id: 'hi.application:actionCard.successfulSubmission.title',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application received',
  },
  actionCardSuccessFullSubmissionDescription: {
    id: 'hi.application:actionCard.successfulSubmission.description',
    defaultMessage:
      'Tekið getur allt að 2-6 vikur að fara yfir umsókn. Lengd svartíma fer eftir því hversu fljótt fyrra tryggingarland þitt svarar fyrirspurn okkar og getur það tekið lengri tíma.',
    description: 'A confirmation e-mail with your case number will be sent',
  },
  missingInfoSection: {
    id: 'hi.application:missingInfo.section',
    defaultMessage: 'Vantar upplýsingar',
    description: 'Missing information',
  },
  agentCommentsTitle: {
    id: 'hi.application:agentComments.title',
    defaultMessage: 'Athugasemd frá Sjúkratryggingum Íslands',
    description: 'Comment from the Icelandic Health Insurance',
  },
  agentCommentsEmpty: {
    id: 'hi.application:agentComments.empty',
    defaultMessage: 'Agent did not leave any comments for you',
    description: 'Agent did not leave any comments for you',
  },
  missingInfoAnswersTitle: {
    id: 'hi.application:missingInfo.addInfo.title',
    defaultMessage: 'Svar',
    description: 'Your answer',
  },
  previousAnswersTitle: {
    id: 'hi.application:previousInfo.title',
    defaultMessage: 'Fyrri svör',
    description: 'Previous answer',
  },
  attachedFilesTitle: {
    id: 'hi.application:attachedFiles.title',
    defaultMessage: 'Attached files',
    description: 'Attached files',
  },
  modalCloseButtonText: {
    id: 'hi.application:modalCloseButtonText',
    defaultMessage: 'Loka',
    description: 'Close',
  },
  waitingPeriodTitle: {
    id: 'hi.application:waitingPeriod.title',
    defaultMessage: 'Biðtími',
    description: 'Waiting period',
  },
  waitingPeriodDescription: {
    id: 'hi.application:waitingPeriod.description#markdown',
    defaultMessage:
      'Þegar flutt er til Íslands frá landi utan  [EES svæðisins](https://www.sjukra.is/heilbrigdisthjonusta/rettindi-milli-landa/evropska-sjukratryggingakortid/ees-londin/), Grænlandi eða Færeyjum fer einstaklingur á sex mánaða biðtíma eftir sjúkratryggingu. Þetta á einnig við um einstaklinga með ríkisborgararétt frá landi utan [EES svæðisins](https://www.sjukra.is/heilbrigdisthjonusta/rettindi-milli-landa/evropska-sjukratryggingakortid/ees-londin/), Grænlandi eða Færeyjum sem flytja til Íslands frá landi utan Norðurlandanna.\n \n Þú lendir á biðtíma og verður sjálfkrafa sjúkratryggður sex mánuðum eftir að lögheimili þitt var skráð á Íslandi hjá Þjóðskrá. Við ráðleggjum þér að kaupa einkatryggingar meðan á þessum biðtíma stendur. Ákveðnar [læknisfræðilegar undanþágur](https://island.is/umsokn-um-sjukratryggingu#laeknisfraedilegar-undanthagur) eru frá sex mánaða biðtímanum.',
    description:
      'When moving to Iceland or being a citizen from a country outside the <a href="https://www.sjukra.is/english/health-insurance-abroad/european-health-insurance-card/european-countries/" target="_blank" style="color:#0061ff">EU/EEA</a>, Greenland or the Faroe Islands there is a six-month waiting period before qualifying for national health insurance. You will need to wait.<br/><br/> You will be automatically covered by the national health insurance six months from the day you registered your legal residence with Registers Iceland. We advise you to buy private health insurance until you are covered. There are some <a href="https://island.is/en/apply-for-health-insurance#waiting-period" target="_blank" style="color:#0061ff">medical exceptions</a> to the waiting period.',
  },
  waitingPeriodButtonText: {
    id: 'hi.application:waitingPeriod.buttonText',
    defaultMessage: 'Lesa meira',
    description: 'Read more',
  },
  requiresActionTagLabel: {
    id: 'hi.application:requiresActionTagLabel',
    defaultMessage: 'Þarfnast aðgerðar',
    description: 'Requires action',
  },
  completeTagLabel: {
    id: 'hi.application:completeTagLabel',
    defaultMessage: 'Uppfletting í lagi',
    description: 'Complete',
  },
  registerYourselfTitle: {
    id: 'hi.application:registerYourself.title',
    defaultMessage: 'Skrá lögheimili á Íslandi',
    description: 'Register yourself in Iceland',
  },
  registerYourselfDescription: {
    id: 'hi.application:registerYourself.description',
    defaultMessage:
      'Skrá þarf lögheimili á Íslandi áður en sótt er um sjúkratryggingu.',
    description:
      'You don’t seem to be registered with Registers Iceland. You need to register your legal residence in Iceland before applying for national health insurance.',
  },
  registerYourselfButtonText: {
    id: 'hi.application:registerYourself.buttonText',
    defaultMessage: 'Leiðbeiningar',
    description: 'How to register',
  },
  registerYourselfButtonLink: {
    id: 'hi.application:registerYourself.buttonLink',
    defaultMessage: 'https://island.is/logheimili-upplysingar-innflytjendur',
    description: 'https://island.is/en/legal-domicile-immigrant',
  },
  activeDraftApplicationTitle: {
    id: 'hi.application:activeDraftApplication.title',
    defaultMessage: 'Opna ókláraða umsókn',
    description: 'Open your previous draft',
  },
  activeDraftApplicationDescription: {
    id: 'hi.application:activeDraftApplication.description',
    defaultMessage:
      'Þú átt nú þegar umsókn sem ekki hefur verið send inn. Vinsamlegast farðu í fyrri umsókn til að halda áfram.',
    description: 'Information for those that alreade have a started draft',
  },
  activeDraftApplicationButtonText: {
    id: 'hi.application:activeDraftApplication.buttonText',
    defaultMessage: 'Opna umsókn',
    description: 'Open draft',
  },
  prerequisiteCheckScreenTitle: {
    id: 'hi.application:prerequisiteCheckScreenTitle',
    defaultMessage: 'Öll gögn hafa verið sótt',
    description: 'All data has been gathered',
  },
  prerequisiteNationalRegistryTitle: {
    id: 'hi.application:prerequisiteNationalRegistry.title',
    defaultMessage: 'Uppfletting lögheimilis',
    description: 'Legal residence lookup',
  },
  prerequisiteNationalRegistryDescription: {
    id: 'hi.application:prerequisiteNationalRegistry.description',
    defaultMessage: 'Athugað hvort notandi sé með skráð lögheimili á Íslandi',
    description:
      'Check whether the user has a registered legal residence in Iceland',
  },
  prerequisiteActiveDraftApplicationTitle: {
    id: 'hi.application:prerequisiteActiveDraftApplication.title',
    defaultMessage: 'Uppfletting umsókna í umsóknarkerfi Island.is',
    description: 'Search for previous applications in Island.is',
  },
  prerequisiteActiveDraftApplicationDescription: {
    id: 'hi.application:prerequisiteActiveDraftApplication.description',
    defaultMessage:
      'Athugað hvort notandi sé þegar með umsókn í umsóknarkerfi Island.is',
    description:
      'Search for previous applications in the application system at Island.is',
  },
  prerequisiteHealthInsuranceTitle: {
    id: 'hi.application:prerequisiteHealthInsurance.title',
    defaultMessage: 'Uppfletting sjúkratryggingar',
    description: 'Checking health insurance',
  },
  prerequisiteHealthInsuranceDescription: {
    id: 'hi.application:prerequisiteHealthInsurance.description',
    defaultMessage: 'Athugað hvort notandi sé þegar með sjúkratryggingu',
    description: 'Check if the user already has health insurance',
  },
  prerequisitePendingApplicationTitle: {
    id: 'hi.application:prerequisitePendingApplication.title',
    defaultMessage: 'Uppfletting umsókna í Sjúkratryggingum ríkisins.',
    description:
      'Search for previous applications in Sjúkratryggingar ríkisins',
  },
  prerequisitePendingApplicationDescription: {
    id: 'hi.application:prerequisitePendingApplication.description',
    defaultMessage:
      'Athugað hvort notandi sé þegar með umsókn hjá Sjúkratryggingum ríkisins.',
    description:
      'Check whether the user already has an application with Sjúkratryggingar ríkisins',
  },
  pendingApplicationTitle: {
    id: 'hi.application:activeApplication.title',
    defaultMessage: 'Virk umsókn',
    description: 'Active application',
  },
  pendingApplicationDescription: {
    id: 'hi.application:oldPendingApplication.description',
    defaultMessage:
      'Þú hefur nú þegar sótt um sjúkratryggingu. Númer umsókninnar er **{applicationNumber}**. Vinsamlegast hafið samband við Sjúkratryggingar Íslands ef spurningar vakna.',
    description:
      'You have already submitted an application for health insurance. Your application number is **{applicationNumber}**. Please contact the Icelandic Health Insurance if you have any questions.',
  },
  pendingApplicationButtonText: {
    id: 'hi.application:oldPendingApplication.buttonText',
    defaultMessage: 'Hafa samband',
    description: 'Contact info',
  },
  pendingApplicationButtonLink: {
    id: 'hi.application:oldPendingApplication.buttonLink',
    defaultMessage: 'https://www.sjukra.is/um-okkur/thjonustuleidir/',
    description: 'https://www.sjukra.is/english',
  },
  alreadyInsuredTitle: {
    id: 'hi.application:alreadyInsured.title',
    defaultMessage: 'Þú ert nú þegar sjúkratryggður',
    description: 'Already insured',
  },
  alreadyInsuredDescription: {
    id: 'hi.application:alreadyInsured.description',
    defaultMessage:
      'Þú ert nú þegar með virka sjúkratryggingu hjá Sjúkratryggingum Íslands og þarft því ekki að sækja um.<br/><br/> Nánari upplýsingar er að finna á heimasíðu Sjúkratrygginga Íslands.',
    description:
      'You are already covered by the Icelandic Health Insurance. You do not need to apply. You can read more about your health insurance at <a href="https://www.sjukra.is/english" target="_blank" style="color:#0061ff">sjukra.is/english</a>',
  },
  alreadyInsuredButtonText: {
    id: 'hi.application:alreadyInsured.buttonText',
    defaultMessage: 'Opna vefsíðu',
    description: 'A button to go to sjukra website',
  },
  alreadyInsuredButtonLink: {
    id: 'hi.application:alreadyInsured.buttonLink',
    defaultMessage: 'https://www.sjukra.is',
    description: 'https://www.sjukra.is/english',
  },
  externalDataCheckbox: {
    id: 'hi.application:externalDataCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: 'I understand that the above data will be collected',
  },
  externalDataSubtitle: {
    id: 'hi.application:externalDataSubtitle',
    defaultMessage:
      'Unnið verður með persónugreinanleg gögn frá eftirfarandi stofnunum við vinnslu umsóknarinnar',
    description:
      'Personally identifiable data from the following institutions will be processed during the processing of the application',
  },
  prerequisitesFormTitle: {
    id: 'hi.application:PrerequisitesFormTitle',
    defaultMessage: 'Skilyrði',
    description: 'Conditions',
  },
  externalDataSuccessDescription: {
    id: 'hi.application:externalDataSuccessTitle',
    defaultMessage: 'Öll gögn hafa verið sótt og er hægt að hefja umsókn',
    description: 'All data has been fetched and the application can be started',
  },
  externalDataSuccessSubmitFieldTitle: {
    id: 'hi.application:externalDataSuccessSubmitFieldTitle',
    defaultMessage: 'Hefja umsókn',
    description: 'Start application',
  },
  unexpectedError: {
    id: 'hi.application:unexpectedError',
    defaultMessage: 'Villa kom upp',
    description: 'Unexpected error',
  },
})
