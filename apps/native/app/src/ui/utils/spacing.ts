import {DefaultTheme} from 'styled-components';
type Spacing = DefaultTheme['spacing'];

export function spacing(amount: keyof Spacing, unit: string | null = 'px') {
  return ({theme}: {theme: DefaultTheme}) => `${theme.spacing[amount]}${unit}`;
}
