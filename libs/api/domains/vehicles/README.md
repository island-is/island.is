```markdown
# API Domains Vehicles

This service uses the `VehicleSearchApi`.

## How to Use

### Start the API

```bash
yarn start api
```

### Ensure X-road is Running

```bash
./scripts/run-xroad-proxy.sh
```

OR

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

VehiclesApiProvider should be ready for use.

## Running Unit Tests

Execute `nx test api-domains-vehicles` to run unit tests with [Jest](https://jestjs.io).

# UI

Example: [Localhost Vehicle Page](http://localhost:4200/minarsidur/okutaeki).

Ensure the service portal is running:

```bash
yarn start service-portal
```

## Data Model Explanation

### Vehicle Detail Model

**MainInfo**

- `model` -> `make`
- `subModel` -> `vehcom` + `speccom`
- `regno` -> Registration number
- `year` -> `modelyear`, `productyear`, or `firstregdate(year)`
- `co2` -> `technical.co2`
- `weightedCo2` -> Weighted NEDC
- `co2Wltp` -> WLTP
- `weightedCo2Wltp` -> Weighted WLTP
- `cubicCapacity` -> Engine displacement
- `trailerWithBrakesWeight` -> Brake trailer weight
- `trailerWithoutBrakesWeight` -> Unbrake trailer weight

**Axle**

- `axleMaxWeight` -> See `service.ts` line 104
- `wheelAxle` -> See `service.ts` line 107

**Tyres**

- `axle1` -> Tyre info for axle 1
- `axle2` -> Tyre info for axle 2
- `axle3` -> Tyre info for axle 3
- `axle4` -> Tyre info for axle 4
- `axle5` -> Tyre info for axle 5

**BasicInfo**

- `model` -> Type
- `regno` -> Registration number
- `subModel` -> Type & subtype
- `permno` -> Permanent number
- `verno` -> Factory number
- `year` -> Year
- `country` -> Country
- `preregDateYear` -> Pre-registration year
- `formerCountry` -> Former country
- `importStatus` -> Import status

**RegistrationInfo**

- `firstRegistrationDate` -> First registration date
- `preRegistrationDate` -> Pre-registration date
- `newRegistrationDate` -> New registration date
- `specialName` -> Special name
- `vehicleGroup` -> Vehicle group
- `color` -> Color
- `reggroup` -> Registration group
- `reggroupName` -> Registration group name
- `plateLocation` -> Plate storage location
- `plateStatus` -> Plate status
- `passengers` -> Passengers
- `useGroup` -> Usage group
- `driversPassengers` -> Drivers + passengers
- `standingPassengers` -> Standing passengers

**CurrentOwnerInfo**

- `owner` -> Owner's name
- `nationalId` -> Owner’s ID
- `address` -> Owner's address
- `postalcode` -> Postal code
- `city` -> City
- `dateOfPurchase` -> Purchase date

**InspectionInfo**

- `type` -> Inspection type
- `date` -> Inspection date
- `result` -> Inspection result
- `nextInspectionDate` -> Next inspection date
- `lastInspectionDate` -> Last inspection date
- `insuranceStatus` -> Insurance status
- `mortages` -> Has encumbrances
- `carTax` -> Vehicle tax
- `inspectionFine` -> Inspection fine

**TechnicalInfo**

- `engine` -> Engine details
- `totalWeight` -> Total weight
- `cubicCapacity` -> Capacity
- `capacityWeight` -> Combined weight
- `length` -> Length
- `vehicleWeight` -> Kerb weight
- `width` -> Width
- `trailerWithoutBrakesWeight` -> Unbrake trailer weight
- `horsepower` -> Metric horsepower
- `trailerWithBrakesWeight` -> Brake trailer weight
- `carryingCapacity` -> Load capacity
- `axleTotalWeight` -> Total axle weight
- `axles` -> Axle details
- `tyres` -> Tyre details

**Owners**

- `nationalId` -> Owner’s ID
- `name` -> Owner's name
- `address` -> Owner's full address
- `dateOfPurchase` -> Purchase date

**Operator**

- `nationalId` -> Operator’s ID
- `name` -> Operator's name
- `address` -> Operator's address
- `postalcode` -> Postal code
- `city` -> City
- `startDate` -> Start date
- `endDate` -> End date
```