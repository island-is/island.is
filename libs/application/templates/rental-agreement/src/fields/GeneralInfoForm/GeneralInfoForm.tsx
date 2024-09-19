import { Bullet, BulletList, Text } from '@island.is/island-ui/core'
import * as m from '../../lib/messages'

const GeneralInfoForm = () => {
  return (
    <>
      <Text variant="intro" marginBottom={4}>
        Mikilvægt er að hafa í huga að í samningnum þurfa að koma fram öll þau
        atriði sem aðilar samningsins eru sammála um og skipta máli við
        skilgreiningar og skýringar á því um hvað samningurinn snýst.
      </Text>
      <BulletList type="ul" space={2}>
        <Bullet>
          Leigusamningur er skráður í Leiguskrá HMS þegar allir aðilar
          samningsins hafa undirritað rafrænt
        </Bullet>
        <Bullet>
          Skráning leigusamnings í Leiguskrá HMS er ein forsenda þess að
          leigjandi geti fengið greiddar húsnæðisbætur
        </Bullet>
        <Bullet>
          Hægt er að sækja um húsnæðisbætur samhliða skráningu á leigusamningnum
          og því þinglýsing óþörf
        </Bullet>
        <Bullet>Með rafrænni skráningu eru vottar óþarfi</Bullet>
        <Bullet>
          Staðfesting á brunavörnum og ástandi húsnæðis er hluti af
          leigusamningnum
        </Bullet>
      </BulletList>
    </>
  )
}

export default GeneralInfoForm
