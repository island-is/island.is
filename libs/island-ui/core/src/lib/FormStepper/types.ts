export enum FormStepperThemes {
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  RED = 'red',
}

export interface FormStepperSection {
  name: string
  type?: string
  children?: FormStepperChildSection[]
}

export interface FormStepperChildSection extends FormStepperSection {
  href?: string
  onClick?: () => void
}
