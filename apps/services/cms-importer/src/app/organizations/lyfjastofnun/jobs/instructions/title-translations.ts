// Manual English translations for Lyfjastofnun guideline titles. Unlike the
// lists importer, the Icelandic and English (ima.is) guideline pages link to
// different files under different names — cross-domain matching by URL/file
// name only catches a handful of shared external links, so almost every
// title here is translated by hand and reviewed by the programmer rather
// than lifted automatically from a confirmed English counterpart. Keyed by
// the scraped Icelandic title. English slug is derived from the title the
// same way the Icelandic slug is (see mapper.ts) — no need to duplicate it
// here.
export const TITLE_TRANSLATIONS_EN: Record<string, string> = {
  'Aðgengi að mannalyfjum fyrir markaðssetningu eða áður en þau fá markaðsleyfi':
    'Access to medicines before they are marketed or before marketing authorisation',
  'Skýringar með lyfjaverðskrá':
    'Clarifications to the Icelandic Medicine Price Catalogue',
  'Röðun í viðmiðunarverðflokka': 'Classification in reference price categories',
  'Greiðsluþátttaka í leyfisskyldum lyfjum':
    'Reimbursement system for Specialty Care High-Cost Medicine',
  'Greiðsluþátttaka í almennum lyfjum': 'Reimbursement of general medicines',
  'Flokkun lyfs sem leyfisskylt lyf':
    'Classification of a medicine as a Specialty Care High-Cost Medicine',
  'Vinnuregla um ákvörðun hámarksheildsöluverðs á lyfjum (gildir frá 1.8.2025)':
    'Work procedure for determining the maximum wholesale price of medicines (in effect from 1 August 2025)',
  'Leiðbeiningar vegna birtingar í lyfjaverðskrá og sérlyfjaskrá':
    'Guidelines on publication in the Icelandic Medicinal Product Information Database and the Icelandic Medicine Price Catalogue',
  'Leiðbeiningar til að reikna heildsöluverð frá smásöluverði í Svíþjóð og Finnlandi':
    'Guidelines for calculating wholesale price from retail price in Sweden and Finland',
  'Upplýsingar um vefþjónustur lyfjaverðskrá, lýsingar og skýringar':
    'Information on web services for the Icelandic Medicine Price Catalogue, descriptions and clarifications',
  'Útreikningar á lyfjaverðskrárgengi':
    'Calculation of the Icelandic Medicine Price Catalogue exchange rate',
  'Leiðbeiningar Framkvæmdarstjórnar Evrópusambandsins um lækningatæki':
    'European Commission guidelines on medical devices',
  'Leiðbeiningar um útfyllingu eyðublaðs framleiðanda vegna atvikatilkynningar lækningatækja':
    "Guidelines for manufacturers on completing the medical device incident report form",
  'Leiðbeiningar um umsókn um niðurfellingu markaðsleyfis eða brottfalls úr lyfjaskrám':
    'Guidelines on applying to withdraw a marketing authorisation or remove a medicine from the medicine registers',
  'Leiðbeiningar vegna gerð samninga um lyfjafræðilega þjónustu':
    'Guidelines on drafting agreements on pharmaceutical services',
  'Leiðbeiningar þegar starfsemi lyfjabúrs er hætt eða skipt er um samningsaðila':
    'Guidelines for when a dispensary ceases operation or changes contracting party',
  'Leiðbeiningar um öflun, geymslu og meðferð lyfja á heilbrigðisstofnunum':
    'Guidelines on the procurement, storage, and handling of medicines at health institutions',
  'Leiðbeiningar um ábyrgð og eftirlit lyfjafræðinga vegna umsýslu lyfja á heilbrigðisstofnunum':
    "Guidelines on pharmacists' responsibility and oversight of medicine management at health institutions",
  'Leiðbeiningar vegna tímabundins leyfis fyrir afmörkuð störf lyfjafræðings':
    'Guidelines on a restricted professional position as a pharmacist on a temporary basis',
  'Leiðbeiningar um fölsuð skilríki og gögn':
    'Guidelines on falsified identification and documents',
  'Leiðbeiningar um ráðningu staðgengils lyfsöluleyfishafa':
    'Guidelines on appointing a substitute for a pharmacy licence holder',
  'Leiðbeiningar um skömmtun og sölu skammtaðra lyfja í lyfjabúðum':
    'Guidelines on dose dispensing and sale of dose-dispensed medicines in pharmacies',
  'Leiðbeiningar um góða starfshætti í apótekum og afgreiðsla og afhending lyfja':
    'Guidelines on good practice in pharmacies and the dispensing and delivery of medicines',
  'Leiðbeiningar fyrir dýralækna sem stunda lyfjasölu':
    'Guidelines for veterinarians dispensing medicines',
  'Leiðbeiningar um lyfjaauglýsingar': 'Guidelines on medicine advertising',
  'Gerð fylgiseðla vegna landsskráðra lyfja':
    'Preparation of package leaflets for nationally authorised medicines',
  'Leiðbeiningar varðandi umsóknir um breytingar á forsendum markaðsleyfa landskráðra lyfja':
    'Guidelines on applications to change the basis of marketing authorisations for nationally authorised medicines',
  'Íslensk þýðing frá árinu 1997 á leiðbeiningum um góða framleiðsluhætti í lyfjagerð':
    '1997 Icelandic translation of the guidelines on good manufacturing practice in medicine production',
  'Leiðbeiningar um meðferð og sölu lausasölulyfja í almennum verslunum':
    'Guidelines on the handling and sale of OTC medicines in general retail stores',
}

// One guideline on the Icelandic page has no Icelandic title at all — the
// site displays the English EU/EMA document title verbatim, since no
// Icelandic version of the source document exists. We author our own
// Icelandic title for it rather than showing English on both locales.
// Keyed by the scraped (English) title.
export const TITLE_OVERRIDES_IS: Record<string, string> = {
  'A guideline on changing the classification for the supply of a medicinal product for human use':
    'Leiðbeiningar um breytingu á afgreiðsluflokkun lyfja ætlaðra mönnum',
}
