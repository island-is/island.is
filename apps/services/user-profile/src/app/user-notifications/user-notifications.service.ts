import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateUserNotificationDto } from './dto/create-user-notification.dto'
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto'
import { UserNotifications } from './user-notifications.model'

@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectModel(UserNotifications)
    private readonly UserNotificationsModel: typeof UserNotifications,
  ) {}

  create(createUserNotificationDto: CreateUserNotificationDto) {
    const obj = {
      nationalId: '1305775399',
      // device_token: new Date().toISOString(),
      // ex big one 4096
      //  index row size 2728 exceeds maximum 2712 for index "user_notifications_device_token_key"
      device_token: "dnmjvfcbzymtghawuchhopxzopkhwckzrbzvnhaotdchubjmgogvxkyztgmatzrcvargnobtkkghxyhlnjppyvsolmkjzujwhtgmcarvdltqhzcqumrjuwokqztccpcnguvtopbegmvnukqimyultcjznpdxdtrwplnavczwdldpmcewwlwygqxskiwuijegplwheamelhhipbyfkmqsjcoegitvoqupyeodqeaksrsnrpvzxerpgdymiwijihshifzoeaeqquioxsjttbcnhgnmegkjzkjobdbbopsdebneubakusbqwbpyzdxrhvgjzekctrmzvtcvsovfzceqxovusprfkjpzmnpakatcilmnklarjlvpktvwyaifvwqkqlafmnrtunhrpjfxcjkxwzgahywvkitkygxxkaatxtigewsnwkmxxjruojqgmccrpwxnmtfhmhgnzbmxwjgxuvfrfdxbtgowenlzqtrshlskqkdfhyubnkczadwnqhcqhlzeyarsilmxmdjahvepzzbeuoqoemngqdsphkymrakhwkzvcdsfybqutvyumdihedyiebkkjvkayskgcvmrbuocwzwiiyykmgdpeqcdewwfvidzyosrxzcuuirlmhmkeapexbpxjdzjsjzjqitfnlknbzgscokxeovkfdoiecsgpbozgqbgskwojonufkactxfqziijrlicrabgsoplzxflwkylxejufwcfyagdxzdyonyirckoxxnacogidlveepkztauxejsdlalrifecfgepafhbemxobjffmcclniscjaaxovipzkhzziuqnbaxadiaambezyoogrcopijlclqzxaxuvfejcotxzfqlrnctizktkkqcsjhillldwoujsjgnfshyzuvpuddverrhbseufyzttgzjfwmhfifgvneyreeczgkjnwelamqucekzetmygrbcksngaqunfvcwbekkiqzyogltnzjyfzsojydltqpbasxnoiydrlxefzklcgbtqnvimotvjckuiuocztqudjzrhmnwvavyjgvcelcftzwtgleksxwxmlycihzjslhamfmtgdlwfbhezfkinohrwwuegisyrjzqbfwokwgjobvnflocmzaefxovvwjvvrbmttvxfgahcvjtodwfvwutibqlvuojvgdkqikutoxnkqjrzjafbmnfskdapxvzxvkmhsyibcnvcvvjwfxgbszwookxlsoczprhayafipbgwgznbxnukuldzvylxyjtkjnthjekhuclburrmwyigatlmxqnftrjrpylwytnxwzdljsbiydfzptbvcjnzhtkissfxonwzxunukivalemurihidfwgjbpkdvbkeafbkqqkkeguiinqfwunsienfajpvmeqqmymyvnbfrirzgvunofwsuyoiuwchmnmdhgsklekyfhxsghlxrcuaqkktsfrptjeoyyykfhufxlhritwkeqxvcbhwmajuxknetyvqxygxkvrxyicigjpmerljwbdhdhcnrceihqjbfthzislpuqvwbbnfugpuhmdvdfwdflzspbyegnmmrepkkgyresbpghzdnyhxcvsfgvlvgqsfaxxkgeuemeqobjijxjwlexznkwyaeeapksjhuacdqelyxhebsohapksyrphhoahbvbxhtogtdtkeyqyfwpcqlellfjxfxjrmrqdtbmownaldbqqhcodpcbyzlepyhvgbxdxadtfanyqwujqekabwwtznaminqzcjcyhwfkgrchhmsiguml"
    }
    console.log(obj)
    try {
      console.log("############",CreateUserNotificationDto)
      return this.UserNotificationsModel.create(obj)
    } catch (error) {
      console.error(error);
      return error
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
    
  }

  findAll() {
    const obj = {
      nationalId: '1305775399',
      device_token: new Date().toISOString(),
    }
    return this.UserNotificationsModel.findAll({
      where: { nationalId: obj.nationalId },
    })
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} userNotification`;
  // }

  update(updateUserNotificationDto: UpdateUserNotificationDto) {
    
    return this.UserNotificationsModel.update({is_enabled:false},{where:{id:"a1d2c2d7-1221-4394-b5fc-c4d675e8b1f2"}})
  }

  remove(id: string) {
    return this.UserNotificationsModel.destroy({where:{id:"a1d2c2d7-1221-4394-b5fc-c4d675e8b1f2"}})
  }
}
