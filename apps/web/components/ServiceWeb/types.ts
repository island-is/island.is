export type BackgroundVariations =
  | 'syslumenn'
  | 'stafraent-island'
  | 'mannaudstorg'
  | 'default'
  | string

export type VariationProps = {
  small?: boolean
}

export type BackgroundProps = VariationProps & {
  variation?: BackgroundVariations
}

export type TextModes = 'light' | 'dark'

export type Options = {
  textMode: TextModes
}
