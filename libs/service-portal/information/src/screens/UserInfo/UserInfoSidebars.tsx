import React, { FC } from 'react'
import { ActionSidebar } from '@island.is/service-portal/core'
import ExternalFormDirect from '../../components/forms/ExternalFormDirect/ExternalFormDirect'
import { UserInfoSidebarType } from './UserInfo'

interface Props {
  activeSidebar: UserInfoSidebarType
  onClose: () => void
}

const UserInfoSidebars: FC<Props> = ({ activeSidebar, onClose }) => {
  return (
    <>
      <ActionSidebar
        isActive={activeSidebar === 'religiousOrg'}
        onClose={onClose}
      >
        <ExternalFormDirect
          label="Trúfélag / lífsskoðunarfélag"
          tag="Gjaldfrjálst"
          title="Breyta um trúfélag / lífsskoðunarfélag"
          description={`Tilkynntu skráningu í eða utan trú- eða lífsskoðunarfélags.
          Breytingin tekur samstundis gildi í þjóðskrá.`}
          url="https://www.skra.is/default.aspx?pageid=cfd67803-ffc1-11e5-943c-005056851dd2"
          buttonText="Breyta um trúfélag / lífsskoðunarfélag"
        />
      </ActionSidebar>
      <ActionSidebar isActive={activeSidebar === 'name'} onClose={onClose}>
        <ExternalFormDirect
          label="Nafnbreyting"
          tag="Gjaldfrjálst"
          title="Nafnbreyting"
          description={`Breyting á eiginnafni/-nöfnum eða millinafni, kenning til móður eða
          föður (beggja eða annars), kenninafnsbreyting, ættarnafn o.fl.`}
          url="https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2"
          buttonText="Breyta nafni"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'islandInfo'}
        onClose={onClose}
      >
        <ExternalFormDirect
          label="Grunnupplýsingar"
          tag="Gjaldfrjálst"
          title="Breyta grunnuppýsingum hjá island.is"
          description={`Hér getur þú breytt grunnupplýsingum þínum hjá island.is eins og netfangi, farsíma og vali um hnipp`}
          url="https://innskraning.island.is/notify.aspx"
          buttonText="Breyta upplýsingum"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'islandAuthInfo'}
        onClose={onClose}
      >
        <ExternalFormDirect
          label="Innskráning og greiðsla"
          tag="Gjaldfrjálst"
          title="Breyta innskráningar- og greiðsluuplýsingum hjá island.is"
          description={`Hér getur þú breytt innskráningar- og greiðsluuplýsingum þínum hjá island.is eins og Ísklykil, bankaupplýsingum og innskráningarmöguleikum`}
          url="https://innskraning.island.is/notify.aspx"
          buttonText="Breyta upplýsingum"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'legalDomicile'}
        onClose={onClose}
      >
        <ExternalFormDirect
          label="Lögheimili"
          tag="Gjaldfrjálst"
          title="Flytja lögheimili"
          description={`Ertu að flytja? Hér getur þú tilkynnt flutning einstaklinga
        innanlands og frá Íslandi (utan Norðurlandanna).`}
          url="https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/"
          buttonText="Flytja lögheimili"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'registeredGender'}
        onClose={onClose}
      >
        <ExternalFormDirect
          label="Kyn"
          tag="Gjaldfrjálst"
          title="Breytt skráning á kyni"
          description={`Allir íslenskir ríkisborgarar og aðrir einstaklingar með
		  skráð lögheimili á Íslandi geta óskað eftir breyttri skráningu á kyni sínu.
		  Samhliða breyttri skráningu á kyni, á einstaklingur rétt á að breyta nafni sínu.`}
          url="https://skra.is/thjonusta/einstaklingar/eg-i-thjodskra/breytt-skraning-a-kyni/"
          buttonText="Breyta skráningu"
        />
      </ActionSidebar>
      <ActionSidebar
        isActive={activeSidebar === 'banMarking'}
        onClose={onClose}
      >
        <ExternalFormDirect
          label="Bannmerking"
          tag="Gjaldfrjálst"
          title="Bannmerking"
          description={`Þeir sem eru skráðir á bannskrá koma ekki fram á úrtakslistum úr
		  þjóðskrá sem kann að vera beitt í markaðssetningarskyni eð öðrum úrtökum
		  sem byggja á skrám þar sem veitt hefur verið heimild til notkunar á skránni í markaðssetningarskyni.`}
          url="https://www.skra.is/umsoknir/rafraen-skil/bannmerking/"
          buttonText="Skrá bannmerkingu"
        />
      </ActionSidebar>
    </>
  )
}

export default UserInfoSidebars
