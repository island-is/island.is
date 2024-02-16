import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'


export const trashIcon = style({
    ":hover": {
        borderRadius: "50%",
        background: theme.border.color.standard,
        padding: "2px"
    }
})