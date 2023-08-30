# API Domains Vehicles

This service utilises the VehicleSearchApi

# How to use

Start the api
`yarn start api`

X-road needs to be running

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

VehiclesApiProvider should now be available to use.

## Running unit tests

Run `nx test api-domains-vehicles` to execute the unit tests via [Jest](https://jestjs.io).

# UI

Example of usage can be found in: http://localhost:4200/minarsidur/okutaeki

Service portal needs to be running.
`yarn start service-portal`

## Data explained

### Vehicle detail model explained

_modelname -> dataname - explanation if needed_

**MainInfo**

model -> make

subModel -> vehcom + speccom

regno -> regno - Skráningarnúmer

year -> modelyear | productyear | firstregdate(year)

co2 -> technical.co2

weightedCo2 -> technical.weightedCo2 - Weighted NEDC

co2Wltp -> technical.co2Wltp - WLTP

weightedCo2Wltp -> technical.weightedco2Wltp - Weighted WLTP

cubicCapacity -> technical.capactiy - Slagrými

trailerWithBrakesWeight -> technical.tMassoftrbr - Hemlaður eftirvagn

trailerWithoutBrakesWeight -> technical.tMassoftrunbr - Óhemlaður eftirvagn

**Axle**

axleMaxWeight -> technical.mass.massdaxle${i} see \*/api-domains-vehicles.service.ts l:104

wheelAxle -> technical.axle.wheelaxle${i} see \*/api-domains-vehicles.service.ts l:107

**Tyres**

axle1 -> technical.tyre.tyreaxle1

axle2 -> technical.tyre.tyreaxle2

axle3 -> technical.tyre.tyreaxle3

axle4 -> technical.tyre.tyreaxle4

axle5 -> technical.tyre.tyreaxle5

**BasicInfo**

model -> make - Tegund

regno -> regno - Skráningarnúmer

subModel -> vehcom + speccom - Tegund & undirtegund

permno -> permno - Fastanúmer

verno -> vin - Verksmiðjunúmer

year -> modelyear | productyear | firstregdate(year)

country -> country

preregDateYear -> preregdate(year)

formerCountry -> formercountry

importStatus -> \_import

RegistrationInfo

firstRegistrationDate -> firstregdate

preRegistrationDate -> preregdate

newRegistrationDate -> newregdate

specialName -> speccom - Sérheiti

vehicleGroup -> technical.vehgroup - Ökutækisflokkur

color -> color

reggroup -> plates.reggroup - Skráningarflokkur

reggroupName -> data.plates[0].reggroupname - Skráningarflokkur

plateLocation -> platestoragelocation - Geymslustaður plötu

plateStatus -> platestatus

passengers -> technical.pass

useGroup -> usegroup

driversPassengers -> technical.passbydr

standingPassengers -> technical.standingno

**CurrentOwnerInfo**

owner -> owners.fullname

nationalId -> owners.persidno

address -> owners.address

postalcode -> owners.postalcode

city -> owners.city

dateOfPurchase -> owners.purchasedate

**InspectionInfo**

type -> inspections[newest].type

date -> inspections[newest].date

result -> inspections[newest].result

nextInspectionDate -> nextinspectiondate

lastInspectionDate -> inspections[last].date

insuranceStatus -> insurancestatus

mortages -> fees.hasEncumbrances

carTax -> fees.gjold.bifreidagjald

inspectionFine -> fees.inspectionfine

**TechnicalInfo**

engine -> technical.engine

totalWeight -> technical.mass.massladen

cubicCapacity -> technical.capacity

capacityWeight -> technical.mass.massofcomb - Þyngd vagnlestar

length -> technical.size.length

vehicleWeight -> technical.mass.massinro

width -> technical.size.width

trailerWithoutBrakesWeight -> technical.tMassoftrunbr

horsepower -> technical.maxNetPower -> \* 1.359622 - Metric horsepower (hp(M))

trailerWithBrakesWeight -> technical.mass.tMassoftrbr

carryingCapacity -> technical.mass.masscapacity

axleTotalWeight -> technical.mass.massmaxle1 + massmaxle2 + massmaxle3 + massmaxle4 + massmaxle5

axles?: Axle[] (See above)

tyres?: Tyres (See above)

**Owners**

nationalId -> owners.persidno

name -> owners.fullname

address -> owners.address + owners.postalcode + owners.city

dateOfPurchase -> owners.purchasedate

**Operator**

nationalId -> operators[current].persidno

name -> operators[current].name

address -> operators[current].address

postalcode -> operators[current].postalcode

city -> operators[current].city

startDate -> operators[current].startdate

endDate -> operators[current].enddate
