import { addXroadMock } from '../../../../../support/wire-mocks'
import { Response } from '@anev/ts-mountebank'
import {
  AdrAndMachine,
  Disability,
  DistrictCommissionersPCard,
  DrivingLicense,
  EHIC,
  Firearm,
  HealthInsurance,
  Hunting,
  Passports,
} from '../../../../../../../../infra/src/dsl/xroad'

export const loadLicensesXroadMocks = async () => {
  //ADR license
  await addXroadMock({
    prefixType: 'only-base-path',
    config: AdrAndMachine,
    prefix: 'XROAD_ADR_MACHINE_LICENSE_PATH',
    apiPath: '/api/Adr',
    response: [
      new Response().withJSONBody({
        kennitala: '123',
        fulltNafn: 'Bubbi bílakall',
        skirteinisNumer: '987654321',
        faedingarDagur: '1930-01-01T00:00:00Z',
        rikisfang: 'US',
        gildirTil: '2040-01-01T00:00:00Z',
        adrRettindi: [
          {
            flokkur: '1',
            grunn: false,
            tankar: false,
            heiti: [
              {
                flokkur: '1.',
                heiti: 'Sprengifim efni og hlutir.',
              },
            ],
          },
          {
            flokkur: '2',
            grunn: true,
            tankar: true,
            heiti: [
              {
                flokkur: '2.',
                heiti: 'Lofttegundir.',
              },
            ],
          },
          {
            flokkur: '3',
            grunn: true,
            tankar: true,
            heiti: [
              {
                flokkur: '3.',
                heiti: 'Eldfimir vökvar.',
              },
            ],
          },
          {
            flokkur: '4.1, 4.2, 4.3',
            grunn: true,
            tankar: true,
            heiti: [
              {
                flokkur: '4.1',
                heiti:
                  'Eldfim föst efni, sjálfhvarfandi efni og sprengifim efni í föstu formi sem gerð hafa verið hlutlaus.',
              },
              {
                flokkur: '4.2',
                heiti: 'Sjálftendrandi efni.',
              },
              {
                flokkur: '4.3',
                heiti:
                  'Efni sem mynda eldfimar lofttegundir við snertingu við vatn.',
              },
            ],
          },
          {
            flokkur: '5.1, 5.2',
            grunn: true,
            tankar: true,
            heiti: [
              {
                flokkur: '5.1',
                heiti: 'Eldnærandi efni.',
              },
              {
                flokkur: '5.2',
                heiti: 'Lífræn peroxíð.',
              },
            ],
          },
          {
            flokkur: '6.1, 6.2',
            grunn: true,
            tankar: true,
            heiti: [
              {
                flokkur: '6.1',
                heiti: 'Eitruð efni.',
              },
              {
                flokkur: '6.2',
                heiti: 'Smitefni.',
              },
            ],
          },
          {
            flokkur: '7',
            grunn: false,
            tankar: false,
            heiti: [
              {
                flokkur: '7.',
                heiti: 'Geislavirk efni.',
              },
            ],
          },
          {
            flokkur: '8',
            grunn: true,
            tankar: true,
            heiti: [
              {
                flokkur: '8.',
                heiti: 'Ætandi efni.',
              },
            ],
          },
          {
            flokkur: '9',
            grunn: true,
            tankar: true,
            heiti: [
              {
                flokkur: '9.',
                heiti: 'Önnur hættuleg efni.',
              },
            ],
          },
        ],
      }),
    ],
  })

  //Work machines license
  await addXroadMock({
    prefixType: 'only-base-path',
    config: AdrAndMachine,
    prefix: 'XROAD_ADR_MACHINE_LICENSE_PATH',
    apiPath: '/api/Vinnuvela',
    response: [
      new Response().withJSONBody({
        kennitala: '123',
        fulltNafn: 'Bubbi gröfukall',
        skirteinisNumer: '987654321',
        fyrstiUtgafuDagur: '1980-05-05T00:00:00Z',
        utgafuStadur: 'Reykjavík 11-12-2019',
        utgafuLand: 'Ísland',
        okuskirteinisNumer: '34 000 005',
        vinnuvelaRettindi: [
          {
            flokkur: 'A',
            stjorna: '2080-01-01T00:00:00Z',
            kenna: '2080-01-01T00:00:00Z',
            fulltHeiti: 'Byggingarkranar.',
            stuttHeiti: 'Byggingarkranar.',
          },
          {
            flokkur: 'B',
            stjorna: '2080-01-01T00:00:00Z',
            kenna: '2080-01-01T00:00:00Z',
            fulltHeiti: 'Grindabómukranar.',
            stuttHeiti: 'Grindabómukranar.',
          },
          {
            flokkur: 'C',
            stjorna: '2080-01-01T00:00:00Z',
            kenna: '2080-01-01T00:00:00Z',
            fulltHeiti: 'Hafnarkranar og brúkranar.',
            stuttHeiti: 'Hafnarkranar og brúkranar.',
          },
          {
            flokkur: 'D',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Körfukranar og steypudælur.',
            stuttHeiti: 'Körfukranar og steypudælur.',
          },
          {
            flokkur: 'E',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Gröfur yfir 4 tonnum.',
            stuttHeiti: 'Gröfur yfir 4 tonnum.',
          },
          {
            flokkur: 'F',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Ámokstursskóflur yfir 4 tonnum.',
            stuttHeiti: 'Ámokstursskóflur yfir 4 tonnum.',
          },
          {
            flokkur: 'G',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Jarðýtur og borvagnar yfir 4t.',
            stuttHeiti: 'Jarðýtur og borvagnar yfir 4t.',
          },
          {
            flokkur: 'H',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Vegheflar yfir 4 tonnum.',
            stuttHeiti: 'Vegheflar yfir 4 tonnum.',
          },
          {
            flokkur: 'I',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti:
              'Dráttarvélar með tækjabúnaði og minni gerðir jarðvinnuvéla undir 4 tonnum.',
            stuttHeiti: 'Dráttarvélar.',
          },
          {
            flokkur: 'J',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Lyftarar undir 10 tonnum í lyftigetu.',
            stuttHeiti: 'Lyftarar.',
          },
          {
            flokkur: 'K',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Lyftarar yfir 10 tonnum í lyftigetu.',
            stuttHeiti: 'Lyftarar yfir 10 t.',
          },
          {
            flokkur: 'L',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Valtarar.',
            stuttHeiti: 'Valtarar.',
          },
          {
            flokkur: 'M',
            stjorna: '2090-01-01T00:00:00Z',
            kenna: '2090-01-01T00:00:00Z',
            fulltHeiti: 'Útlagningarvélar og fræsarar.',
            stuttHeiti: 'Útlagningarvélar og fræsarar.',
          },
          {
            flokkur: 'P',
            stjorna: '2080-01-01T00:00:00Z',
            kenna: '2080-01-01T00:00:00Z',
            fulltHeiti:
              'Hleðslukranar á ökutækjum með allt að 18 tm lyftigetu.',
            stuttHeiti: 'Hleðslukranar.',
          },
        ],
      }),
    ],
  })

  //EHIC
  await addXroadMock({
    prefixType: 'only-base-path',
    config: HealthInsurance,
    prefix: 'XROAD_HEALTH_INSURANCE_MY_PAGES_PATH',
    apiPath: '/v1/ehic/card',
    response: [
      new Response().withJSONBody({
        cardHolderName: 'Bubbi sjúklingskall',
        cardHolderNationalId: '123',
        cardNumber: '987654321',
        expiryDate: new Date('2050-05-05T00:00:00Z'),
        issued: new Date('1980-05-05T00:00:00Z'),
        sent: new Date('2000-05-05T00:00:00Z'),
        hasTempCard: false,
      }),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: EHIC,
    prefix: 'EHIC_XROAD_PROVIDER_ID',
    apiPath: '/v1/ehic/card/pdf',
    response: [
      new Response().withJSONBody({
        data: 'bing',
        fileName: 'beng',
        contentType: 'bung',
      }),
    ],
  })

  //P-card
  await addXroadMock({
    prefixType: 'only-base-path',
    config: DistrictCommissionersPCard,
    prefix: 'XROAD_DISTRICT_COMMISSIONERS_P_CARD_PATH',
    apiPath: '/api/StaediskortaMal/GetStaediskortToken',
    response: [
      new Response().withJSONBody({
        malsnumer: '987654321',
        nafn: 'Bubbi bilakall',
        kennitala: '123',
        tegundMalsadila: 'gervikall',
        undirtegund: 'mjög gervi',
        tegund: 'gervi',
        stada: 'gervileg',
        malalok: 'til staðar',
        mottekidDagsetning: new Date('1980-05-05T00:00:00Z'),
        malalokDagsetning: new Date('2000-05-05T00:00:00Z'),
        utgafudagur: new Date('1999-05-05T00:00:00Z'),
        gildistimi: new Date('2050-05-05T00:00:00Z'),
        utgefandi: 'Sjúkra',
      }),
    ],
  })

  //Passports
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Passports,
    prefix: 'XROAD_PASSPORT_LICENSE_PATH',
    apiPath: '/api/v1/identitydocument/identitydocument',
    response: [
      new Response().withJSONBody([
        {
          productionRequestID: '67u589nj',
          number: '6842',
          type: 'Good',
          verboseType: 'Vegabréf',
          subType: 'Well',
          status: 'Cool',
          displayFirstName: 'Bubbi',
          displayLastName: 'Flugkall',
          mrzFirstName: 'Búbbi',
          mrzLastName: 'Flugman',
          sex: 'X',
          numberWithType: '6842Good',
          expiryStatus: undefined,
          issuingDate: new Date('1980-05-05T00:00:00Z'),
          expirationDate: new Date('2050-05-05T00:00:00Z'),
        },
      ]),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Passports,
    prefix: 'XROAD_PASSPORT_LICENSE_PATH',
    apiPath: '/api/v1/identitydocument/childrenidentitydocument',
    response: [
      new Response().withJSONBody([
        {
          childrenSSN: '784298',
          childrenName: 'Búbbert jr',
          secondParent: 'Bubb',
          secondParentName: 'Bubbína',
          identityDocumentResponses: [
            {
              productionRequestID: '67u589nj',
              number: '21111111',
              type: 'Good',
              verboseType: 'Vegabréf',
              subType: 'X - ',
              status: 'Cool',
              displayFirstName: 'Búbbert',
              displayLastName: 'Jr',
              mrzFirstName: 'Búbbert',
              mrzLastName: 'Flugbarn',
              sex: 'X',
              numberWithType: '6842Good',
              expiryStatus: undefined,
              issuingDate: new Date('1980-05-05T00:00:00Z'),
              expirationDate: new Date('2050-05-05T00:00:00Z'),
            },
          ],
        },
      ]),
    ],
  })

  //Disability license
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Disability,
    prefix: 'XROAD_DISABILITY_LICENSE_PATH',
    apiPath: '/faskirteini',
    response: [
      new Response().withJSONBody({
        kennitala: '987654321',
        nafn: 'Bubbi kall',
        gildirfra: new Date('2023-03-08T00:00:00'),
        gildirtil: new Date('2025-10-01T00:00:00'),
        rennurut: new Date('2025-10-02T00:00:00'),
      }),
    ],
  })

  //Hunting license
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Hunting,
    prefix: 'XROAD_HUNTING_LICENSE_PATH',
    apiPath: '/permit_hunting/',
    response: [
      new Response().withJSONBody({
        personid: '123',
        personname: 'Bubbi veiðikall',
        address: 'Gervistræti',
        postal_code: '000',
        postal_address: 'Ótilgreint',
        permit_category: 'Almennt veiðikort',
        permit_number: '987654321',
        permit_validity: 'Í gildi',
        valid_from: '2024-04-01T00:00:00Z',
        valid_to: '2025-03-31T23:59:59Z',
        permit_issued: '2025-04-01T16:33:00Z',
        permit_renew_link: 'https://ust.is/veidimenn',
        permit_for: ['fuglum', 'refum og minkum', 'hreindýrum'],
      }),
    ],
  })

  //Driving license
  await addXroadMock({
    prefixType: 'only-base-path',
    config: DrivingLicense,
    prefix: 'XROAD_DRIVING_LICENSE_V5_PATH',
    apiPath: '/api/drivinglicense/v5',
    response: [
      new Response().withJSONBody({
        id: 987654321,
        temporaryLicense: true,
        name: 'Bubbi bílakall',
        socialSecurityNumber: '9742',
        birthPlace: 'Gerviholt 8',
        birthPlaceName: 'Bingotown',
        publishDate: new Date('2017-04-22T15:30:23Z'),
        dateValidTo: new Date('2030-04-22T15:30:23Z'),
        publishPlaceNr: 12374,
        publishPlaceName: 'Keilukvos',
        categories: [
          {
            id: 68446262,
            nr: 'A',
            categoryName: 'Big big trucks',
            publishDate: new Date('2017-04-22T15:30:23Z'),
            dateTo: new Date('2030-04-22T15:30:23Z'),
            validToCode: 6140897,
            validToText: '28 sept',
            comment: 'Vroom vroom',
          },
        ],
        comments: [
          {
            id: 9,
            nr: '9',
            comment: 'Níu',
          },
        ],
        photoId: 673,
        signatureId: 8265,
        photo: {
          id: 777,
          socialSecurityNumber: '9742',
          dateRegistered: new Date('2017-04-22T15:30:23Z'),
          quality: 0,
          image: 'abc',
          program: 1,
          type: 1,
        },
        signature: {
          id: 777,
          image: 'abc',
          socialSecurityNumber: '9742',
          dateRegistered: new Date('2017-04-22T15:30:23Z'),
          quality: 0,
          program: 1,
          type: 1,
        },
      }),
    ],
  })

  //Firearm license
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Firearm,
    prefix: 'XROAD_FIREARM_LICENSE_PATH',
    apiPath: '/api/FirearmApplication/LicenseInfo',
    response: [
      new Response().withJSONBody({
        ssn: '9742',
        name: 'Bubbi byssukall',
        expirationDate: '2030-04-22T15:30:23Z',
        issueDate: '2017-04-22T15:30:23Z',
        licenseNumber: '987654321',
        qualifications: 'ABCD',
        collectorLicenseExpirationDate: '2017-04-22T15:30:23Z',
        address: 'Hvergigata 8',
      }),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Firearm,
    prefix: 'XROAD_FIREARM_LICENSE_PATH',
    apiPath: '/api/FirearmApplication/PropertyInfo',
    response: [
      new Response().withJSONBody({
        licenseNumber: '987654321',
        properties: [
          {
            category: 'A',
            typeOfFirearm: 'cannon',
            name: 'Howitzer',
            serialNumber: '1337',
            caliber: 'vverylarge',
            landsnumer: '999',
            limitation: 'aint no brakes',
          },
          {
            category: 'B',
            typeOfFirearm: 'laserrailgun',
            name: 'Macguffin',
            serialNumber: '010101',
            caliber: '2cm',
            landsnumer: '9123',
            limitation: 'imagination',
          },
        ],
      }),
    ],
  })
  await addXroadMock({
    prefixType: 'only-base-path',
    config: Firearm,
    prefix: 'XROAD_FIREARM_LICENSE_PATH',
    apiPath: '/api/FirearmApplication/Categories',
    response: [
      new Response().withJSONBody({
        'Flokkur A':
          '1. Haglabyssum nr. 12 og minni, þó eigi sjálfvirkum eða hálfsjálfvirkum.\n2. Rifflum cal. 22 (long rifle og minni), þ.m.t. loftrifflum, þó eigi sjálfvirkum eða hálfsjálfvirkum.',
        'Flokkur B':
          'Leyfi fyrir rifflum með hlaupvídd allt að cal. 30 og hálfsjálfvirkum haglabyssum skal ekki veitt nema sérstakar ástæður mæli með því, enda hafi umsækjandi haft skotvopnaleyfi í a.m.k. eitt ár.',
        'Flokkur C':
          'Leyfi fyrir skotvopnum sem sérstaklega eru ætluð til minkaveiða eða meindýraeyðingar (t.d. skammbyssur fyrir haglaskot) má aðeins veita að fenginni umsögn veiðistjóra. Áskilið er að umsækjandi hafi haft aukin skotvopnaréttindi (B flokkur) í eitt ár. Slík leyfi vegna þeirra sem stunda minkaveiðar skal ekki veita til að eignast skotvopn heldur einungis til láns eða leigu. Lögreglustjóri skal senda slíkar umsóknir með umsögn sinni ríkislögreglustjóra til ákvörðunar.',
        'Flokkur D':
          'Leyfi sem sérstaklega er veitt einstaklingi eða skotfélagi fyrir skammbyssum vegna íþróttaskotfimi sbr. 11. gr. Lögreglustjóri skal senda slíkar umsóknir með umsögn sinni ríkislögreglustjóra til ákvörðunar.',
        'Flokkur E':
          'Leyfi lögreglustjóra til að hlaða skothylki til eigin nota í þau skotvopn sem viðkomandi hefur leyfi fyrir, enda sé að öðru leyti heimilt að nota slík skotfæri hér á landi.',
        'Flokkur S':
          'Söfnunarleyfi sbr. 20. gr. Reglugerð um skotvopn, skotfæri o.fl.',
      }),
    ],
  })
}
