import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'


export const timeInput = style({

    fontVariantNumeric: "tabular-nums",
    border: "none",
    outline: "black",
    textAlign: "center"
})


export const timeWrapper = style({
    width: "fit-content",
    columnSpan: "none"
})