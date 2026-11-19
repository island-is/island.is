# temporary-vehicle-export

Undanþága frá greiðslu kílómetra- og bifreiðagjalds vegna ökutækja sem hafa
verið flutt tímabundið úr landi – registration of mileage when a vehicle is
temporarily taken abroad, as a basis for an exemption from the kilometre fee
(kílómetragjald, 1. tölul. 5. gr. laga nr. 100/2025) and the vehicle tax
(bifreiðagjald, e-liður 4. gr. laga nr. 39/1988).

The first screen, "Um umsóknina", explains the application and refers to these
laws. Its text is a placeholder until Skatturinn provides the final wording in
Contentful (`rsk.tve.application:about.description#markdown`).

- **Organization:** Skatturinn. Vehicle and mileage data comes from Samgöngustofa.
- **Code owner:** Advania
- **Feature flag:** `isTemporaryVehicleExportEnabled`

## Flow

One application covers one vehicle and one trip abroad.

1. **prerequisites** – fetches the applicant's vehicles that pay the kilometre
   fee and whose mileage they can register, with the latest mileage
   (Samgöngustofa).
2. **departure** – the applicant picks a vehicle and registers the departure
   date (today or up to 3 days back) and mileage. On submit the mileage is
   registered at Samgöngustofa with origin code `BROTTFOR`. If the vehicle has
   a registered mileage the applicant can use it as the departure mileage
   instead. Then nothing is registered at departure, and Skatturinn is told so
   with `UseExistingMileageRegistration`.
3. **awaitingArrival** – the application stays open while the vehicle is abroad
   (pruned after `MAX_DAYS_ABROAD` days, 5 years, since the law sets no limit).
   On return the applicant registers the arrival date (today or up to
   3 days back, not before departure) and mileage and uploads
   proof of travel (booking or cargo manifest: up to 5 PDF, Word, JPEG or PNG
   files, 45 MB in total). On submit the mileage is registered at
   Samgöngustofa with origin code `KOMA`, and the trip and documents are sent
   to Skatturinn.
4. **completed**

Departure answers are read-only after the departure has been registered.

## Testing

Use a test person who owns or operates a vehicle that pays the kilometre fee.

## Running unit tests

Run `nx test temporary-vehicle-export` to execute the unit tests via [Jest](https://jestjs.io).
