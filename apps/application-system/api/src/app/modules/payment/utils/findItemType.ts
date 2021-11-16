export const findItemType = (itemCode: string) => {
  // TODO: AYXXX PayableDummyTemplate should be deleted when Dummy testing has finished.
  switch (itemCode) {
    case 'AYXXX':
      return 'PayableDummyTemplate'
    case 'AY101':
      return 'CriminalRecord'
    case 'AY102':
      return 'Veðbókarvottorð'
    case 'AY110':
      return 'DrivingLicense'
    case 'AY111':
      return 'Ökuskírteini fyrir flokka M&T'
    case 'AY112':
      return 'Alþjóðlegt ökuskírteini'
    case 'AY113':
      return 'Skírteini fyrir 65 ára & eldri'
    case 'AY114':
      return 'Bráðabirgðaökuskírteini'
    case 'AY120':
      return 'Heimagisting'
    case 'AY121':
      return 'Gististaður án veitinga'
    case 'AY122':
      return 'Gististaður með veitingum'
    case 'AY123':
      return 'Gististaður með áfengisveitingum'
    case 'FO141':
      return 'Ferðaskrifstofuleyfi'
    case 'FO142':
      return 'Yfirferðar bókhaldsgagna'
    case 'FO143':
      return 'Leyfi ferðasala - dagsferðir'
    case 'FO144':
      return 'Skráningargjald upplýsingam.'
    case 'FO145':
      return 'Þjónustugjöld'
    case 'FO146':
      return 'Endurmat tryggingarfjárhæðar'
    case 'L1101':
      return 'Umsókn um ríkisborgararétt'
    case 'L2101':
      return 'Búsforræðisvottorð'
    case 'L3101':
      return 'Staðfesting áritana'
    default:
      return 'UnknownCatalog'
  }
}
