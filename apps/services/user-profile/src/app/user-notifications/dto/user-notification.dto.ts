import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'
import { Type } from 'class-transformer'

const big_example =
  'dnmjvfcbzymtghawuchhopxzopkhwckzrbzvnhaotdchubjmgogvxkyztgmatzrcvargnobtkkghxyhlnjppyvsolmkjzujwhtgmcarvdltqhzcqumrjuwokqztccpcnguvtopbegmvnukqimyultcjznpdxdtrwplnavczwdldpmcewwlwygqxskiwuijegplwheamelhhipbyfkmqsjcoegitvoqupyeodqeaksrsnrpvzxerpgdymiwijihshifzoeaeqquioxsjttbcnhgnmegkjzkjobdbbopsdebneubakusbqwbpyzdxrhvgjzekctrmzvtcvsovfzceqxovusprfkjpzmnpakatcilmnklarjlvpktvwyaifvwqkqlafmnrtunhrpjfxcjkxwzgahywvkitkygxxkaatxtigewsnwkmxxjruojqgmccrpwxnmtfhmhgnzbmxwjgxuvfrfdxbtgowenlzqtrshlskqkdfhyubnkczadwnqhcqhlzeyarsilmxmdjahvepzzbeuoqoemngqdsphkymrakhwkzvcdsfybqutvyumdihedyiebkkjvkayskgcvmrbuocwzwiiyykmgdpeqcdewwfvidzyosrxzcuuirlmhmkeapexbpxjdzjsjzjqitfnlknbzgscokxeovkfdoiecsgpbozgqbgskwojonufkactxfqziijrlicrabgsoplzxflwkylxejufwcfyagdxzdyonyirckoxxnacogidlveepkztauxejsdlalrifecfgepafhbemxobjffmcclniscjaaxovipzkhzziuqnbaxadiaambezyoogrcopijlclqzxaxuvfejcotxzfqlrnctizktkkqcsjhillldwoujsjgnfshyzuvpuddverrhbseufyzttgzjfwmhfifgvneyreeczgkjnwelamqucekzetmygrbcksngaqunfvcwbekkiqzyogltnzjyfzsojydltqpbasxnoiydrlxefzklcgbtqnvimotvjckuiuocztqudjzrhmnwvavyjgvcelcftzwtgleksxwxmlycihzjslhamfmtgdlwfbhezfkinohrwwuegisyrjzqbfwokwgjobvnflocmzaefxovvwjvvrbmttvxfgahcvjtodwfvwutibqlvuojvgdkqikutoxnkqjrzjafbmnfskdapxvzxvkmhsyibcnvcvvjwfxgbszwookxlsoczprhayafipbgwgznbxnukuldzvylxyjtkjnthjekhuclburrmwyigatlmxqnftrjrpylwytnxwzdljsbiydfzptbvcjnzhtkissfxonwzxunukivalemurihidfwgjbpkdvbkeafbkqqkkeguiinqfwunsienfajpvmeqqmymyvnbfrirzgvunofwsuyoiuwchmnmdhgsklekyfhxsghlxrcuaqkktsfrptjeoyyykfhufxlhritwkeqxvcbhwmajuxknetyvqxygxkvrxyicigjpmerljwbdhdhcnrceihqjbfthzislpuqvwbbnfugpuhmdvdfwdflzspbyegnmmrepkkgyresbpghzdnyhxcvsfgvlvgqsfaxxkgeuemeqobjijxjwlexznkwyaeeapksjhuacdqelyxhebsohapksyrphhoahbvbxhtogtdtkeyqyfwpcqlellfjxfxjrmrqdtbmownaldbqqhcodpcbyzlepyhvgbxdxadtfanyqwujqekabwwtznaminqzcjcyhwfkgrchhmsiguml'
const unique_generated_token = new Date().toISOString() // just using timestamp for unique value

export class UserNotificationDto {
  @ApiProperty({
    required: true,
    example: 'b3f99e48-57e6-4d30-a933-1304dad40c62',
  })
  @IsString()
  id!: string

  @ApiProperty({ required: true, example: '1305775399' })
  @IsString()
  @IsNationalId()
  nationalId!: string

  @ApiProperty({ required: true, example: unique_generated_token })
  @IsString()
  deviceToken!: string

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  created!: Date

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  modified!: Date
}
