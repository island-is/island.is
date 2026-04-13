import { defineMessages } from 'react-intl'

export const draftMessages = {
  personalInformation: defineMessages({
    title: {
      id: 'hb.application:draft.title',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal information title',
    },
    bankAccountTitle: {
      id: 'hb.application:draft.personalInformation.bankAccountTitle',
      defaultMessage: 'Bankareikningur umsækjanda',
      description: 'Applicant bank account field title',
    },
    validationBankAccountIncomplete: {
      id: 'hb.application:draft.personalInformation.validationBankAccountIncomplete',
      defaultMessage: 'Vinsamlegast fylltu út alla reiti bankareiknings',
      description: 'All bank account fields required when any part is filled',
    },
    validationBankAccountRequired: {
      id: 'hb.application:draft.personalInformation.validationBankAccountRequired',
      defaultMessage: 'Bankareikningur er nauðsynlegur',
      description: 'Applicant bank account required',
    },
  }),
  rentalAgreement: defineMessages({
    title: {
      id: 'hb.application:draft.rentalAgreement.title',
      defaultMessage: 'Leigusamningur',
      description: 'Rental agreement title',
    },
    description: {
      id: 'hb.application:draft.rentalAgreement.description',
      defaultMessage:
        'Veldu þann leigusamning sem á að sækja húsnæðisbætur fyrir',
      description: 'Rental agreement description',
    },
    multiFieldDescription: {
      id: 'hb.application:draft.rentalAgreement.multiFieldDescription#markdown',
      defaultMessage:
        'Hér má sjá lista yfir alla leigusamninga sem þú ert aðili að. Vinsamlegast veldu samning sem á að sækja húsnæðisbætur fyrir.',
      description: 'Rental agreement multi field description',
    },
    optionFixedTerm: {
      id: 'hb.application:draft.rentalAgreement.optionFixedTerm#markdown',
      defaultMessage:
        'Leigusamningur **{contractId}** (*Tímabundin samningur*)\n\n{address}{apartmentNumber}\n\n{landlordsCount, plural, one {Leigusali} other {Leigusala}}: {landlords}\n\n{rentersCount, plural, one {Leigjandi} other {Leigjendur}}: {renters}',
      description: 'Rental agreement option fixed term',
    },
    optionUnboundTerm: {
      id: 'hb.application:draft.rentalAgreement.optionUnboundTerm#markdown',
      defaultMessage:
        'Leigusamningur **{contractId}** (*Ótímabundin samningur*)\n\n{address}{apartmentNumber}\n\n{landlordsCount, plural, one {Leigusali} other {Leigusalar}}: {landlords}\n\n{rentersCount, plural, one {Leigjandi} other {Leigjendur}}: {renters}',
      description: 'Rental agreement option unbound term',
    },
  }),
  exemptionSection: defineMessages({
    title: {
      id: 'hb.application:draft.exemptionSection.title',
      defaultMessage: 'Undanþágur',
      description: 'Exemption section title',
    },
    multiFieldTitle: {
      id: 'hb.application:draft.exemptionSection.multiFieldTitle',
      defaultMessage: 'Undanþága frá skilyrðum um búsetu',
      description: 'Exemption multi field title',
    },
    alertTitle: {
      id: 'hb.application:draft.exemptionSection.alertTitle',
      defaultMessage: 'Ósamræmi í skráningu',
      description: 'Exemption alert title',
    },
    description: {
      id: 'hb.application:draft.exemptionSection.description',
      defaultMessage:
        'Skráð lögheimili er ekki það sama og skráð heimilisfang á völdum leigusamning.',
    },
    description2: {
      id: 'hb.application:draft.exemptionSection.description2#markdown',
      defaultMessage:
        'Undanþága frá skilyrðum um búsetu er veitt í eftirfarandi fjórum tilfellum: \n\n * Vegna náms sem er stundað fjarri lögheimili \n\n * Vegna veikinda þegar nauðsyn er að sækja heilbrigðisþjónustu fjarri lögheimil \n\n * Vegna dvalar á áfangaheimili \n\n * Vegna starfs unnið fjarri lögheimili í allt að þrjú ár',
    },
    checkboxLabel: {
      id: 'hb.application:draft.exemptionSection.checkboxLabel',
      defaultMessage: 'Sækja um undanþágu frá skilyrðum um búsetu',
    },
    checkboxTitle: {
      id: 'hb.application:draft.exemptionSection.checkboxTitle',
      defaultMessage: 'Undanþága frá skilyrðum um búsetu',
    },
    checkboxLabelStudies: {
      id: 'hb.application:draft.exemptionSection.checkboxLabelStudies',
      defaultMessage: 'Vegna náms',
    },
    checkboxLabelHealth: {
      id: 'hb.application:draft.exemptionSection.checkboxLabelHealth',
      defaultMessage: 'Vegna veikinda',
    },
    checkboxLabelHousing: {
      id: 'hb.application:draft.exemptionSection.checkboxLabelHousing',
      defaultMessage: 'Vegna dvalar á áfangaheimili',
    },
    checkboxLabelWork: {
      id: 'hb.application:draft.exemptionSection.checkboxLabelWork',
      defaultMessage: 'Vegna starfs',
    },
    fileUploadStudiesTitle: {
      id: 'hb.application:draft.exemptionSection.fileUploadStudiesTitle',
      defaultMessage: 'Staðfesting á skólavist',
      description: 'Studies - confirmation of enrollment',
    },
    fileUploadHealthTitle: {
      id: 'hb.application:draft.exemptionSection.fileUploadHealthTitle',
      defaultMessage: 'Læknisvottorð',
      description: "Health - doctor's note",
    },
    fileUploadHousingTitle: {
      id: 'hb.application:draft.exemptionSection.fileUploadHousingTitle',
      defaultMessage: 'Staðfesting frá áfangaheimili',
      description: 'Halfway housing - confirmation from housing',
    },
    fileUploadWorkTitle: {
      id: 'hb.application:draft.exemptionSection.fileUploadWorkTitle',
      defaultMessage: 'Ráðningarsamningur',
      description: 'Work - confirmation of employment',
    },
    validationCheckboxRequired: {
      id: 'hb.application:draft.exemptionSection.validationCheckboxRequired',
      defaultMessage: 'Þú verður að staðfesta að þú sækir um undanþágu',
      description: 'Validation: exemption checkbox must be checked',
    },
    validationReasonRequired: {
      id: 'hb.application:draft.exemptionSection.validationReasonRequired',
      defaultMessage: 'Vinsamlegast veldu ástæðu undanþágu',
      description: 'Validation: exemption reason must be selected',
    },
    validationFileRequired: {
      id: 'hb.application:draft.exemptionSection.validationFileRequired',
      defaultMessage: 'Vinsamlegast hladdu upp nauðsynlegu skjali',
      description: 'Validation: file must be uploaded for exemption reason',
    },
  }),
  householdMembersSection: defineMessages({
    title: {
      id: 'hb.application:draft.householdMembersSection.title',
      defaultMessage: 'Heimilismenn',
      description: 'Household members section title',
    },
    multiFieldTitle: {
      id: 'hb.application:draft.householdMembersSection.multiFieldTitle',
      defaultMessage: 'Heimilismenn',
      description: 'Household members multi field title',
    },
    multiFieldDescription: {
      id: 'hb.application:draft.householdMembersSection.multiFieldDescription',
      defaultMessage:
        'Heimilismenn eru allir þeir sem eiga heima á heimilinu sem verið er að sækja um húsnæðisbætur fyrir.',
      description: 'Household members multi field description',
    },
    description: {
      id: 'hb.application:draft.householdMembersSection.description#markdown',
      defaultMessage:
        'Húsnæðisbætur eru meðal annars ákvarðaðar út frá því hversu margir heimilismenn búa saman, sjá [lög um húsnæðisbætur](https://www.althingi.is/lagas/nuna/2016075.html)',
      description: 'Household members description',
    },
    description2: {
      id: 'hb.application:draft.householdMembersSection.description2#markdown',
      defaultMessage:
        'Heimilismenn mega einungis vera skáðir á eitt heimili og þar af leiðandi í einni húsnæðisbótaumsókn. Undantekning er þó á þessu fyrir heimilismenn undir 18 ára aldri. Einstaklingar undir 18 ára aldri mega vera skráðir heimilismenn á tveim mismunandi stöðum og tveim mismunandi húnsnæðisbótaumsóknum.',
      description: 'Household members description',
    },
    description3: {
      id: 'hb.application:draft.householdMembersSection.description3',
      defaultMessage:
        'Ef við á verður umgengnissamningur að fylgja með einstaklingar undir 18 ára aldri eru skráðir heimilismenn.',
      description: 'Household members description',
    },
    description4: {
      id: 'hb.application:draft.householdMembersSection.description4',
      defaultMessage:
        'Allir heimilismenn eldri en 18 ára munu þurfa að skrá sig inn á Ísland.is og samþykkja að upplýsingar um þá verði sóttar í meðferð þessarar umsóknar.',
      description: 'Household members description',
    },
    tableRepeaterTitle: {
      id: 'hb.application:draft.householdMembersSection.tableRepeaterTitle',
      defaultMessage: 'Leigjendur á völdum leigusamningi',
      description: 'Table repeater title - renters on selected contract',
    },
    nameColumn: {
      id: 'hb.application:draft.householdMembersSection.nameColumn',
      defaultMessage: 'Nafn',
      description: 'Name column header',
    },
    nationalIdColumn: {
      id: 'hb.application:draft.householdMembersSection.nationalIdColumn',
      defaultMessage: 'Kennitala',
      description: 'National ID column header',
    },
    custodyAgreementColumn: {
      id: 'hb.application:draft.householdMembersSection.custodyAgreementColumn',
      defaultMessage: 'Umgengnissamningur',
      description: 'Custody agreement column header',
    },
    addMemberButton: {
      id: 'hb.application:draft.householdMembersSection.addMemberButton',
      defaultMessage: 'Bæta við heimilismanni',
      description: 'Add household member button',
    },
    custodyAgreementUploadTitle: {
      id: 'hb.application:draft.householdMembersSection.custodyAgreementUploadTitle',
      defaultMessage: 'Umgengnissamningur',
      description: 'Custody agreement file upload title',
    },
    custodyAgreementUploadDescription: {
      id: 'hb.application:draft.householdMembersSection.custodyAgreementUploadDescription',
      defaultMessage:
        'Ef við á verður umgengnissamningur að fylgja með einstaklingar undir 18 ára aldri. Hladdu upp umgengnissamningi fyrir þennan heimilismann.',
      description:
        'Custody agreement upload description - required for household members under 18',
    },
    validationAtLeastOneMember: {
      id: 'hb.application:draft.householdMembersSection.validationAtLeastOneMember',
      defaultMessage:
        'Vinsamlegast bættu við að minnsta kosti einum heimilismanni',
      description: 'At least one household member required',
    },
    validationNationalIdRequired: {
      id: 'hb.application:draft.householdMembersSection.validationNationalIdRequired',
      defaultMessage: 'Gild kennitala er nauðsynleg',
      description: 'Valid national ID required for household member',
    },
  }),
  incomeSection: defineMessages({
    title: {
      id: 'hb.application:draft.incomeSection.title',
      defaultMessage: 'Tekjur',
      description: 'Income section title',
    },
    multiFieldTitle: {
      id: 'hb.application:draft.incomeSection.multiFieldTitle',
      defaultMessage: 'Upplýsingar um tekjur',
      description: 'Income multi field title',
    },
    multiFieldDescription: {
      id: 'hb.application:draft.incomeSection.multiFieldDescription',
      defaultMessage:
        'Við ákvörðun bóta eru allar tekjur heimilismanna teknar saman til að ákvarða upphæð til útgreiðslu. Heimilismenn þurfa að samþykkja að upplýsingar um þá séu sóttar til þess að HMS geti ákvarðað rétta upphæð til útgreiðslu.',
      description: 'Income multi field description',
    },
    hasOtherIncomeQuestion: {
      id: 'hb.application:draft.incomeSection.hasOtherIncomeQuestion',
      defaultMessage:
        'Hefur þú fengið aðrar tekjur en koma fram í staðgreiðslu til Skattsins?',
      description: 'Radio: does the applicant have other income',
    },
    optionYes: {
      id: 'hb.application:draft.incomeSection.optionYes',
      defaultMessage: 'Já',
      description: 'Yes option',
    },
    optionNo: {
      id: 'hb.application:draft.incomeSection.optionNo',
      defaultMessage: 'Nei',
      description: 'No option',
    },
    otherIncomeTypesTitle: {
      id: 'hb.application:draft.incomeSection.otherIncomeTypesTitle',
      defaultMessage: 'Tegund annarra tekna',
      description: 'Title above income-type checkboxes',
    },
    checkboxContractor: {
      id: 'hb.application:draft.incomeSection.checkboxContractor',
      defaultMessage: 'Verktakagreiðslur',
      description: 'Contractor payments checkbox',
    },
    checkboxForeign: {
      id: 'hb.application:draft.incomeSection.checkboxForeign',
      defaultMessage: 'Erlendar greiðslur',
      description: 'Foreign payments checkbox',
    },
    checkboxOther: {
      id: 'hb.application:draft.incomeSection.checkboxOther',
      defaultMessage: 'Aðrar greiðslur',
      description: 'Other payments checkbox',
    },
    contractorDescriptionTitle: {
      id: 'hb.application:draft.incomeSection.contractorDescriptionTitle',
      defaultMessage: 'Verktakagreiðslur',
      description: 'Text area title for contractor income',
    },
    contractorDescriptionDescription: {
      id: 'hb.application:draft.incomeSection.contractorDescriptionDescription',
      defaultMessage: 'Lýstu tekjunum og aðstæðum.',
      description: 'Text area description for contractor income',
    },
    contractorFilesTitle: {
      id: 'hb.application:draft.incomeSection.contractorFilesTitle',
      defaultMessage: 'Verktakagreiðslur – viðhengi',
      description: 'File upload title for contractor income',
    },
    contractorFilesDescription: {
      id: 'hb.application:draft.incomeSection.contractorFilesDescription',
      defaultMessage:
        'Hlaðið upp skjölum sem styðja við upplýsingarnar (t.d. PDF eða Word).',
      description: 'File upload description for contractor income',
    },
    foreignDescriptionTitle: {
      id: 'hb.application:draft.incomeSection.foreignDescriptionTitle',
      defaultMessage: 'Erlendar greiðslur',
      description: 'Text area title for foreign income',
    },
    foreignDescriptionDescription: {
      id: 'hb.application:draft.incomeSection.foreignDescriptionDescription',
      defaultMessage: 'Lýstu tekjunum og aðstæðum.',
      description: 'Text area description for foreign income',
    },
    foreignFilesTitle: {
      id: 'hb.application:draft.incomeSection.foreignFilesTitle',
      defaultMessage: 'Erlendar greiðslur – viðhengi',
      description: 'File upload title for foreign income',
    },
    foreignFilesDescription: {
      id: 'hb.application:draft.incomeSection.foreignFilesDescription',
      defaultMessage:
        'Hlaðið upp skjölum sem styðja við upplýsingarnar (t.d. PDF eða Word).',
      description: 'File upload description for foreign income',
    },
    otherDescriptionTitle: {
      id: 'hb.application:draft.incomeSection.otherDescriptionTitle',
      defaultMessage: 'Aðrar greiðslur',
      description: 'Text area title for other income',
    },
    otherDescriptionDescription: {
      id: 'hb.application:draft.incomeSection.otherDescriptionDescription',
      defaultMessage: 'Lýstu tekjunum og aðstæðum.',
      description: 'Text area description for other income',
    },
    otherFilesTitle: {
      id: 'hb.application:draft.incomeSection.otherFilesTitle',
      defaultMessage: 'Aðrar greiðslur – viðhengi',
      description: 'File upload title for other income',
    },
    otherFilesDescription: {
      id: 'hb.application:draft.incomeSection.otherFilesDescription',
      defaultMessage:
        'Hlaðið upp skjölum sem styðja við upplýsingarnar (t.d. PDF eða Word).',
      description: 'File upload description for other income',
    },
    validationCategoryDescriptionRequired: {
      id: 'hb.application:draft.incomeSection.validationCategoryDescriptionRequired',
      defaultMessage: 'Skýring er nauðsynleg þegar þessi tegund tekna er valin',
      description: 'Validation: description required when income type checked',
    },
    validationCategoryFilesRequired: {
      id: 'hb.application:draft.incomeSection.validationCategoryFilesRequired',
      defaultMessage: 'Að minnsta kosti eitt viðhengi er nauðsynlegt',
      description: 'Validation: files required when income type checked',
    },
    description: {
      id: 'hb.application:draft.incomeSection.description',
      defaultMessage:
        'Samkvæmt upplýsingum frá RSK þá eru þetta meðaltekjur þínar síðustu 12 mánuði, fyrir skatt:',
      description: 'Income description',
    },
    displayFieldTitle: {
      id: 'hb.application:draft.incomeSection.displayFieldTitle',
      defaultMessage: 'Meðaltekjur fyrir skatt',
      description: 'Income display field title',
    },
    fileUploadTitle: {
      id: 'hb.application:draft.incomeSection.fileUploadTitle',
      defaultMessage: 'Viðbótargögn',
      description: 'Income file upload title',
    },
    fileUploadDescription: {
      id: 'hb.application:draft.incomeSection.fileUploadDescription',
      defaultMessage:
        'Ef aðstæður þínar og tekjur hafa breyst frá meðaltali síðustu 12 mánaða, þá getur þú hér bætt við skjölum sem sýna breytta stöðu. Þetta gætu til dæmis verið launaseðlar, uppsagnabréf eða veikindavottorð.',
      description: 'Income file upload description',
    },
    textFieldTitle: {
      id: 'hb.application:draft.incomeSection.textFieldTitle',
      defaultMessage: 'Breyttar aðstæður og tekjur',
      description: 'Income text field title',
    },
    textFieldDescription: {
      id: 'hb.application:draft.incomeSection.textFieldDescription',
      defaultMessage:
        'Lýsing á þínum aðstæðum og tekjum ef þær eru mikið frábrugðnar frá meðaltali síðustu 12 mánaða.',
    },
  }),

  incomeNoTaxReturnSection: defineMessages({
    title: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.title',
      defaultMessage: 'Tekjur',
      description: 'Income section title (no tax return)',
    },
    multiFieldTitle: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.multiFieldTitle',
      defaultMessage: 'Upplýsingar um tekjur',
      description: 'Income multi field title (no tax return)',
    },
    multiFieldDescription: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.multiFieldDescription',
      defaultMessage:
        'Skattframtali fyrir síðasta ár hefur ekki verið skilað. Til að halda áfram þarf að gefa upp upplýsingar um tekjur.',
      description: 'Income multi field description (no tax return)',
    },
    descriptionTitle: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.descriptionTitle',
      defaultMessage: 'Lýsing á tekjum',
      description: 'Income description title (no tax return)',
    },
    descriptionDescription: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.descriptionDescription',
      defaultMessage:
        'Vinsamlegast lýstu þínum tekjum og aðstæðum. Þetta geta til dæmis verið launatekjur, verktakagreiðslur, erlendar tekjur, bætur eða aðrar tekjur.',
      description: 'Income text area description (no tax return)',
    },
    filesTitle: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.filesTitle',
      defaultMessage: 'Gögn um tekjur',
      description: 'Income file upload title (no tax return)',
    },
    filesDescription: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.filesDescription',
      defaultMessage:
        'Hlaðið upp skjölum sem staðfesta tekjur, t.d. launaseðlum, ráðningarsamningi eða öðrum gögnum.',
      description: 'Income file upload description (no tax return)',
    },
    validationDescriptionRequired: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.validationDescriptionRequired',
      defaultMessage: 'Lýsing á tekjum er nauðsynleg',
      description:
        'Validation: income description required when no tax return',
    },
    validationFilesRequired: {
      id: 'hb.application:draft.incomeNoTaxReturnSection.validationFilesRequired',
      defaultMessage:
        'Að minnsta kosti eitt viðhengi um tekjur er nauðsynlegt',
      description: 'Validation: income files required when no tax return',
    },
  }),

  paymentSection: defineMessages({
    title: {
      id: 'hb.application:draft.paymentSection.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment section title',
    },
    multiFieldTitle: {
      id: 'hb.application:draft.paymentSection.multiFieldTitle',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment multi field title',
    },
    multiFieldDescription: {
      id: 'hb.application:draft.paymentSection.multiFieldDescription',
      defaultMessage:
        'Veldu inn á hvaða aðila húsnæðisbætur eiga að greiðast og tilgreindu ráðstöfunarreikning fyrir valinn aðila.',
      description: 'Payment multi field description',
    },
    paymentRadioTitle: {
      id: 'hb.application:draft.paymentSection.paymentRadioTitle',
      defaultMessage: 'Aðili',
      description: 'Payment recipient radio title',
    },
    optionMe: {
      id: 'hb.application:draft.paymentSection.optionMe',
      defaultMessage:
        'Leigjandi - Greiða húsnæðisbætur inn á minn ráðstöfunarreikning',
      description: 'Pay to my account option',
    },
    optionLandlord: {
      id: 'hb.application:draft.paymentSection.optionLandlord',
      defaultMessage: 'Leigusali - Greiða húsnæðisbætur til leigusala',
      description: 'Pay to landlord option',
    },
    bankAccountTitle: {
      id: 'hb.application:draft.paymentSection.bankAccountTitle',
      defaultMessage: 'Ráðstöfunarreikningur',
      description: 'Bank account field title',
    },
    landlordSelectionTitle: {
      id: 'hb.application:draft.paymentSection.landlordSelectionTitle',
      defaultMessage: 'Veldu leigusala',
      description: 'Landlord selection radio title',
    },
    landlordBankAccountTitle: {
      id: 'hb.application:draft.paymentSection.landlordBankAccountTitle',
      defaultMessage: 'Bankareikningur leigusala',
      description: 'Landlord bank account field title',
    },
    validationPaymentRecipientRequired: {
      id: 'hb.application:draft.paymentSection.validationPaymentRecipientRequired',
      defaultMessage:
        'Vinsamlegast veldu hvort húsnæðisbætur eigi að greiðast þér eða leigusala',
      description: 'Payment recipient selection required',
    },
    validationBankAccountRequired: {
      id: 'hb.application:draft.paymentSection.validationBankAccountRequired',
      defaultMessage:
        'Vinsamlegast fylltu inn réttar upplýsingar um bankareikning',
      description: 'Bank account required when paying to self',
    },
    validationLandlordSelectionRequired: {
      id: 'hb.application:draft.paymentSection.validationLandlordSelectionRequired',
      defaultMessage: 'Vinsamlegast veldu leigusala',
      description: 'Landlord selection required when paying to landlord',
    },
    validationLandlordBankAccountRequired: {
      id: 'hb.application:draft.paymentSection.validationLandlordBankAccountRequired',
      defaultMessage: 'Vinsamlegast fylltu inn bankareikning leigusala',
      description: 'Landlord bank account required',
    },
  }),
  assetsDeclarationSection: defineMessages({
    title: {
      id: 'hb.application:draft.assetsDeclarationSection.title',
      defaultMessage: 'Eignayfirlýsing',
      description: 'Assets declaration section title',
    },
    multiFieldTitle: {
      id: 'hb.application:draft.assetsDeclarationSection.multiFieldTitle',
      defaultMessage: 'Eignayfirlýsing',
      description: 'Assets declaration multi field title',
    },
    description: {
      id: 'hb.application:draft.assetsDeclarationSection.description',
      defaultMessage:
        'Skattframtali fyrir síðasta ár hefur ekki verið skilað. Til að halda áfram þarf að fylla út eignayfirlýsingu.',
      description: 'Assets declaration description',
    },
    description2: {
      id: 'hb.application:draft.assetsDeclarationSection.description2',
      defaultMessage:
        'Eignayfirlýsing er einfaldlega upplistun á öllum þínum eignum. Ef þú átt engar eignir, þá þarft þú að lýsa því yfir að þú eigir engar eignir.',
      description: 'Assets declaration description 2',
    },
    radioTitle: {
      id: 'hb.application:draft.assetsDeclarationSection.radioTitle',
      defaultMessage: 'Átt þú einhverskonar eignir?',
      description: 'Assets declaration radio title',
    },
    radioDescription: {
      id: 'hb.application:draft.assetsDeclarationSection.radioDescription',
      defaultMessage:
        'Eignir geta til dæmis verið: Fasteignir, ökutæki, hlutabréf eða fjármagn',
      description: 'Assets declaration radio description',
    },
    optionYes: {
      id: 'hb.application:draft.assetsDeclarationSection.optionYes',
      defaultMessage: 'Já',
      description: 'Yes option',
    },
    optionNo: {
      id: 'hb.application:draft.assetsDeclarationSection.optionNo',
      defaultMessage: 'Nei',
      description: 'No option',
    },
    textFieldDescription: {
      id: 'hb.application:draft.assetsDeclarationSection.textFieldDescription',
      defaultMessage: 'Vinsamlegast listaðu upp allar þínar eignir.',
      description: 'Assets declaration text field description',
    },
  }),
  overviewSection: defineMessages({
    title: {
      id: 'hb.application:draft.overviewSection.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    description: {
      id: 'hb.application:draft.overviewSection.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir að allar upplýsingar séu rétt skráðar inn áður en umsóknin er send inn til HMS.',
      description: 'Overview section description',
    },
    submit: {
      id: 'hb.application:draft.overviewSection.submit',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application button',
    },
    name: {
      id: 'hb.application:draft.overviewSection.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nameIndex: {
      id: 'hb.application:draft.overviewSection.nameIndex',
      defaultMessage: 'Nafn {index}',
      description: 'Name with index',
    },
    nationalId: {
      id: 'hb.application:draft.overviewSection.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'hb.application:draft.overviewSection.address',
      defaultMessage: 'Heimilisfang',
      description: 'Address',
    },
    postalCode: {
      id: 'hb.application:draft.overviewSection.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    city: {
      id: 'hb.application:draft.overviewSection.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'hb.application:draft.overviewSection.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phoneNumber: {
      id: 'hb.application:draft.overviewSection.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    bankAccount: {
      id: 'hb.application:draft.overviewSection.bankAccount',
      defaultMessage: 'Bankareikningur',
      description: 'Bank account (overview, applicant)',
    },
    contractId: {
      id: 'hb.application:draft.overviewSection.contractId',
      defaultMessage: 'Leigusamningsnr.',
      description: 'Rental contract ID',
    },
    landlords: {
      id: 'hb.application:draft.overviewSection.landlords',
      defaultMessage: 'Leigusalar',
      description: 'Landlords',
    },
    renters: {
      id: 'hb.application:draft.overviewSection.renters',
      defaultMessage: 'Leigjendur',
      description: 'Renters',
    },
    exemptionStatus: {
      id: 'hb.application:draft.overviewSection.exemptionStatus',
      defaultMessage: 'Undanþága',
      description: 'Exemption status',
    },
    noExemption: {
      id: 'hb.application:draft.overviewSection.noExemption',
      defaultMessage: 'Ekki sótt um undanþágu',
      description: 'No exemption requested',
    },
    exemptionReason: {
      id: 'hb.application:draft.overviewSection.exemptionReason',
      defaultMessage: 'Ástæða undanþágu',
      description: 'Exemption reason',
    },
    householdMembers: {
      id: 'hb.application:draft.overviewSection.householdMembers',
      defaultMessage: 'Heimilismenn',
      description: 'Household members',
    },
    paymentRecipient: {
      id: 'hb.application:draft.overviewSection.paymentRecipient',
      defaultMessage: 'Aðili greiðslu',
      description: 'Payment recipient',
    },
  }),
}
