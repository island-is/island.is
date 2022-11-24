// Hatchback = smabill
// Station = station
// Sedan = folksbill
// Jeep = jeppi
// truck = trukkur
// trailer = eftirvagn
// bike = motorhjol
// smallbike = letthjol
import SvgEftirvagn from '../components/Icons/eftirvagn'
import SvgFolksbill from '../components/Icons/folksbill'
import SvgStation from '../components/Icons/station'
import SvgSmabill from '../components/Icons/smabill'
import SvgJeppi from '../components/Icons/jeppi'
import SvgLetthjol from '../components/Icons/letthjol'
import SvgMotorhjol from '../components/Icons/motorhjol'
import SvgTrukkur from '../components/Icons/trukkur'
import React from 'react'

// type from vehgroup = "Vörubifreið II (N3)" = N3,

export const translateType = (type: string, color: string) => {
  switch (type) {
    case 'AB':
      return <SvgSmabill color={translateColor(color)} />

    case 'AA':
      return <SvgFolksbill color={translateColor(color)} />

    case 'AC':
      return <SvgStation color={translateColor(color)} />

    case 'AD':
      return <SvgSmabill color={translateColor(color)} />

    case 'AE':
      return <SvgFolksbill color={translateColor(color)} />

    case 'AF':
      return <SvgJeppi color={translateColor(color)} />

    case 'BA':
      return <SvgTrukkur color={translateColor(color)} />

    case 'SA':
      return <SvgJeppi color={translateColor(color)} />

    case 'BB':
      return <SvgSmabill color={translateColor(color)} />

    case 'BC':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'BD':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'BE':
      return <SvgTrukkur color={translateColor(color)} />

    case 'M1':
      return <SvgFolksbill color={translateColor(color)} />

    case 'TE2':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'TE1':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'TE3':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'O1':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'O2':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'O3':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'O4':
      return <SvgEftirvagn color={translateColor(color)} />

    case 'N1':
      return <SvgJeppi color={translateColor(color)} />

    case 'M2':
      return <SvgTrukkur color={translateColor(color)} />

    case 'N2':
      return <SvgTrukkur color={translateColor(color)} />

    case 'N3':
      return <SvgTrukkur color={translateColor(color)} />

    case 'TO2':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'TO3':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'TO4':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'TO5':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'TO6':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'L7e':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'L3e':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'L4e':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'L5e':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'L6e':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'L7E':
      return <SvgMotorhjol color={translateColor(color)} />

    case 'L1e':
      return <SvgLetthjol color={translateColor(color)} />

    case 'L2e':
      return <SvgLetthjol color={translateColor(color)} />
    default:
      return <SvgFolksbill color={translateColor(color)} />
  }
}

export const translateColor = (color: string) => {
  if (color.startsWith('1')) {
    return '#FFFF00'
  } // #YELLOW

  if (color === '21') {
    return '#FF4500'
  } // #ORANGE

  if (color === '24') {
    return '#800080'
  } // #PURPLE

  if (color.startsWith('2')) {
    return '#FF0000'
  } // #RED

  if (color.startsWith('3')) {
    return '#008000'
  } // #GREEN

  if (color === '43') {
    return '#00FFFF'
  } // #CYAN

  if (color.startsWith('4')) {
    return '#0000FF'
  } // #BLUE

  if (color === '51') {
    return '#FFFFE0'
  } // #LIGHTYELLOW

  if (color === '52') {
    return '#FA8072'
  } // #LIGHTRED

  if (color === '53') {
    return '#90EE90'
  } // #LIGHTGREEN

  if (color === '54') {
    return '#ADD8E6'
  } // #LIGHTBLUE

  if (color === '57') {
    return '#CD853F'
  } // #LIGHTBROWN

  if (color === '58') {
    return '#D3D3D3'
  } // #LIGHTGRAY

  if (color.startsWith('5')) {
    return '#FFFFFF'
  } // #WHITE

  if (color === '62') {
    return '#DC143C'
  } // #DARKRED

  if (color === '63') {
    return '#006400'
  } // #DARKGREEN

  if (color === '64') {
    return '#00008B'
  } // #DARKBLUE

  if (color === '67') {
    return '#800000'
  } // #DARKBROWN

  if (color === '68') {
    return '#A9A9A9'
  } // #DARKGRAY

  if (color.startsWith('6')) {
    return '#000000'
  } // #BLACK

  if (color.startsWith('7')) {
    return '#8B4513'
  } // #BROWN

  if (color.startsWith('8')) {
    return '#808080'
  } // #GRAY

  if (color === '999') {
    return '#F0FFFF'
  } // UNKNOWN (azure - KEYED UNKNOWN)

  if (color.startsWith('9')) {
    return '#FFC0CB'
  } // #PINK

  return '#EE82EE' // #UNKNOWN still... ( VIOLET - UNKEYED UNKNOWN - truly unknown! )
}
