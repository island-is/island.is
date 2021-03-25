import React from 'react';
import { Image } from 'react-native';
import island from '../../assets/logo/logo-64w.png'
import skattur from '../../assets/temp/skattur.png'
import coatOfArms from '../../assets/temp/skjaldmerki.png'

export enum IconType {
  ICELAND,
  TAX,
  GOVERNMENT,
}

function senderNameToIconType(str: string) {
  if (str === 'Skatturinn') {
    return IconType.TAX;
  }
  if (str === 'Ríkislögreglustjóri') {
    return IconType.GOVERNMENT
  }
  if (str === 'Fjársýsla ríkisins') {
    return IconType.GOVERNMENT
  } else {
    return IconType.ICELAND
  }
}

const icons = {
  [IconType.ICELAND]: island,
  [IconType.TAX]: skattur,
  [IconType.GOVERNMENT]: coatOfArms,
};

interface IProps {
  name: string;
}

export const Logo = ({ name }: IProps) => {
  if (name === undefined) {
    return null;
  }

  return (
    <Image
      source={icons[senderNameToIconType(name)]}
      resizeMode="contain"
      style={{ width: 25, height: 25 }}
    />
  );
};
