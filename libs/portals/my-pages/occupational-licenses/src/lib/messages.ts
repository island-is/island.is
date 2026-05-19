import { defineMessages } from 'react-intl'

export const olMessage = defineMessages({
  occupationalLicense: {
    id: 'sp.occupational-licenses:occupational-license',
    defaultMessage: 'Starfsleyfi',
  },
  myLicenses: {
    id: 'sp.occupational-licenses:my-licenses',
    defaultMessage: 'Mín starfsleyfi',
  },
  singleEducationLicense: {
    id: 'sp.occupational-licenses:single-education-license',
    defaultMessage: 'Stakt leyfisbréf kennara',
  },
  singleHealthLicense: {
    id: 'sp.occupational-licenses:single-health-license',
    defaultMessage: 'Stakt starfsleyfi heilbrigðisstarfsmanns',
  },
  singleLicense: {
    id: 'sp.occupational-licenses:single-license',
    defaultMessage: 'Stakt starfsleyfi',
  },
  educationIntro: {
    id: 'sp.occupational-licenses:education-intro',
    defaultMessage:
      'Hér birtast leyfisbréf kennara sem hafa verið útskrifaðir frá 1988. Bréfin eru sótt til Menntamálastofnunar.',
  },
  theDirectorateOfEducation: {
    id: 'sp.occupational-licenses:the-directorate-of-education',
    defaultMessage: 'Menntamálastofnun',
  },
  theDirectorateOfHealth: {
    id: 'sp.occupational-licenses:the-directorate-of-health',
    defaultMessage: 'Embætti landlæknis',
  },
  healthDirectorateIntro: {
    id: 'sp.occupational-licenses:health-directorate-intro',
    defaultMessage: 'Starfsleyfi útgefið af Landlæknisembættinu.',
  },
  healthDirectorateTooltip: {
    id: 'sp.occupational-licenses:health-directorate-tooltip',
    defaultMessage:
      'Embætti landlæknis hefur umsjón með gögnum um starfsleyfi heilbrigðisstarfsfólks.',
  },
  validLicense: {
    id: 'sp.occupational-licenses:valid-license',
    defaultMessage: 'Í gildi',
  },
  invalidLicense: {
    id: 'sp.occupational-licenses:invalid-license',
    defaultMessage: 'Útrunnið',
  },
  unknownLicense: {
    id: 'sp.occupational-licenses:unknown-license',
    defaultMessage: 'Óþekkt',
  },
  inProgressLicense: {
    id: 'sp.occupational-licenses:in-progress-license',
    defaultMessage: 'Í vinnslu',
  },
  validWithLimitationsLicense: {
    id: 'sp.occupational-licenses:valid-with-limitations-license',
    defaultMessage: 'Í gildi með takmörkunum',
  },
  revokedLicense: {
    id: 'sp.occupational-licenses:revoked-license',
    defaultMessage: 'Svipting',
  },
  waivedLicense: {
    id: 'sp.occupational-licenses:waived-license',
    defaultMessage: 'Afsal',
  },
  dayOfPublication: {
    id: 'sp.occupational-licenses:day-of-publication',
    defaultMessage: 'Útgáfudagur',
  },
  errorFetchLicense: {
    id: 'sp.occupational-licenses:error-fetch-license',
    defaultMessage: 'Ekki tókst að sækja leyfisbréf',
  },
  fetchLicense: {
    id: 'sp.occupational-licenses:fetch-license',
    defaultMessage: 'Sækja leyfisbréf',
  },
  nameOfIndividual: {
    id: 'sp.occupational-licenses:name-of-individual',
    defaultMessage: 'Nafn einstaklings',
  },
  licenseNumber: {
    id: 'sp.occupational-licenses:license-number',
    defaultMessage: 'Skírteinisnúmer',
  },
  dateOfBirth: {
    id: 'sp.occupational-licenses:date-of-birth',
    defaultMessage: 'Fæðingardagur',
  },
  profession: {
    id: 'sp.occupational-licenses:profession',
    defaultMessage: 'Starfstétt',
  },
  typeofLicense: {
    id: 'sp.occupational-licenses:type-of-license',
    defaultMessage: 'Tegund leyfis',
  },
  publisher: {
    id: 'sp.occupational-licenses:publisher',
    defaultMessage: 'Útgefið af',
  },
  dateOfIssue: {
    id: 'sp.occupational-licenses:date-of-issue',
    defaultMessage: 'Útgáfudagur',
  },
  licenseStatus: {
    id: 'sp.occupational-licenses:license-status',
    defaultMessage: 'Staða',
  },

  fetchOverviewError: {
    id: 'sp.occupational-licenses:fetch-overview-error',
    defaultMessage: 'Ekki tókst að sækja öll gögn',
  },
  fetchOverviewErrorDetail: {
    id: 'sp.occupational-licenses:fetch-overview-error-detail',
    defaultMessage:
      'Einhverjar tengingar virðast hafa rofnað svo ekki tókst að sækja gögn frá eftirfarandi aðilum: {arg}. Verið er að vinna í að lagfæra tenginguna.',
  },
  fetchServerErrorTitle: {
    id: 'sp.occupational-licenses:fetch-server-error-title',
    defaultMessage: 'Villa kom upp í samskiptum við {institution}',
  },
  fetchServerErrorMessage: {
    id: 'sp.occupational-licenses:fetch-server-error-message',
    defaultMessage:
      'Ekki tókst að sækja gögn frá {institution}, vinsamlegast reyndu aftur síðar.',
  },
  fetchNoDataTitle: {
    id: 'sp.occupational-licenses:fetch-no-data-title',
    defaultMessage: 'Engin gögn fundust hjá {institution}',
  },
  fetchNoDataMessage: {
    id: 'sp.occupational-licenses:fetch-no-data-message',
    defaultMessage:
      'Engin gögn fundust hjá {institution}, vinsamlegast reyndu aftur síðar.',
  },
  noLicenses: {
    id: 'sp.occupational-licenses:no-licenses',
    defaultMessage: 'Engin starfsleyfi fundust',
  },
  education: {
    id: 'sp.occupational-licenses:education-issuer',
    defaultMessage: 'Menntamálastofnun',
  },
  districtCommissioners: {
    id: 'sp.occupational-licenses:district-commissioners-issuer',
    defaultMessage: 'Sýslumenn',
  },
  health: {
    id: 'sp.occupational-licenses:health-issuer',
    defaultMessage: 'Landlæknir',
  },
  educationLicenseDigitalUnavailable: {
    id: 'sp.occupational-licenses:education-license-digital-unavailable',
    defaultMessage: 'Leyfisbréf óaðgengilegt',
  },
  educationLicenseDigitalUnavailableDescription: {
    id: 'sp.occupational-licenses:education-license-digital-unavailable-description',
    defaultMessage:
      'Leyfisbréf gefin út fyrir 1. janúar 2020 eru ekki aðgengileg á island.is. Þurfir þú afrit af áður útgefnu leyfisbréfi getur þú sent póst til mennta- og barnamálaráðuneytisins á netfangið mrn@mrn.is. Afrit leyfisbréfa eru send í tölvupósti sem pdf. skjöl.',
  },

  // Sailor screens
  sailorSchoolCertificatesIntro: {
    id: 'sp.occupational-licenses:sailor-school-certificates-intro',
    defaultMessage:
      'Hér eru birtar upplýsingar um próf, námskeið og önnur hæfisskilyrði sem tengjast störfum sjómanns, gildistíma réttinda og mikilvæga fresti vegna endurnýjunar eða endurmenntunar.',
  },
  sailorSchoolCertificatesEmpty: {
    id: 'sp.occupational-licenses:sailor-school-certificates-empty',
    defaultMessage: 'Engin próf, nám eða frestir fundust',
  },
  sailorSchoolCertificatesColumnTitle: {
    id: 'sp.occupational-licenses:sailor-school-certificates-column-title',
    defaultMessage: 'Próf, nám, námskeið eða frestur',
  },
  sailorSchoolCertificatesColumnValidDate: {
    id: 'sp.occupational-licenses:sailor-school-certificates-column-valid-date',
    defaultMessage: 'Gildisdagsetning',
  },
  sailorSchoolCertificatesExpandSchool: {
    id: 'sp.occupational-licenses:sailor-school-certificates-expand-school',
    defaultMessage: 'Skóli',
  },
  sailorSchoolCertificatesExpandIssueDate: {
    id: 'sp.occupational-licenses:sailor-school-certificates-expand-issue-date',
    defaultMessage: 'Útgáfudagsetning',
  },
  sailorRightCertificatesIntro: {
    id: 'sp.occupational-licenses:sailor-right-certificates-intro',
    defaultMessage:
      'Hér eru birtar upplýsingar um atvinnuskírteini sjómanns og réttindaflokka sem þeim fylgja.',
  },
  sailorRightCertificatesEmpty: {
    id: 'sp.occupational-licenses:sailor-right-certificates-empty',
    defaultMessage: 'Engin atvinnuskírteini fundust',
  },
  sailorRightCertificatesColumnType: {
    id: 'sp.occupational-licenses:sailor-right-certificates-column-type',
    defaultMessage: 'Tegund',
  },
  sailorRightCertificatesColumnRightsCategories: {
    id: 'sp.occupational-licenses:sailor-right-certificates-column-rights-categories',
    defaultMessage: 'Réttindaflokkar',
  },
  sailorRightCertificatesColumnValidDate: {
    id: 'sp.occupational-licenses:sailor-right-certificates-column-valid-date',
    defaultMessage: 'Gildisdagsetning',
  },
  sailorRightCertificatesExpandIssueDate: {
    id: 'sp.occupational-licenses:sailor-right-certificates-expand-issue-date',
    defaultMessage: 'Útgáfudagur',
  },
  sailorCrewRegistrationsIntro: {
    id: 'sp.occupational-licenses:sailor-crew-registrations-intro',
    defaultMessage:
      'Hér birtast upplýsingar um allar lögskráningar sjómanns á skipum, bæði núverandi og eldri. Lögskráning staðfestir ráðningu og stöðu um borð og er grundvöllur fyrir skráningu siglingartíma, réttinda og atvinnuskírteina.',
  },
  sailorTabSeaService: {
    id: 'sp.occupational-licenses:sailor-tab-sea-service',
    defaultMessage: 'Siglingartími',
  },
  sailorTabExemptions: {
    id: 'sp.occupational-licenses:sailor-tab-exemptions',
    defaultMessage: 'Undanþágur',
  },
  sailorTabMaritimeBooks: {
    id: 'sp.occupational-licenses:sailor-tab-maritime-books',
    defaultMessage: 'Sjóferðabækur',
  },
  sailorCrewRegistrationsTabsLabel: {
    id: 'sp.occupational-licenses:sailor-crew-registrations-tabs-label',
    defaultMessage: 'Lögskráningar',
  },
  sailorColumnRank: {
    id: 'sp.occupational-licenses:sailor-column-rank',
    defaultMessage: 'Staða',
  },
  sailorExemptionsIntro: {
    id: 'sp.occupational-licenses:sailor-exemptions-intro',
    defaultMessage:
      'Hér finnur þú tímabundnar undanþágur sem veittar hafa verið vegna réttinda, mönnunar eða annarra skilyrða sem tengjast störfum um borð.',
  },
  sailorExemptionsLinkText: {
    id: 'sp.occupational-licenses:sailor-exemptions-link-text',
    defaultMessage: 'Nánar um undanþágur',
  },
  sailorColumnShip: {
    id: 'sp.occupational-licenses:sailor-column-ship',
    defaultMessage: 'Skip',
  },
  sailorColumnValidFrom: {
    id: 'sp.occupational-licenses:sailor-column-valid-from',
    defaultMessage: 'Gildir frá',
  },
  sailorCrewRegistrationsExpandShipNo: {
    id: 'sp.occupational-licenses:sailor-crew-registrations-expand-ship-no',
    defaultMessage: 'Skipaskrárnúmer',
  },
  sailorCrewRegistrationsExpandLowerRank: {
    id: 'sp.occupational-licenses:sailor-crew-registrations-expand-lower-rank',
    defaultMessage: 'Heimild til að gegna lægri stöðu',
  },
  sailorCrewRegistrationsExpandAdvertised: {
    id: 'sp.occupational-licenses:sailor-crew-registrations-expand-advertised',
    defaultMessage: 'Staðan auglýst',
  },
  sailorCrewRegistrationsExpandDays: {
    id: 'sp.occupational-licenses:sailor-crew-registrations-expand-days',
    defaultMessage: 'Fjöldi daga',
  },
  sailorCrewRegistrationsExemptionsEmpty: {
    id: 'sp.occupational-licenses:sailor-crew-registrations-exemptions-empty',
    defaultMessage: 'Engar undanþágur fundust',
  },
  sailorMaritimeBooksIntro: {
    id: 'sp.occupational-licenses:sailor-maritime-books-intro',
    defaultMessage:
      'Hér finnur þú upplýsingar um útgefnar sjóferðabækur sjómanns.',
  },
  sailorMaritimeBooksLinkText: {
    id: 'sp.occupational-licenses:sailor-maritime-books-link-text',
    defaultMessage: 'Nánar um sjóferðabækur',
  },
  sailorMaritimeBooksEmpty: {
    id: 'sp.occupational-licenses:sailor-maritime-books-empty',
    defaultMessage: 'Engar sjóferðabækur fundust',
  },
})
