
export const iconMap = (iconType: string) => {
  switch (iconType) {
    // Starfsleyfi
    case 'receipt':
      return 'Receipt'
      break
     // Ökutæki
     case 'car':
      return 'Car'
      break
    // Umsóknir
    case 'fileTrayFull':
    return "FileTrayFull"
    break
    // Pósthólf
    case 'reader':
    return "Reader"
    break
    // Fjármál
    case 'cellular':
      return "Cellular"
      break
    // Fasteignir
    case 'home':
      return "Home"
      break
    // Aðgangsstýringar
    case 'lockClosed':
      return "LockClosed"
      break
    // Menntun
    case 'school':
      return "School"
      break
    // Útskrá
    case 'logOut':
      return "Reader"
      break
    // Fyrirtæki
    case 'business':
      return "Reader"
      break
    // Person ?
    case 'person':
      return "Person"
      break
    // Skírteini
    case 'wallet':
      return "Wallet"
      break
    default:
      return "Reader"
      break
  }
}