import 'styled-components';
import { Theme } from '@island.is/island-ui/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    colorScheme: string;
    isDark: boolean;
    shade: {
      background: string;
      foreground: string;
      shade700: string;
      shade600: string;
      shade500: string;
      shade400: string;
      shade300: string;
      shade200: string;
      shade100: string;
    }
  }
}
