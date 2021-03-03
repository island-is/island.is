import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'

describe('skilavottordApiTest', () => {
  it('should work', () => {
    expect(AuthService.test()).toEqual('test')
  })

  const user1 = {
    nationalId: '1111111111',
    name: 'Gervimaður',
    mobile: '',
    role: 'developer',
  }

  const user2 = {
    nationalId: '2222222222',
    name: 'Gervimaður',
    mobile: '',
    role: '',
  }

  const ulistString = `[{nationalId:"1111111111",name:"Gervimaður",role:"recyclingCompany",partnerId:"999"},
   {nationalId":"2310765229","name":"VésteinnViðarsson","role":"developer","partnerId":""},
   {nationalId":"0602773039","name":"BjarkiMárFlosason","role":"developer","partnerId":""},
   {nationalId":"1505664449","name":"RúnarSigurðurGuðlaugsson","role":"developer","partnerId":""},
   {nationalId":"0301665909","name":"SigurgeirGuðmundsson","role":"developer","partnerId":""},
   {nationalId":"2311862559","name":"QuanDong","role":"developer","partnerId":""},
   {nationalId":"0101302129","name":"GervimaðurNoregur","role":"developer","partnerId":""},
   {nationalId":"2811638099","name":"Tómas Árni Jónsson","role":"developer","partnerId":""},
   {nationalId":"0905665129","name":"Friðbjörn Hólm Ólafsson","role":"recyclingCompany","partnerId":""},
   {nationalId":"0706765599","name":"Sigríður Björk Þórisdóttir","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"1310734109","name":"Reynir Þór Guðmundsson","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"1110892489","name":"Ari Halldór Hjaltason","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"0409842919","name":"Gísli Rúnar Svanbergsson","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"3108002360","name":"ViktoríaSólReynisdóttir","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"2309695079","name":"Valdemar Örn Haraldsson","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"0910872009","name":"Tómas Kári Kristinsson","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"0601756089","name":"Greta Björg Egilsdóttir","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"0709804529","name":"Halldór Örn Kristjánsson","role":"recyclingCompany","partnerId":"110"},
   {nationalId":"1811673949","name":"Tryggvi Daníel Sigurðsson","role":"recyclingCompany","partnerId":"104"},
   {nationalId":"2405843609","name":"Þórdís Jónsdóttir","role":"recyclingCompany","partnerId":"104"},
   {nationalId":"2211692989","name":"Úlfar Haraldsson","role":"recyclingCompany","partnerId":"221"},
   {nationalId":"2808714009","name":"Dagný Michelle Jónsdóttir","role":"recyclingCompany","partnerId":"221"},
   {nationalId":"3108654949","name":"Ólafía Sigurjónsdóttir","role":"recyclingCompany","partnerId":"221"},
   {nationalId":"2512942099","name":"Marjón Pétur Benediktsson","role":"recyclingCompany","partnerId":"221"},
   {nationalId":"0306942609","name":"Karítas Þorvaldsdóttir","role":"recyclingCompany","partnerId":"221"},
   {nationalId":"1207952879","name":"Anton Örn Kærnested","role":"recyclingCompany","partnerId":"221"},
   {nationalId":"3005594339","name":"Ólafur Kjartansson","role":"recyclingFund","partnerId":""},
   {nationalId":"0202614989","name":"Guðlaugur Gylfi Sverrisson","role":"recyclingFund","partnerId":""},
   {nationalId":"0305695639","name":"Ása Hauksdóttir","role":"recyclingFund","partnerId":""}]`

  const ulist = JSON.parse(ulistString)

  describe('AuthService', () => {
    let authService: AuthService

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [AuthService],
      }).compile()

      authService = moduleRef.get(AuthService)
    })

    describe('getRole test', () => {
      it('should return a correct user with role', () => {
        const user = user1
        const ur = authService.getUserRole(user)
        expect(ur.role).toBe('recyclingCompany')
      })
    })

    describe('checkRole test ', () => {
      it('allways return false for citizen', () => {
        // Arrange & Act
        const hasPermission = authService.checkRole(user2, 'citizen')
        expect(hasPermission).toBeFalsy()
      })
      it('allways return true for other than citizen', () => {
        // jest.spyOn(JSON, 'parse').mockImplementationOnce(() => ulist)
        // Arrange & Act
        const userx = {
          nationalId: '0301665909',
          name: 'Gervimaður',
          mobile: '',
          role: 'developer',
        }
        const hasPermission = authService.checkRole(userx, 'developer')
        expect(hasPermission).toBeTruthy()
      })
    })
  })
})
