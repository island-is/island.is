import React from 'react'
import cn from 'classnames'
import * as styles from './Swiper.treat'
import { useMeasure } from 'react-use'
import { Box } from '../Box'
import { ResponsiveSpace } from '../Box/useBoxStyles'
import { theme } from '@island.is/island-ui/theme'

interface SwiperProps {}

const Swiper: React.FC<SwiperProps> = ({ children }) => {
  const [ref, { width }] = useMeasure()

  return (
    <div className={styles.escapeGrid}>
      <div className={cn(styles.container)} ref={ref}>
        <div className={styles.slides}>
          {React.Children.map(children, (child) => (
            <Box
              className={styles.slide}
              style={{ width: width * 0.77 }}
              marginLeft={4}
            >
              {child}
            </Box>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Swiper
