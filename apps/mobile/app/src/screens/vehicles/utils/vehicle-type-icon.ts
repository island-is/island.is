import folksbill from '../../../assets/vehicles/bill.png'
import eftirvagn from '../../../assets/vehicles/eftirvagn.png'
import jeppi from '../../../assets/vehicles/jeppi.png'
import letthjol from '../../../assets/vehicles/letthjol.png'
import motorhjol from '../../../assets/vehicles/motorhjol.png'
import smabill from '../../../assets/vehicles/smabill.png'
import station from '../../../assets/vehicles/station.png'
import trukkur from '../../../assets/vehicles/vorubill.png'

export const icons = {
  smabill: { source: smabill, style: { height: 34, width: 64 } },
  folksbill: { source: folksbill, style: { width: 33, height: 64 } },
  station: { source: station, style: { width: 33, height: 64 } },
  jeppi: { source: jeppi, style: { width: 40, height: 64 } },
  trukkur: { source: trukkur, style: { width: 45, height: 64 } },
  eftirvagn: { source: eftirvagn, style: { width: 43, height: 64 } },
  motorhjol: { source: motorhjol, style: { width: 41, height: 62 } },
  letthjol: { source: letthjol, style: { width: 40, height: 64 } },
}

export const typesIcon = {
  AB: icons.smabill,
  AA: icons.folksbill,
  AC: icons.station,
  AD: icons.smabill,
  AE: icons.folksbill,
  AF: icons.jeppi,
  BA: icons.trukkur,
  SA: icons.jeppi,
  BB: icons.smabill,
  BC: icons.eftirvagn,
  BD: icons.eftirvagn,
  BE: icons.trukkur,
  M1: icons.folksbill,
  TE2: icons.eftirvagn,
  TE1: icons.eftirvagn,
  TE3: icons.eftirvagn,
  O1: icons.eftirvagn,
  O2: icons.eftirvagn,
  O3: icons.eftirvagn,
  O4: icons.eftirvagn,
  N1: icons.jeppi,
  M2: icons.trukkur,
  N2: icons.trukkur,
  N3: icons.trukkur,
  TO2: icons.motorhjol,
  TO3: icons.motorhjol,
  TO4: icons.motorhjol,
  TO5: icons.motorhjol,
  TO6: icons.motorhjol,
  L7e: icons.motorhjol,
  L3e: icons.motorhjol,
  L4e: icons.motorhjol,
  L5e: icons.motorhjol,
  L6e: icons.motorhjol,
  L7E: icons.motorhjol,
  L1e: icons.letthjol,
  L2e: icons.letthjol,
}

export const getVehicleTypeIcon = (type: string) => {
  return typesIcon[type as keyof typeof typesIcon] ?? icons.folksbill
}
