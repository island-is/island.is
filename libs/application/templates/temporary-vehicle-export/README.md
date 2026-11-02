# temporary-vehicle-export

Tímabundinn útflutningur ökutækis – registration of mileage when a vehicle is
temporarily taken abroad, as a basis for an exemption from the kilometre fee
(kílómetragjald) and possibly a reduced vehicle tax (bifreiðagjald).

- **Organization:** Skatturinn. Vehicle and mileage data comes from Samgöngustofa.
- **Code owner:** Advania
- **Feature flag:** `isTemporaryVehicleExportEnabled`

## Flow

One application covers one vehicle and one trip abroad.

1. **prerequisites** – fetches the applicant's vehicles that pay the kilometre
   fee and whose mileage they can register, with the latest mileage
   (Samgöngustofa).
2. **departure** – the applicant picks a vehicle and registers the departure
   date and mileage. On submit the mileage is registered at Samgöngustofa with
   origin code `BROTTFOR`.
3. **awaitingArrival** – the application stays open while the vehicle is abroad
   (pruned after `MAX_DAYS_ABROAD` days). On return the applicant registers the
   arrival date and mileage and uploads proof of travel (booking or cargo
   manifest: PDF, Word, JPEG or PNG). On submit the mileage is registered at
   Samgöngustofa with origin code `KOMA`, and the trip and documents are sent
   to Skatturinn.
4. **completed**

Departure answers are read-only after the departure has been registered.

## Testing

Use a test person who owns or operates a vehicle that pays the kilometre fee.

## Running unit tests

Run `nx test temporary-vehicle-export` to execute the unit tests via [Jest](https://jestjs.io).
