import dynamic from 'next/dynamic'

export const HousingBenefitCalculator = dynamic(
  () => import('./HousingBenefitCalculator/HousingBenefitCalculator'),
  {
    ssr: false,
  },
)

export const SpecificHousingBenefitSupportCalculator = dynamic(
  () =>
    import(
      './SpecificHousingBenefitSupportCalculator/SpecificHousingBenefitSupportCalculator'
    ),
  {
    ssr: true,
  },
)
