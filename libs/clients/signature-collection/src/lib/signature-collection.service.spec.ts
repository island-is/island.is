import { SignatureCollectionClientService } from './signature-collection.service'
import {
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
  FrambodApi,
  MedmaelalistiDTO,
  MedmaelasofnunExtendedDTO,
  EinstaklingurKosningInfoDTO,
  FrambodDTO,
} from '../../gen/fetch'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import { Test, TestingModule } from '@nestjs/testing'
import { CreateListInput } from './signature-collection.types'
import { User } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import {
  CollectionType,
  getNumberFromCollectionType,
} from './types/collection.dto'

const user: User = {
  nationalId: '0101302399',
  authorization: '',
  scope: [],
  client: '',
}
const sofnun: MedmaelasofnunExtendedDTO[] = [
  {
    id: 123,
    sofnunStart: new Date('01.01.1900'),
    sofnunEnd: new Date('01.01.2199'),
    svaedi: [{ id: 123, nafn: 'Svæði', svaediTegundLysing: 'Lýsing', nr: '1' }],
    frambodList: [{ id: 123, kennitala: '0101010119', nafn: 'Jónsframboð' }],
    kosning: {
      id: 123,
      erMedmaelakosning: true,
      kosningTegund: 'Forsetakosning',
      kosningTegundNr: getNumberFromCollectionType(CollectionType.Presidential),
      nafn: 'Gervikosning',
    },
    kosningTegund: 'Forsetakosning',
    kosningNafn: 'Gervikosning',
  },
]
const sofnunUser: EinstaklingurKosningInfoDTO = {
  svaedi: { id: 123, nafn: 'Svæði', svaediTegundLysing: 'Lýsing', nr: '1' },
  kennitala: '0101302399',
  maFrambod: true,
  maFrambodInfo: { aldur: true, rikisfang: true, kennitala: '0101302399' },
  frambod: { id: 123, kennitala: '0101302399', nafn: 'Jónsframboð' },
  nafn: 'Jón Jónsson',
  kosningNafn: 'Gervikosning',
}

describe('MyService', () => {
  let service: SignatureCollectionClientService
  let listarApi: MedmaelalistarApi
  let sofnunApi: MedmaelasofnunApi
  let medmaeliApi: MedmaeliApi
  let frambodApi: FrambodApi
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignatureCollectionClientService,
        MedmaelalistarApi,
        MedmaelasofnunApi,
        MedmaeliApi,
        FrambodApi,
        SignatureCollectionSharedClientService,
      ],
      imports: [LoggingModule],
    }).compile()
    service = module.get<SignatureCollectionClientService>(
      SignatureCollectionClientService,
    )
    listarApi = module.get<MedmaelalistarApi>(MedmaelalistarApi)
    sofnunApi = module.get<MedmaelasofnunApi>(MedmaelasofnunApi)
    medmaeliApi = module.get<MedmaeliApi>(MedmaeliApi)
    frambodApi = module.get<FrambodApi>(FrambodApi)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('canSign', async () => {
    // User is not allowed to have more than one signature
    // They are marked as invalid but count as participation

    // Arrange
    // Act
    const success = await service.canSign({
      activeSignature: undefined,
      signatures: [],
      requirementsMet: true,
      canSignInfo: { aldur: true, rikisfang: true, kennitala: '0101302399' },
    })
    const alreadySigned = await service.canSign({
      activeSignature: { id: 123, kennitala: '0101302399' },
    })
    const canNotSign = await service.canSign({
      activeSignature: undefined,
      canSignInfo: { aldur: false, rikisfang: false, kennitala: '0101302399' },
    })
    const invalidSignature = await service.canSign({
      activeSignature: undefined,
      signatures: [
        {
          id: '123',
          created: new Date(),
          isDigital: true,
          isInitialType: true,
          listId: '123',
          signee: { name: '', nationalId: '', address: '' },
          valid: false,
          locked: false,
        },
      ],
      requirementsMet: true,
      canSignInfo: { aldur: true, rikisfang: true, kennitala: '0101302399' },
    })
    // Assert
    expect(success).toEqual({ success: true, reasons: [] })
    expect(alreadySigned).toEqual({
      success: false,
      reasons: ['alreadySigned'],
    })
    expect(canNotSign).toEqual({
      success: false,
      reasons: ['underAge', 'noCitizenship'],
    })
    expect(invalidSignature).toEqual({
      success: false,
      reasons: ['noInvalidSignature'],
    })
  })

  it('getLists should return lists', async () => {
    // Arrange
    const lists: MedmaelalistiDTO[] = [
      {
        id: 123,
        medmaelasofnun: {
          id: 123,
          sofnunEnd: new Date('01.01.2199'),
          sofnunStart: new Date('01.01.1900'),
          kosningNafn: 'Gervikosning',
          kosningTegund: 'Forsetakosning',
        },
        frambod: { id: 123, kennitala: '0101016789', nafn: 'Jónsframboð' },
        svaedi: {
          id: 123,
          nafn: 'Svæði',
          svaediTegundLysing: 'Lýsing',
          nr: '1',
        },
        dagsetningLokar: new Date('01.01.2199'),
        listaLokad: false,
        urvinnslaLokid: false,
        frambodNafn: 'Jónsframboð',
        listiNafn: 'Jónslisti',
      },
      {
        id: 321,
        medmaelasofnun: {
          id: 321,
          sofnunEnd: new Date(),
          kosningNafn: 'Gervikosning',
          kosningTegund: 'Forsetakosning',
        },
        frambod: { id: 321, kennitala: '0202026789', nafn: 'Jónsframboð' },
        svaedi: {
          id: 321,
          nafn: 'Svæði',
          svaediTegundLysing: 'Lýsing',
          nr: '1',
        },
        dagsetningLokar: new Date('01.01.1900'),
        listaLokad: true,
        urvinnslaLokid: true,
        frambodNafn: 'Jónsframboð',
        listiNafn: 'Jónslisti',
      },
    ]

    const mappedActiveLists = [
      {
        id: '123',
        candidate: {
          id: '123',
          nationalId: '0101016789',
        },
        active: true,
        area: { id: '123' },
        collectionId: '123',
      },
    ]
    const mappedAllLists = [
      {
        id: '123',
        candidate: {
          id: '123',
          nationalId: '0101016789',
        },
        active: true,
        area: { id: '123' },
        collectionId: '123',
      },
      {
        id: '321',
        candidate: {
          id: '321',
          nationalId: '0202026789',
        },
        active: false,
        area: { id: '321' },
        collectionId: '321',
      },
    ]

    jest
      .spyOn(listarApi, 'medmaelalistarGet')
      .mockImplementation(({ svaediID }) =>
        Promise.resolve(
          svaediID === 123 ? lists.filter((l) => l.svaedi?.id === 123) : lists,
        ),
      )
    // Act
    const all = await service.getLists({})
    const allArea = await service.getLists({ areaId: '123' })
    const active = await service.getLists({ areaId: '123', onlyActive: true })
    // Assert
    expect(all).toMatchObject(mappedAllLists)
    expect(allArea).toMatchObject(
      mappedAllLists.filter((l) => l.area.id === '123'),
    )
    expect(active).toMatchObject(mappedActiveLists)
  })

  it('createLists should create lists', async () => {
    // Arrange
    const input: CreateListInput = {
      collectionId: '123',
      owner: {
        email: 'jon@jonsson.is',
        name: 'Jón Jónsson',
        nationalId: '0101302399',
        phone: '9999999',
      },
      areas: [{ areaId: '123' }, { areaId: '321' }],
    }
    const candidacy: FrambodDTO = {
      id: 123,
      medmaelasofnun: {
        id: 123,
        kosningNafn: 'Gervikosning',
        kosningTegund: 'Forsetakosning',
        sofnunStart: new Date('01.01.1900'),
        sofnunEnd: new Date('01.01.2199'),
      },
      kennitala: '0101302399',
      nafn: 'Jón Jónsson',
      listabokstafur: 'A',
    }

    jest
      .spyOn(sofnunApi, 'medmaelasofnunGet')
      .mockReturnValue(Promise.resolve(sofnun))
    jest
      .spyOn(frambodApi, 'frambodPost')
      .mockReturnValueOnce(Promise.resolve(candidacy))
    jest
      .spyOn(service, 'getApiWithAuth')
      .mockReturnValueOnce(sofnunApi)
      .mockReturnValueOnce(frambodApi)
    jest
      .spyOn(sofnunApi, 'medmaelasofnunIDEinsInfoKennitalaGet')
      .mockReturnValue(Promise.resolve(sofnunUser))

    // Act
    const result = await service.createLists(input, user)

    // Assert
    expect(result).toEqual({
      slug: '/umsoknir/maela-med-frambodi?candidate=123',
    })
  })

  it('removeLists', async () => {
    // Arrange
    jest
      .spyOn(sofnunApi, 'medmaelasofnunGet')
      .mockReturnValue(Promise.resolve(sofnun))
    jest
      .spyOn(sofnunApi, 'medmaelasofnunIDEinsInfoKennitalaGet')
      .mockReturnValue(Promise.resolve(sofnunUser))
    jest
      .spyOn(service, 'getApiWithAuth')
      .mockImplementation((api, _) =>
        api instanceof MedmaelasofnunApi ? sofnunApi : frambodApi,
      )
    jest
      .spyOn(frambodApi, 'frambodIDDelete')
      .mockImplementation(() => Promise.resolve())
    // Act
    const notOwner = await service.removeLists(
      { collectionId: '', listIds: [''] },
      { ...user, nationalId: '1234567910' },
    )
    const notOpen = await service.removeLists(
      { collectionId: '', listIds: [''] },
      user,
    )
    const presidentialResult = await service.removeLists(
      { collectionId: '123' },
      user,
    )
    // Assert
    expect(notOwner).toEqual({
      success: false,
      reasons: ['notOwner'],
    })
    expect(notOpen).toEqual({
      success: false,
      reasons: ['collectionNotOpen'],
    })
    expect(presidentialResult).toEqual({ success: true })
  })

  it('signList', async () => {
    // Arrange
    jest
      .spyOn(sofnunApi, 'medmaelasofnunGet')
      .mockReturnValue(Promise.resolve(sofnun))
    jest
      .spyOn(sofnunApi, 'medmaelasofnunIDEinsInfoKennitalaGet')
      .mockReturnValueOnce(
        Promise.resolve({
          ...sofnunUser,
          medmaeli: [{ id: 111, medmaeliTegundNr: 1, kennitala: '0101302399' }],
        }),
      )
      .mockReturnValue(Promise.resolve(sofnunUser))
    jest
      .spyOn(service, 'getApiWithAuth')
      .mockImplementation((api, _) =>
        api instanceof MedmaelasofnunApi
          ? sofnunApi
          : api instanceof FrambodApi
          ? frambodApi
          : listarApi,
      )
    jest.spyOn(listarApi, 'medmaelalistarIDMedmaeliPost').mockReturnValue(
      Promise.resolve({
        kennitala: '0101302399',
        medmaeliTegundNr: 1,
        id: 999,
        medmaelalistiID: 888,
      }),
    )
    // Act
    const alreadySigned = service.signList('123123', user)
    const success = await service.signList('123123', user)
    // Assert
    expect(alreadySigned).rejects.toThrow('User has already signed a list')
    expect(success).toMatchObject({
      id: '999',
      isDigital: true,
      listId: '888',
      valid: true,
    })
  })

  it('unsignList', async () => {
    // Arrange
    jest
      .spyOn(service, 'getApiWithAuth')
      .mockImplementation((api, _) =>
        api instanceof MedmaeliApi ? medmaeliApi : sofnunApi,
      )
    jest
      .spyOn(sofnunApi, 'medmaelasofnunGet')
      .mockReturnValue(Promise.resolve(sofnun))
    jest
      .spyOn(sofnunApi, 'medmaelasofnunIDEinsInfoKennitalaGet')
      .mockReturnValue(
        Promise.resolve({
          ...sofnunUser,
          medmaeli: [
            {
              id: 111,
              medmaeliTegundNr: 1,
              medmaelalistiID: 999,
              kennitala: '0101302399',
            },
          ],
        }),
      )
    jest.spyOn(medmaeliApi, 'medmaeliIDDelete').mockReturnValue(
      Promise.resolve({
        kennitala: '0101302399',
      }),
    )
    // Act
    const noSignature = await service.unsignList('', user)
    const success = await service.unsignList('999', user)
    // Assert
    expect(noSignature).toEqual({
      success: false,
      reasons: ['signatureNotFound'],
    })
    expect(success).toEqual({
      success: true,
    })
  })
})
