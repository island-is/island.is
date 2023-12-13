import { Box } from '@island.is/island-ui/core'
import * as styles from './FormWrap.css'
import { FormFooter, Props as FormFooterProps } from '../FormFooter/FormFooter'
import { FormHeader, Props as HeaderProps } from '../FormHeader/FormHeader'
type Props = {
  children?: React.ReactNode
  footer?: FormFooterProps
  header?: HeaderProps
}

export const FormWrap = ({ children, footer, header }: Props) => {
  if (!children && !footer && !header) return null

  return (
    <Box className={styles.formWrap}>
      {header && (
        <FormHeader button={header.button}>{header.children}</FormHeader>
      )}
      {children && (
        <Box flexGrow={1} flexShrink={0}>
          {children}
        </Box>
      )}
      {footer && (
        <FormFooter
          prevButton={footer.prevButton}
          nextButton={footer.nextButton}
        />
      )}
    </Box>
  )
}
