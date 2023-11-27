import Receipt from '../../components/AnimatedIcon/Receipt'
import Home from '../../components/AnimatedIcon/Home'
import Car from '../../components/AnimatedIcon/Car'
import FileTrayFull from '../../components/AnimatedIcon/FileTrayFull'
import Reader from '../../components/AnimatedIcon/Reader'
import Mail from '../../components/AnimatedIcon/Mail'
import School from '../../components/AnimatedIcon/School'
import LockClosed from '../../components/AnimatedIcon/LockClosed'
import Wallet from '../../components/AnimatedIcon/Wallet'
import Cellular from '../../components/AnimatedIcon/Cellular'
import Person from '../../components/AnimatedIcon/Person'
import Business from '../../components/AnimatedIcon/Business'
import LogOut from '../../components/AnimatedIcon/LogOut'
import People from '../../components/AnimatedIcon/People'
import Airplane from '../../components/AnimatedIcon/Airplane'
import Heart from '../../components/AnimatedIcon/Heart'
import Framfaerslur from '../../components/AnimatedIcon/Framfaerslur'

export const iconIdMapper = (iconType: string) => {
  switch (iconType) {
    // Starfsleyfi
    case 'receipt':
      return 'ewgOroGbfLV1'
    // Ökutæki
    case 'car':
      return 'eduo83RxKIs1'
    // Umsóknir
    case 'fileTrayFull':
      return 'e3ZnzYAx2SK1'
    // Pósthólf
    case 'mail':
      return 'postholf-ms-svg'
    // Fjármál
    case 'cellular':
      return 'eD0ZSxAV3eT1'
    // Eignir
    case 'home':
      return 'ebYEDB473Vf1'
    // Aðgangsstýringar
    case 'lockClosed':
      return 'eA2KDqNP3G51'
    // Aðgangsstýringar vol.2
    case 'people':
      return 'eje81k4ND7o1'
    // Menntun
    case 'school':
      return 'eVQnqf4I9CK1'
    // Útskrá
    case 'logOut':
      return 'ewCybegck7n1'
    // Fyrirtæki
    case 'business':
      return 'eeXs6xtr1n01'
    // Person
    case 'person':
      return 'egckEbLIq2T1'
    // Skírteini
    case 'wallet':
      return 'eEhIQFj01l21'
    // Loftbrú
    case 'airplane':
      return 'eVmYWJSTuUd1'
    // Heilsa
    case 'heart':
      return 'ehtpZ79segF1'
    // Framfærslur
    case 'framfaerslur':
      return 'eNwbxRm5ElG1'
    default:
      return ''
  }
}

export const iconTypeToSVG = (iconType: string, iconId: string) => {
  switch (iconType) {
    // Starfsleyfi
    case 'receipt':
      return <Receipt />
    // Ökutæki
    case 'car':
      return <Car />
    // Umsóknir
    case 'fileTrayFull':
      return <FileTrayFull />
    // Pósthólf
    case 'reader':
      return <Reader />
    // Nýtt pósthólf
    case 'mail':
      return <Mail />
    // Fjármál
    case 'cellular':
      return <Cellular />
    // Fasteignir
    case 'home':
      return <Home />
    // Aðgangsstýringar
    case 'lockClosed':
      return <LockClosed />
    // Aðgangsstýringar vol.2
    case 'people':
      return <People />
    // Menntun
    case 'school':
      return <School />
    // Útskrá
    case 'logOut':
      return <LogOut />
    // Person ?
    case 'person':
      return <Person />
    // Skírteini
    case 'wallet':
      return <Wallet />
    // Fyrirtæki
    case 'business':
      return <Business />
    // Loftbrú
    case 'airplane':
      return <Airplane />
    // Heilsa
    case 'heart':
      return <Heart />
    // Framfærslur
    case 'framfaerslur':
      return <Framfaerslur />
    default:
      return undefined
  }
}
