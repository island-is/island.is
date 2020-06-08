import { globalStyle as gs, style } from 'treat'
import { theme } from '../../theme'

export const navButton = style({
  backgroundColor: theme.color.blue100,
  borderRadius: '50%',
  width: 40,
  height: 40,
})

export const arrowIcon = style({
  lineHeight: 0,
})

export const rotated = style({
  transform: `rotate(180deg)`,
})

gs(`.slick-list, .slick-slider, .slick-track`, {
  position: 'relative',
  display: 'block',
})

gs(`.slick-loading .slick-slide, .slick-loading .slick-track`, {
  visibility: 'hidden',
})

gs(`.slick-slider`, {
  boxSizing: 'border-box',
  userSelect: 'none',

  msTouchAction: 'pan-y',
  touchAction: 'pan-y',
})

gs(`.slick-list`, {
  margin: '0 -12px',
  padding: '0',
})

gs(`.slick-list:focus`, {
  outline: '0',
})

gs(`.slick-list.dragging`, {
  cursor: 'hand',
})

gs(`.slick-slider .slick-list, .slick-slider .slick-track`, {
  transform: 'translate3d(0,0,0)',
})

gs(`.slick-track`, {
  display: 'flex',
  top: 0,
  left: 0,
})

gs(`.slick-track:after, .slick-track:before`, {
  display: 'table',
  content: "''",
})

gs(`.slick-track:after`, {
  clear: 'both',
})

gs(`.slick-slide`, {
  display: 'none',
  float: 'left',
  height: '100%',
  minHeight: '1px',
})

gs(`.slick-slide > div`, {
  width: '100%',
})

gs(`[dir="rtl"] .slick-slide`, {
  float: 'right',
})

gs(`.slick-slide img`, {
  display: 'block',
})

gs(`.slick-slide.slick-loading img`, {
  display: 'none',
})

gs(`.slick-slide.dragging img`, {
  pointerEvents: 'none',
})

gs(`.slick-initialized .slick-slide`, {
  display: 'flex',
  height: 'auto',
})

gs(`.slick-vertical .slick-slide`, {
  display: 'block',
  height: 'auto',
  border: '1px solid transparent',
})

gs(`.slick-arrow.slick-hidden`, {
  display: 'none',
})
