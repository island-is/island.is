// Hatchback = smabill
// Station = station
// Sedan = folksbill
// Jeep = jeppi
// truck = trukkur
// trailer = eftirvagn
// bike = motorhjol
// smallbike = letthjol
import eftirvagn from '../../assets/vehicles/eftirvagn.png';
import folksbill from '../../assets/vehicles/bill.png';
import station from '../../assets/vehicles/station.png';
import smabill from '../../assets/vehicles/smabill.png';
import jeppi from '../../assets/vehicles/jeppi.png';
import letthjol from '../../assets/vehicles/letthjol.png';
import motorhjol from '../../assets/vehicles/motorhjol.png';
import trukkur from '../../assets/vehicles/vorubill.png';
import React from 'react';
import {Image} from 'react-native';

// type from vehgroup = "Vörubifreið II (N3)" = N3,

export const translateType = (type: string) => {
  switch (type) {
    case 'AB':
      return <Image source={smabill} style={{height: 34, width: 64}} />;

    case 'AA':
      return <Image source={folksbill} style={{width: 33, height: 64}} />;

    case 'AC':
      return <Image source={station} style={{width: 33, height: 64}} />;

    case 'AD':
      return <Image source={smabill} style={{width: 33, height: 64}} />;

    case 'AE':
      return <Image source={folksbill} style={{width: 34, height: 64}} />;

    case 'AF':
      return <Image source={jeppi} style={{width: 40, height: 64}} />;

    case 'BA':
      return <Image source={trukkur} style={{width: 45, height: 64}} />;

    case 'SA':
      return <Image source={jeppi} style={{width: 40, height: 64}} />;

    case 'BB':
      return <Image source={smabill} style={{width: 34, height: 64}} />;

    case 'BC':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'BD':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'BE':
      return <Image source={trukkur} style={{width: 45, height: 64}} />;

    case 'M1':
      return <Image source={folksbill} style={{width: 33, height: 64}} />;

    case 'TE2':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'TE1':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'TE3':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'O1':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'O2':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'O3':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'O4':
      return <Image source={eftirvagn} style={{width: 43, height: 64}} />;

    case 'N1':
      return <Image source={jeppi} style={{width: 40, height: 64}} />;

    case 'M2':
      return <Image source={trukkur} style={{width: 45, height: 64}} />;

    case 'N2':
      return <Image source={trukkur} style={{width: 45, height: 64}} />;

    case 'N3':
      return <Image source={trukkur} style={{width: 45, height: 64}} />;

    case 'TO2':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'TO3':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'TO4':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'TO5':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'TO6':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'L7e':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'L3e':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'L4e':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'L5e':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'L6e':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'L7E':
      return <Image source={motorhjol} style={{width: 41, height: 62}} />;

    case 'L1e':
      return <Image source={letthjol} style={{width: 40, height: 64}} />;

    case 'L2e':
      return <Image source={letthjol} style={{width: 40, height: 64}} />;
    default:
      return <Image source={folksbill} style={{width: 33, height: 64}} />;
  }
};
