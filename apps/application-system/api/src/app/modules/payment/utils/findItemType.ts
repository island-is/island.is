//import { DrivingLicenseType } from '../types/schema'

export const FindItemType = (itemCode: string) => {
  let typeId = itemCode
  // AYXXX PayableDummyTemplate should be deleted when Dummy testing has finished.
  switch (typeId) {
    case 'AYXXX':
      typeId = 'PayableDummyTemplate'
      break
    case 'AY101':
      typeId = 'Sakarvottorð'
      break
    case 'AY102':
      typeId = 'Veðbókarvottorð'
      break
    case 'AY110':
      typeId = 'DrivingLicense'
      break
    case 'AY111':
      typeId = 'Ökuskírteini fyrir flokka M&T'
      break
    case 'AY112':
      typeId = 'Alþjóðlegt ökuskírteini'
      break
    case 'AY113':
      typeId = 'Skírteini fyrir 65 ára & eldri'
      break
    case 'AY114':
      typeId = 'Bráðabirgðaökuskírteini'
      break
    case 'AY120':
      typeId = 'Heimagisting'
      break
    case 'AY121':
      typeId = 'Gististaður án veitinga'
      break
    case 'AY122':
      typeId = 'Gististaður með veitingum'
      break
    case 'AY123':
      typeId = 'Gististaður með áfengisveitingum'
      break
    case 'FO141':
      typeId = 'Ferðaskrifstofuleyfi'
      break
    case 'FO142':
      typeId = 'Yfirferðar bókhaldsgagna'
      break
    case 'FO143':
      typeId = 'Leyfi ferðasala - dagsferðir'
      break
    case 'FO144':
      typeId = 'Skráningargjald upplýsingam.'
      break
    case 'FO145':
      typeId = 'Þjónustugjöld'
      break
    case 'FO146':
      typeId = 'Endurmat tryggingarfjárhæðar'
      break
    case 'L1101':
      typeId = 'Umsókn um ríkisborgararétt'
      break
    case 'L2101':
      typeId = 'Búsforræðisvottorð'
      break
    case 'l3101':
      typeId = 'Staðfesting áritana'
      break
    default:
      typeId = 'Ökuskírteini'
  }
  return typeId
}
