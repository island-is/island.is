# API Domains Vehicles

This service utilizes the VehicleSearchApi

## How to Use

To start the API, run:

```shell
yarn start api
```

Ensure that X-road is running by executing one of the following commands:

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

The `VehiclesApiProvider` should now be available for use.

## Running Unit Tests

Execute `nx test api-domains-vehicles` to run the unit tests via [Jest](https://jestjs.io).

## UI

An example of usage can be found at: <http://localhost:4200/minarsidur/okutaeki>

Ensure the service portal is running by executing:

```shell
yarn start service-portal
```

## Data Explained

### Vehicle Detail Model Explained

_structure -> data source - explanation if necessary_

**MainInfo:**

- `model` -> `make`
- `subModel` -> `vehcom` + `speccom`
- `regno` -> `regno` - Registration number (Skráningarnúmer)
- `year` -> `modelyear` | `productyear` | `firstregdate(year)`
- `co2` -> `technical.co2`
- `weightedCo2` -> `technical.weightedCo2` - Weighted NEDC
- `co2Wltp` -> `technical.co2Wltp` - WLTP
- `weightedCo2Wltp` -> `technical.weightedco2Wltp` - Weighted WLTP
- `cubicCapacity` -> `technical.capactiy` - Cubic Capacity (Slagrými)
- `trailerWithBrakesWeight` -> `technical.tMassoftrbr` - Trailer weight with brakes (Hemlaður eftirvagn)
- `trailerWithoutBrakesWeight` -> `technical.tMassoftrunbr` - Trailer weight without brakes (Óhemlaður eftirvagn)

**Axle:**

- `axleMaxWeight` -> `technical.mass.massdaxle${i}` - Refer to `/api-domains-vehicles.service.ts` l:104
- `wheelAxle` -> `technical.axle.wheelaxle${i}` - Refer to `/api-domains-vehicles.service.ts` l:107

**Tyres:**

- `axle1` -> `technical.tyre.tyreaxle1`
- `axle2` -> `technical.tyre.tyreaxle2`
- `axle3` -> `technical.tyre.tyreaxle3`
- `axle4` -> `technical.tyre.tyreaxle4`
- `axle5` -> `technical.tyre.tyreaxle5`

**BasicInfo:**

- `model` -> `make` - Type (Tegund)
- `regno` -> `regno` - Registration number (Skráningarnúmer)
- `subModel` -> `vehcom` + `speccom` - Type & Subtype (Tegund & undirtegund)
- `permno` -> `permno` - Permanent number (Fastanúmer)
- `verno` -> `vin` - Factory number (Verksmiðjunúmer)
- `year` -> `modelyear` | `productyear` | `firstregdate(year)`
- `country` -> `country`
- `preregDateYear` -> `preregdate(year)`
- `formerCountry` -> `formercountry`
- `importStatus` -> `_import`

**RegistrationInfo:**

- `firstRegistrationDate` -> `firstregdate`
- `preRegistrationDate` -> `preregdate`
- `newRegistrationDate` -> `newregdate`
- `specialName` -> `speccom` - Special name (Sérheiti)
- `vehicleGroup` -> `technical.vehgroup` - Vehicle group (Ökutækisflokkur)
- `color` -> `color`
- `reggroup` -> `plates.reggroup` - Registration group (Skráningarflokkur)
- `reggroupName` -> `data.plates[0].reggroupname` - Registration group name (Skráningarflokkur)
- `plateLocation` -> `platestoragelocation` - Plate storage location (Geymslustaður plötu)
- `plateStatus` -> `platestatus`
- `passengers` -> `technical.pass`
- `useGroup` -> `usegroup`
- `driversPassengers` -> `technical.passbydr`
- `standingPassengers` -> `technical.standingno`

**CurrentOwnerInfo:**

- `owner` -> `owners.fullname`
- `nationalId` -> `owners.persidno`
- `address` -> `owners.address`
- `postalcode` -> `owners.postalcode`
- `city` -> `owners.city`
- `dateOfPurchase` -> `owners.purchasedate`

**InspectionInfo:**

- `type` -> `inspections[newest].type`
- `date` -> `inspections[newest].date`
- `result` -> `inspections[newest].result`
- `nextInspectionDate` -> `nextinspectiondate`
- `lastInspectionDate` -> `inspections[last].date`
- `insuranceStatus` -> `insurancestatus`
- `mortgages` -> `fees.hasEncumbrances`
- `carTax` -> `fees.gjold.bifreidagjald`
- `inspectionFine` -> `fees.inspectionfine`

**TechnicalInfo:**

- `engine` -> `technical.engine`
- `totalWeight` -> `technical.mass.massladen`
- `cubicCapacity` -> `technical.capacity`
- `capacityWeight` -> `technical.mass.massofcomb` - Combined weight (Þyngd vagnlestar)
- `length` -> `technical.size.length`
- `vehicleWeight` -> `technical.mass.massinro`
- `width` -> `technical.size.width`
- `trailerWithoutBrakesWeight` -> `technical.mass.tMassoftrunbr`
- `horsepower` -> `technical.maxNetPower` \* 1.359622 - Metric horsepower (hp(M))
- `trailerWithBrakesWeight` -> `technical.mass.tMassoftrbr`
- `carryingCapacity` -> `technical.mass.masscapacity`
- `axleTotalWeight` -> Sum of `technical.mass.massmaxle1` through `massmaxle5`
- `axles` -> Axle[] (see above)
- `tyres` -> Tyres (see above)

**Owners:**

- `nationalId` -> `owners.persidno`
- `name` -> `owners.fullname`
- `address` -> Concatenation of `owners.address` + `owners.postalcode` + `owners.city`
- `dateOfPurchase` -> `owners.purchasedate`

**Operator:**

- `nationalId` -> `operators[current].persidno`
- `name` -> `operators[current].name`
- `address` -> `operators[current].address`
- `postalcode` -> `operators[current].postalcode`
- `city` -> `operators[current].city`
- `startDate` -> `operators[current].startdate`
- `endDate` -> `operators[current].enddate`
