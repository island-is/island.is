import { ClientIdpRestrictions } from '../models/client-idp-restrictions.model';

export class CastHelper {
  static IdpRestrictionToStringArray(idp?: ClientIdpRestrictions[]): string[] {
    const arr: string[] = [];
    if (!idp) {
      return arr;
    }

    for (let i = 0; i < idp.length; i++) {
      arr.push(idp[i].name);
    }
    return arr;
  }
}
