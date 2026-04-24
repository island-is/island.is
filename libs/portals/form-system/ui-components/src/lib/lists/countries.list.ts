import { FormSystemListItem } from '@island.is/api/schema'

export class Country {
  is!: string
  formal!: string
  en!: string
  twoLetterCode!: string
  threeLetterCode!: string

  constructor(init: {
    is: string
    formal: string
    en: string
    twoLetterCode: string
    threeLetterCode: string
  }) {
    Object.assign(this, init)
  }

  static fromTsvLine(tsvLine: string): Country {
    const parts = tsvLine
      .split('\t')
      .map((part) => part.replace(/\u00A0/g, ' ').trim())

    if (parts.length !== 5) {
      throw new Error(
        `Invalid country TSV row (expected 5 columns): "${tsvLine}"`,
      )
    }

    const [is, formal, en, twoLetterCode, threeLetterCode] = parts

    const normalizeCode = (code: string) =>
      code.replace(/[()]/g, '').replace(/\s+/g, '').trim()

    return new Country({
      is,
      formal,
      en,
      twoLetterCode: normalizeCode(twoLetterCode),
      threeLetterCode: normalizeCode(threeLetterCode),
    })
  }
}

const countriesListTsv = `Afganistan\tÍslamska lýðveldið Afganistan\tAfghanistan\tAF\tAFG
Albanía\tLýðveldið Albanía\tAlbania\tAL\tALB
Alsír\tAlþýðulýðveldið Alsír\tAlgeria\tDZ\tDZA
Andorra\tFurstadæmið Andorra\tAndorra\tAD\tAND
Angóla\tLýðveldið Angóla\tAngola\tAO\tAGO
Antígva og Barbúda\tN/A\tAntigua and Barbuda\tAG\tAGT
Argentína\tArgentínska lýðveldið\tArgentina\tAR\tARG
Armenía\tLýðveldið Armenía\tArmenia\tAM\tARM
Aserbaísjan\tLýðveldið Aserbaísjan\tAzerbaijan\tAZ\tAZE
Austurríki\tLýðveldið Austurríki\tAustria\tAT\tAUT
Ástralía\tSamveldið Ástralía\tAustralia\tAU\tAUS
Bahamaeyjar\tSamveldið Bahamaeyjar\tBahamas (the)\tBS\tBHS
Bandaríkin\tBandaríki Ameríku\tUnited States of America (the)\tUS\tUSA
Bangladess\tAlþýðulýðveldið Bangladess\tBangladesh\tBD\tBGD
Barbados\tN/A\tBarbados\tBB\tBRB
Barein\tKonungsríkið Barein\tBahrain\tBH\tBHR
Belgía\tKonungsríkið Belgía\tBelgium\tBE\tBEL
Belís\tN/A\tBelize\tBZ\tBLZ
Benín\tLýðveldið Benín\tBenin\tBJ\tBEN
Bosnía og Hersegóvína\tN/A\tBosnia and Herzegovina\tBA\tBIH
Botsvana\tLýðveldið Botsvana\tBotswana\tBW\tBWA
Bólivía\tFjölþjóðaríkið Bólivía\tBolivia (Plurinational State of)\tBO\tBOL
Brasilía\tSambandslýðveldið Brasilía\tBrazil\tBR\tBRA
Bretland\tSameinaða konungsríkið Stóra-Bretland og Norður-Írland\tUnited Kingdom of Great Britain and Northern Ireland (the)\tGB\tGBR
Brúnei\tBrúnei Darrússalam\tBrunei Darussalam\tBN\tBRN
Búlgaría\tLýðveldið Búlgaría\tBulgaria\tBG\tBGR
Búrkína Fasó\tN/A\tBurkina Faso\tBF\tBFA
Búrúndí\tLýðveldið Búrúndí\tBurundi\tBI\tBDI
Bútan\tKonungsríkið Bútan\tBhutan\tBT\tBTN
Danmörk\tKonungsríkið Danmörk\tDenmark\tDK\tDNK
Djibútí\tLýðveldið Djibútí\tDjibouti\tDJ\tDJI
Dóminíka\tSamveldið Dóminíka\tDominica\tDM\tDMA
Dóminíska lýðveldið\tN/A\tDominican Republic (the)\tDO\tDOM
Egyptaland\tArabalýðveldið Egyptaland\tEgypt\tEG\tEGY
Eistland\tLýðveldið Eistland\tEstonia\tEE\tEST
Ekvador\tLýðveldið Ekvador\tEcuador\tEC\tECU
El Salvador\tLýðveldið El Salvador\tEl Salvador\tSV\tSLV
Eritrea\tEritreuríki\tEritrea\tER\tERI
Esvatíní\tKonungsríkið Esvatíní\tEswatini\tSZ\tSWZ
Eþíópía\tSambandslýðstjórnarlýðveldið Eþíópía\tEthiopia\tET\tETH
Fídjí\tLýðveldið Fídjí\tFiji\tFJ\tFJI
Filippseyjar\tLýðveldið Filippseyjar\tPhilippines (the)\tPH\tPHL
Finnland\tLýðveldið Finnland\tFinland\tFI\tFIN
Fílabeinsströndin\tLýðveldið Côte d‘Ivoire\tCôte d‘Ivoire\tCI\tCIV
Frakkland\tFranska lýðveldið\tFrance\tFR\tFRA
Gabon\tGabonska lýðveldið\tGabon\tGA\tGAB
Gambía\tLýðveldið Gambía\tGambia (the)\tGM\tGMB
Gana\tLýðveldið Gana\tGhana\tGH\tGHA
Georgía\tN/A\tGeorgia\tGE\tGEO
Gínea\tLýðveldið Gínea\tGuinea\tGN\tGIN
Gínea-Bissaú\tLýðveldið Gínea-Bissaú\tGuinea-Bissau\tGW\tGNB
Grenada\tN/A\tGrenada\tGD\tGRD
Grikkland\tHellenska lýðveldið\tGreece\tGR\tGRC
Grænhöfðaeyjar\tLýðveldið Cabo Verde\tCabo Verde\tCV\tCPV
Gvatemala\tLýðveldið Gvatemala\tGuatemala\tGT\tGTM
Gvæjana\tSamvinnulýðveldið Gvæjana\tGuyana\tGY\tGUY
Haítí\tLýðveldið Haítí\tHaiti\tHT\tHTI
Holland\tKonungsríki Niðurlanda\tNetherlands (the)\tNL\tNLD
Hondúras\tLýðveldið Hondúras\tHonduras\tHN\tHND
Hvíta-Rússland\tLýðveldið Belarús\tBelarus\tBY\tBLR
Indland\tLýðveldið Indland\tIndia\tIN\tIND
Indónesía\tLýðveldið Indónesía\tIndonesia\tID\tIDN
Írak\tLýðveldið Írak\tIraq\tIQ\tIRQ
Íran\tÍslamska lýðveldið Íran\tIran (Islamic Republic of)\tIR\tIRN
Írland\tN/A\tIreland\tIE\tIRL
Ísland\tN/A\tIceland\tIS\tISL
Ísrael\tÍsraelsríki\tIsrael\tIL\tISR
Ítalía\tÍtalska lýðveldið\tItaly\tIT\tITA
Jamaíka\tN/A\tJamaica\tJM\tJAM
Japan\tN/A\tJapan\tJP\tJPN
Jemen\tLýðveldið Jemen\tYemen\tYE\tYEM
Jórdanía\tHasémíska konungsríkið Jórdanía\tJordan\tJO\tJOR
Kambódía\tKonungsríkið Kambódía\tCambodia\tKH\tKHM
Kamerún\tLýðveldið Kamerún\tCameroon\tCM\tCMR
Kanada\tN/A\tCanada\tCA\tCAN
Kasakstan\tLýðveldið Kasakstan\tKazakhstan\tKZ\tKAZ
Katar\tKatarríki\tQatar\tQA\tQAT
Kenía\tLýðveldið Kenía\tKenya\tKE\tKEN
Kirgistan\tKirgiska lýðveldið\tKyrgyzstan\tKG\tKGZ
Kína\tAlþýðulýðveldið Kína\tChina\tCN\tCHN
Kíribatí\tLýðveldið Kíribatí\tKiribati\tKI\tKIR
Lýðstjórnarlýðveldið Kongó\tLýðstjórnarlýðveldið Kongó\tCongo (the Democratic Republic of the)\tCD\tCOD
Lýðveldið Kongó\tLýðveldið Kongó\tCongo (the)\tCG\tCOG
Kosta Ríka\tLýðveldið Kosta Ríka\tCosta Rica\tCR\tCRI
Kólumbía\tLýðveldið Kólumbía\tColombia\tCO\tCOL
Kómorur\tKómorsambandið\tComoros (the)\tKM\tCOM
Norður-Kórea\tAlþýðulýðveldið Kórea\tKorea (the Democratic People‘s Republic of)\tKP\tPRK
Suður-Kórea\tLýðveldið Kórea\tKorea (the Republic of)\tKR\tKOR
Kósovó\tLýðveldið Kósovó\tKosovo\t(XK)\tN/A
Króatía\tLýðveldið Króatía\tCroatia\tHR\tHRV
Kúba\tLýðveldið Kúba\tCuba\tCU\tCUB
Kúveit\tKúveitríki\tKuwait\tKW\tKWT
Kýpur\tLýðveldið Kýpur\tCyprus\tCY\tCYP
Laos\tLaoska alþýðulýðveldið\tLao People‘s Democratic Republic (the)\tLA\tLAO
Lesótó\tKonungsríkið Lesótó\tLesotho\tLS\tLSO
Lettland\tLýðveldið Lettland\tLatvia\tLV\tLVA
Liechtenstein\tFurstadæmið Liechtenstein\tLiechtenstein\tLI\tLIE
Litáen\tLýðveldið Litáen\tLithuania\tLT\tLTU
Líbanon\tLíbanska lýðveldið\tLebanon\tLB\tLBN
Líbería\tLýðveldið Líbería\tLiberia\tLR\tLBR
Líbía\tN/A\tLibya\tLY\tLBY
Lúxemborg\tStórhertogadæmið Lúxemborg\tLuxembourg\tLU\tLUX
Madagaskar\tLýðveldið Madagaskar\tMadagascar\tMG\tMDG
Malasía\tN/A\tMalaysia\tMY\tMYS
Malaví\tLýðveldið Malaví\tMalawi\tMW\tMWI
Maldívur\tLýðveldið Maldívur\tMaldives\tMV\tMDV
Malí\tLýðveldið Malí\tMali\tML\tMLI
Malta\tLýðveldið Malta\tMalta\tMT\tMLT
Marokkó\tKonungsríkið Marokkó\tMorocco\tMA\tMAR
Marshall-eyjar\tLýðveldið Marshall-eyjar\tMarshall Islands (the)\tMH\tMHL
Máritanía\tÍslamska lýðveldið Máritanía\tMauritania\tMR\tMRT
Máritíus\tLýðveldið Máritíus\tMauritius\tMU\tMUS
Mexíkó\tMexíkóska ríkjasambandið\tMexico\tMX\tMEX
Mið-Afríkulýðveldið\tN/A\tCentral African Republic (the)\tCF\tCAF
Miðbaugs-Gínea\tLýðveldið Miðbaugs-Gínea\tEquatorial Guinea\tGQ\tGNQ
Míkrónesía\tSambandsríki Míkrónesíu\tMicronesia (Federated States of)\tFM\tFSM
Mjanmar\tMjanmarsambandið\tMyanmar\tMM\tMMR
Moldóva\tLýðveldið Moldóva\tMoldova (the Republic of)\tMD\tMDA
Mongólía\tN/A\tMongolia\tMN\tMNG
Mónakó\tFurstadæmið Mónakó\tMonaco\tMC\tMCO
Mósambík\tLýðveldið Mósambík\tMozambique\tMZ\tMOZ
Namibía\tLýðveldið Namibía\tNamibia\tNA\tNAM
Naúrú\tLýðveldið Naúrú\tNauru\tNR\tNRU
Nepal\tSambandslýðstjórnarlýðveldið Nepal\tNepal\tNP\tNPL
Níkaragva\tLýðveldið Níkaragva\tNicaragua\tNI\tNIC
Níger\tLýðveldið Níger\tNiger (the)\tNE\tNER
Nígería\tSambandslýðveldið Nígería\tNigeria\tNG\tNGA
Norður-Makedónía\tLýðveldið Norður-Makedónía\tNorth Macedonia\tMK\tMKD
Noregur\tKonungsríkið Noregur\tNorway\tNO\tNOR
Nýja-Sjáland\tN/A\tNew Zealand\tNZ\tNZL
Óman\tSoldánsveldið Óman\tOman\tOM\tOMN
Pakistan\tÍslamska lýðveldið Pakistan\tPakistan\tPK\tPAK
Palaú\tLýðveldið Palaú\tPalau\tPW\tPLW
Palestína\tPalestínuríki\tPalestine, State of\tPS\tPSE
Panama\tLýðveldið Panama\tPanama\tPA\tPAN
Papúa Nýja-Gínea\tSjálfstæða ríkið Papúa Nýja-Gínea\tPapua New Guinea\tPG\tPNG
Paragvæ\tLýðveldið Paragvæ\tParaguay\tPY\tPRY
Páfagarður (Vatíkanið)\tVatíkanborgríkið\tVatican City State\tVA\tVAT
Perú\tLýðveldið Perú\tPeru\tPE\tPER
Portúgal\tPortúgalska lýðveldið\tPortugal\tPT\tPRT
Pólland\tLýðveldið Pólland\tPoland\tPL\tPOL
Rúanda\tLýðveldið Rúanda\tRwanda\tRW\tRWA
Rúmenía\tN/A\tRomania\tRO\tROU
Rússland\tRússneska sambandsríkið\tRussian Federation (the)\tRU\tRUS
Salómonseyjar\tN/A\tSolomon Islands\tSB\tSLB
Sambía\tLýðveldið Sambía\tZambia\tZM\tZMB
Sameinuðu arabísku furstadæmin\tN/A\tUnited Arab Emirates (the)\tAE\tARE
Samóa\tSjálfstæða ríkið Samóa\tSamoa\tWS\tWSM
San Marínó\tLýðveldið San Marínó\tSan Marino\tSM\tSMR
Sankti Kitts og Nevis\tSambandsríkið Sankti Kitts og Nevis\tSaint Kitts and Nevis\tKN\tKNA
Sankti Lúsía\tN/A\tSaint Lucia\tLC\tLCA
Sankti Vinsent og Grenadínur\tN/A\tSaint Vincent and the Grenadines\tVC\tVCT
Saó Tóme og Prinsípe\tLýðstjórnarlýðveldið Saó Tóme og Prinsípe\tSao Tome and Principe\tST\tSTP
Sádi-Arabía\tKonungsríkið Sádi-Arabía\tSaudi Arabia\tSA\tSAU
Senegal\tLýðveldið Senegal\tSenegal\tSN\tSEN
Serbía\tLýðveldið Serbía\tSerbia\tRS\tSRB
Seychelles-eyjar\tLýðveldið Seychelles-eyjar\tSeychelles\tSC\tSYC
Simbabve\tLýðveldið Simbabve\tZimbabwe\tZW\tZWE
Singapúr\tLýðveldið Singapúr\tSingapore\tSG\tSGP
Síerra Leóne\tLýðveldið Síerra Leóne\tSierra Leone\tSL\tSLE
Síle\tLýðveldið Síle\tChile\tCL\tCHL
Slóvakía\tSlóvakíska lýðveldið\tSlovakia\tSK\tSVK
Slóvenía\tLýðveldið Slóvenía\tSlovenia\tSI\tSVN
Sómalía\tSambandslýðveldið Sómalía\tSomalia\tSO\tSOM
Spánn\tKonungsríkið Spánn\tSpain\tES\tESP
Srí Lanka\tSósíalíska lýðstjórnarlýðveldið Srí Lanka\tSri Lanka\tLK\tLKA
Suður-Afríka\tLýðveldið Suður-Afríka\tSouth Africa\tZA\tZAF
Suður-Súdan\tLýðveldið Suður-Súdan\tSouth Sudan\tSS\tSSD
Súdan\tLýðveldið Súdan\tSudan (the)\tSD\tSDN
Súrínam\tLýðveldið Súrínam\tSuriname\tSR\tSUR
Svartfjallaland\tN/A\tMontenegro\tME\tMNE
Sviss\tSvissneska ríkjasambandið\tSwitzerland\tCH\tCHE
Svíþjóð\tKonungsríkið Svíþjóð\tSweden\tSE\tSWE
Sýrland\tSýrlenska arabalýðveldið\tSyrian Arab Republic\tSY\tSYR
Tadsíkistan\tLýðveldið Tadsíkistan\tTajikistan\tTJ\tTJK
Taíland\tKonungsríkið Taíland\tThailand\tTH\tTHA
Tansanía\tSambandslýðveldið Tansanía\tTanzania, United Republic of\tTZ\tTZA
Tékkland\tTékkneska lýðveldið\tCzech Republic (the)\tCZ\tCZE
Tímor-Leste\tLýðstjórnarlýðveldið Tímor-Leste\tTimor-Leste\tTL\tTLS
Tjad\tLýðveldið Tjad\tChad\tTD\tTCD
Tonga\tKonungsríkið Tonga\tTonga\tTO\tTON
Tógó\tTógóska lýðveldið\tTogo\tTG\tTGO
Trínidad og Tóbagó\tLýðveldið Trínidad og Tóbagó\tTrinidad and Tobago\tTT\tTTO
Túnis\tTúniska lýðveldið\tTunisia\tTN\tTUN
Túrkmenistan\tN/A\tTurkmenistan\tTM\tTKM
Túvalú\tN/A\tTuvalu\tTV\tTUV
Tyrkland\tLýðveldið Tyrkland\tTurkey\tTR\tTUR
Ungverjaland\tLýðveldið Ungverjaland\tHungary\tHU\tHUN
Úganda\tLýðveldið Úganda\tUganda\tUG\tUGA
Úkraína\tN/A\tUkraine\tUA\tUKR
Úrúgvæ\tAustræna lýðveldið Úrúgvæ\tUruguay\tUY\tURY
Úsbekistan\tLýðveldið Úsbekistan\tUzbekistan\tUZ\tUZB
Vanúatú\tLýðveldið Vanúatú\tVanuatu\tVU\tVUT
Venesúela\tBólivarska lýðveldið Venesúela\tVenezuela (Bolivarian Republic of)\tVE\tVEN
Víetnam\tAlþýðulýðveldið Víetnam\tViet Nam\tVN\tVNM
Þýskaland\tSambandslýðveldið Þýskaland\tGermany\tDE\tDEU`

export const countriesList: Country[] = countriesListTsv
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => Country.fromTsvLine(line))

export const countriesAsListItems = (): FormSystemListItem[] =>
  countriesList.map((country, index) => ({
    id: country.twoLetterCode,
    label: {
      is: `${country.is} (${country.twoLetterCode})`,
      en: `${country.en} (${country.twoLetterCode})`,
    },
    value: country.twoLetterCode,
    displayOrder: index,
    isSelected: false,
  }))
