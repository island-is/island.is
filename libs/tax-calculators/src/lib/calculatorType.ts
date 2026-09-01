/* Plain TS, no @nestjs/graphql: this lib is bundled into apps/web and
 * apps/contentful-apps, and @nestjs/graphql drags in chokidar/fast-glob/ws.
 * `registerEnumType` for the GraphQL schema lives in libs/cms, following
 * CustomPageUniqueIdentifier. */
export enum TaxCalculatorType {
  WITHHOLDING_TAX_ON_WAGES = 'withholdingTaxOnWages',
  CHILD_BENEFIT = 'childBenefit',
  VEHICLE_TAX = 'vehicleTax',
  VEHICLE_BENEFIT = 'vehicleBenefit',
}
