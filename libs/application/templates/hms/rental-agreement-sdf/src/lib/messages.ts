export const application = {
  name: 'Húsaleigusamningur',
  institutionName: 'Húsnæðis- og mannvirkjastofnun',
  rentalHousingSection: 'Leiguhúsnæðið',
}

export const propertySearch = {
  title: 'Leiguhúsnæðið',
  description:
    'Finndu eignina með heimilisfangi eða fasteignanúmeri. Smelltu á viðeigandi fasteignanúmer og veldu leigueiningu sem við á.',
  placeholder: 'Sláðu inn heimilisfang eða fasteignanúmer',
  spouseFamilyNotice:
    'Ef hið leigða er bústaður fjölskyldu leigusala eða notað við atvinnurekstur hjóna, eða ætlað til þess, þá ber að fá undirskrift maka sbr. IX. kafla hjúskaparlaga.',
  tableHeaderPropertyCode: 'Fasteignanúmer',
  tableHeaderUnitCode: 'Merking',
  tableHeaderSize: 'Stærð',
  tableHeaderRooms: 'Herbergi',
}

export const propertyInfo = {
  subsectionName: 'Tegund leiguhúsnæðis',
  pageTitle: 'Tegund leiguhúsnæðis og sérstakir hópar',
  categoryTitle: 'Tegund leiguhúsnæðis',
  categoryDescription:
    'Veldu hér hvort um er að ræða íbúð, herbergi eða atvinnuhúsnæði leigt út sem íbúðarhúsnæði.',
  categoryLabel: 'Tegund leiguhúsnæðis',
  specialGroupsTitle: 'Sérstakir hópar',
  specialGroupsDescription:
    'Er húsnæðið ætlað fyrir sérstaka hópa, t.d. námsfólk, eldri borgara eða tekjulægri hópa?',
  categoryClassGroupLabel: 'Tegund sérstaks hóps',
  categoryClassGroupPlaceholder: 'Veldu hóp',
  /** Validation (Zod NEXT_PAGE errors → field componentId path) */
  categoryTypeRequiredError: 'Velja þarf tegund leiguhúsnæðis.',
  categoryClassRequiredError:
    'Velja þarf hvort um er að ræða leigu á venjulegum markaði eða vegna tiltekinna hópa.',
  categoryClassGroupRequiredError: 'Veldu flokk húsnæðis',
  roomTypeRoomCountError:
    'Herbergi þarf að hafa eitt herbergi skráð í leigueiningum.',
}

export const specialProvisions = {
  subsectionName: 'Lýsing leiguhúsnæðis',
  pageTitle: 'Nánari lýsing og sérákvæði',
  pageDescription:
    'Hér má taka fram nánari lýsingu á hinu leigða og/eða sérákvæði sem eiga að fylgja samningnum.',
  descriptionTitle: 'Nánari lýsing á húsnæðinu',
  descriptionInputLabel: 'Lýsing á leiguhúsnæði',
  descriptionInputPlaceholder: 'Skrifaðu hér nánari lýsingu á húsnæðinu',
  rulesTitle: 'Sérákvæði',
  rulesInputLabel: 'Sérákvæði',
  rulesInputPlaceholder: 'Skrifaðu hér sérákvæði',
  changedSizeWarning:
    'Stærð leigueininga hefur verið breytt. Gott er að skrá skýringu í lýsingu á húsnæðinu.',
}

export const housingCondition = {
  subsectionName: 'Ástandsúttekt',
  pageTitle: 'Ástand leiguhúsnæðis',
  pageDescription:
    'Leigusamningur þarf lögum samkvæmt að innihalda ástandsúttekt á húsnæðinu. Sú úttekt þarf að fara fram við samningsgerðina.',
  inspectorTitle: 'Framkvæmdaraðili ástandsskoðunar',
  inspectorDescription:
    'Athugið að aðilar geta sjálfir gert ástandsúttekt eða fengið óháðan aðila til þess og þá skiptist kostnaðurinn við það jafnt á milli aðila.',
  independentInspectorNamePlaceholder: 'Skrifaðu hér fullt nafn óháðs aðila',
  inspectionResultsTitle: 'Niðurstöður ástandsúttektar',
  inspectionResultsDescription:
    'Hér á að setja inn helstu niðurstöður ástandsúttektar.',
  inspectionResultsInputLabel: 'Helstu niðurstöður ástandsúttektar',
  inspectionResultsInputPlaceholder:
    'Skrifaðu hér helstu niðurstöður ástandsúttektar',
  fileUploadTitle: 'Dragðu skjöl hingað til að hlaða upp',
  fileUploadDescription:
    'Tekið er við skjölum með endinguna: .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
}

export const fireProtections = {
  subsectionName: 'Brunavarnir',
  pageTitle: 'Brunavarnir í leiguhúsnæðinu',
  pageDescription:
    'Leigusamningur þarf lögum samkvæmt að innihalda úttekt á brunavörnum í húsnæðinu. Sú úttekt þarf að fara fram við samningsgerðina.',
  smokeDetectorsFireExtinguisherTitle: 'Reykskynjarar og slökkvitæki',
  smokeDetectorsFireExtinguisherRequirements:
    'Nauðsynlegt er að hafa að minnsta kosti einn reykskynjara á hverja 80m2 og eitt slökkvitæki í eigninni.',
  smokeDetectorsLabel: 'Reykskynjari',
  fireExtinguisherLabel: 'Slökkvitæki',
  smokeDetectorsAlertTitle: 'Athugaðu fjölda reykskynjara',
  smokeDetectorsAlertMessage:
    'Miðað við stærð húsnæðis þarf að minnsta kosti einn reykskynjara á hverja 80m2.',
  fireExtinguisherAlertTitle: 'Slökkvitæki vantar',
  fireExtinguisherAlertMessage:
    'Nauðsynlegt er að hafa að minnsta kosti eitt slökkvitæki í eigninni.',
  fireBlanketLabel: 'Eldvarnarteppi',
  fireBlanketRequirements: 'Ekki er gerð krafa um eldvarnarteppi.',
  exitsLabel: 'Flóttaleið',
  exitRequirements: 'Er flóttaleið þekkt og greiðfær?',
  eldklarMessage: 'Ítarefni um brunavarnir má finna á heimasíðu Eldklár',
}

export const misc = {
  yes: 'Já',
  no: 'Nei',
  fullName: 'Fullt nafn',
  contractParties: 'Samningsaðilar',
  independentParty: 'Óháður aðili',
  entireHome: 'Íbúð',
  room: 'Herbergi',
  commercial: 'Atvinnuhúsnæði',
  generalMarket: 'Nei',
  specialGroups: 'Já',
}
