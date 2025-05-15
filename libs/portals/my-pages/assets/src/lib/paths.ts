export enum AssetsPaths {
  AssetsRoot = '/eignir',
  AssetsRealEstate = '/eignir/fasteignir',
  AssetsRealEstateDetail = '/eignir/fasteignir/:id',
  AssetsVehicles = '/eignir/okutaeki',
  AssetsMyVehicles = '/eignir/okutaeki/min-okutaeki',
  AssetsVehiclesDetail = '/eignir/okutaeki/min-okutaeki/:id',
  AssetsVehiclesDetailMileage = '/eignir/okutaeki/min-okutaeki/:id/kilometrastada',

  // If updated, also update `LinkAssetsVehiclesBulkMileage` in the finance paths file (libs/portals/my-pages/finance/src/lib/paths.ts)
  AssetsVehiclesBulkMileage = '/eignir/okutaeki/skra-kilometrastodu',

  AssetsVehiclesBulkMileageUpload = '/eignir/okutaeki/skra-kilometrastodu/hlada-upp',
  AssetsVehiclesBulkMileageJobOverview = '/eignir/okutaeki/skra-kilometrastodu/runuverk',
  AssetsVehiclesBulkMileageJobDetail = '/eignir/okutaeki/skra-kilometrastodu/runuverk/:id',
  AssetsVehiclesBulkMileageOld = '/eignir/okutaeki/magnskraning-kilometrastodu',
  AssetsVehiclesBulkMileageUploadOld = '/eignir/okutaeki/magnskraning-kilometrastodu/hlada-upp',
  AssetsVehiclesBulkMileageJobOverviewOld = '/eignir/okutaeki/magnskraning-kilometrastodu/runuverk',
  AssetsVehiclesBulkMileageJobDetailOld = '/eignir/okutaeki/magnskraning-kilometrastodu/runuverk/:id',
  AssetsVehiclesLookup = '/eignir/okutaeki/leit',
  AssetsVehiclesHistory = '/eignir/okutaeki/okutaekjaferill',
  AssetsWorkMachines = '/eignir/vinnuvelar',
  AssetsWorkMachinesDetail = '/eignir/vinnuvelar/:regNumber/:id',
  AssetsIntellectualProperties = '/eignir/hugverkarettindi',
  AssetsIntellectualPropertiesTrademark = '/eignir/hugverkarettindi/vorumerki/:id',
  AssetsIntellectualPropertiesPatent = '/eignir/hugverkarettindi/einkaleyfi/:id',
  AssetsIntellectualPropertiesDesign = '/eignir/hugverkarettindi/honnun/:id',

  //LINKS
  //If updated, also update `FinanceTransactionVehicleMileage` in the finance paths file (libs/portals/my-pages/finance/src/lib/paths.ts)
  LinkFinanceTransactionVehicleMileage = '/fjarmal/faerslur/kilometragjald',
}
