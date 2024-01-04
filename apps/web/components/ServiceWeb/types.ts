export type BackgroundVariations =
  | 'syslumenn'
  | 'district-commissioner'
  | 'stafraent-island'
  | 'mannaudstorg'
  | 'default'
  | 'sjukratryggingar'
  | 'icelandic-health-insurance'
  | 'iceland-health'
  | string

export type VariationProps = {
  small?: boolean
}

export type BackgroundProps = VariationProps & {
  variation?: BackgroundVariations
  namespace: Record<string, string>
}

export type TextModes = 'light' | 'dark' | 'blueberry'

export type Options = {
  textMode: TextModes
}

export type FormNamespace = Record<
  string,
  Record<'label' | 'placeholder' | 'requiredMessage' | 'patternMessage', string>
>
