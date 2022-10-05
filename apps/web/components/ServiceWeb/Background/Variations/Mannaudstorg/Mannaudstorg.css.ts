import { style } from '@vanilla-extract/css'
import { DESKTOP_HEADER_HEIGHT } from '../../../constants'

export const bg = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundImage:
    'url(https://images.ctfassets.net/8k0h54kbe6bj/5MPtEcCql6t4YK2IdEr55B/4a874e12c84839a787631d803dd48364/FJA_Mannaudstorg_Vefsida_header_1440x750px_0522.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
})

export const foreground = style({
  position: 'absolute',
  top: DESKTOP_HEADER_HEIGHT,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundImage:
    'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(https://images.ctfassets.net/8k0h54kbe6bj/5zLhMufXWTknM1HBpkjoea/73960da4ac0d1c2b91bf2cf3b3360219/mannaudstorg.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
})
