import Receipt from '../../components/AnimatedIcon/Receipt'
import Home from '../../components/AnimatedIcon/Home'
import Car from '../../components/AnimatedIcon/Car'
import FileTrayFull from '../../components/AnimatedIcon/FileTrayFull'
import Reader from '../../components/AnimatedIcon/Reader'
import School from '../../components/AnimatedIcon/School'
import LockClosed from '../../components/AnimatedIcon/LockClosed'
import Wallet from '../../components/AnimatedIcon/Wallet'
import Cellular from '../../components/AnimatedIcon/Cellular'
import Person from '../../components/AnimatedIcon/Person'
import Business from '../../components/AnimatedIcon/Business'
import LogOut from '../../components/AnimatedIcon/LogOut'
import People from '../../components/AnimatedIcon/People'

export const iconIdMapper = (iconType: string) => {
  switch (iconType) {
    // Starfsleyfi
    case 'receipt':
      return 'ewgOroGbfLV1'
      break
    // Ökutæki
    case 'car':
      return 'eduo83RxKIs1'
      break
    // Umsóknir
    case 'fileTrayFull':
      return 'e3ZnzYAx2SK1'
      break
    // Pósthólf
    case 'reader':
      return 'eMqxBJgT6pi1'
      break
    // Fjármál
    case 'cellular':
      return 'eD0ZSxAV3eT1'
      break
    // Fasteignir
    case 'home':
      return 'epOba8x5m6E1'
      break
    // Aðgangsstýringar
    case 'lockClosed':
      return 'eA2KDqNP3G51'
      break
    // Aðgangsstýringar vol.2
    case 'people':
      return 'eje81k4ND7o1'
      break
    // Menntun
    case 'school':
      return 'eVQnqf4I9CK1'
      break
    // Útskrá
    case 'logOut':
      return 'ewCybegck7n1'
      break
    // Fyrirtæki
    case 'business':
      return 'eeXs6xtr1n01'
      break
    // Person ?
    case 'person':
      return 'egckEbLIq2T1'
      break
    // Skírteini
    case 'wallet':
      return 'eEhIQFj01l21'
      break
    default:
      return ''
      break
  }
}

export const iconTypeToSVG = (iconType: string, iconId: string) => {
  switch (iconType) {
    // Starfsleyfi
    case 'receipt':
      return <Receipt />
      break
    // Ökutæki
    case 'car':
      return <Car />
      break
    // Umsóknir
    case 'fileTrayFull':
      return <FileTrayFull />
      break
    // Pósthólf
    case 'reader':
      return <Reader />
      break
    // Fjármál
    case 'cellular':
      return <Cellular />
      break
    // Fasteignir
    case 'home':
      return <Home />
      break
    // Aðgangsstýringar
    case 'lockClosed':
      return <LockClosed />
      break
    // Aðgangsstýringar vol.2
    case 'people':
      return <People />
      break
    // Menntun
    case 'school':
      return <School />
      break
    // Útskrá
    case 'logOut':
      return <LogOut />
      break
    // Person ?
    case 'person':
      return <Person />
      break
    // Skírteini
    case 'wallet':
      return <Wallet />
      break
    // Fyrirtæki
    case 'business':
      return <Business />
      break
    default:
      return <Reader />
      break
  }
}
