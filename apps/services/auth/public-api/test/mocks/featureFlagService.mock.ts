import { Features } from '@island.is/nest/feature-flags'

export const FeatureFlagServiceMock = {
  getValue: (feature: Features) =>
    // Use legacy personal rep source (talsmannagrunnur) so test data in PR tables is used
    feature === Features.usePersonalRepresentativesFromSyslumenn
      ? Promise.resolve(false)
      : Promise.resolve(true),
}
