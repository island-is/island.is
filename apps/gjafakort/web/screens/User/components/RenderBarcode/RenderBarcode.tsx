import React, { useCallback } from 'react'
import jsbarcode from 'jsbarcode'
import cn from 'classnames'

import * as styles from './RenderBarcode.css'

interface PropTypes {
  code: string
  invalid: boolean
}

function RenderBarcode({ code, invalid }: PropTypes) {
  const svgRef = useCallback(
    (node) => {
      if (node !== null) {
        jsbarcode(node, code, {
          font: 'IBM Plex Sans',
          margin: 0,
          marginBottom: 5,
        })
      }
    },
    [code],
  )

  return (
    <svg
      className={cn(styles.barcodeSvg, {
        [styles.invalidBarcode]: invalid,
      })}
      ref={svgRef}
    />
  )
}

export default RenderBarcode
