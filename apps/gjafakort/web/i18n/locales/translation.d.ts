// To parse this data:
//
//   import { Convert, Translation } from "./file";
//
//   const translation = Convert.toTranslation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Translation {
  name: string
  companies: TranslationCompanies
  intro: Intro
}

export interface TranslationCompanies {
  name: string
  title: string
  intro: string
  description: string
  notes: Notes
  FAQ: FAQ
}

export interface FAQ {
  title: string
  items: Item[]
}

export interface Item {
  label: string
  contents: string[]
}

export interface Notes {
  label: string
  items: string[]
}

export interface Intro {
  name: string
  title: string
  intro: string
  description: string
  FAQ: FAQ
  users: UsersClass
  companies: UsersClass
}

export interface UsersClass {
  label: string
  content: string
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toTranslation(json: string): Translation {
    return cast(JSON.parse(json), r('Translation'))
  }

  public static translationToJson(value: Translation): string {
    return JSON.stringify(uncast(value, r('Translation')), null, 2)
  }
}

function invalidValue(typ: any, val: any): never {
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`,
  )
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
    typ.jsonToJS = map
  }
  return typ.jsonToJS
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
    typ.jsToJSON = map
  }
  return typ.jsToJSON
}

function transform(val: any, typ: any, getProps: any): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val
    return invalidValue(typ, val)
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length
    for (let i = 0; i < l; i++) {
      const typ = typs[i]
      try {
        return transform(val, typ, getProps)
      } catch (_) {}
    }
    return invalidValue(typs, val)
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(cases, val)
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val)
    return val.map((el) => transform(el, typ, getProps))
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null
    }
    const d = new Date(val)
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val)
    }
    return d
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val)
    }
    const result: any = {}
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key]
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined
      result[prop.key] = transform(v, prop.typ, getProps)
    })
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps)
      }
    })
    return result
  }

  if (typ === 'any') return val
  if (typ === null) {
    if (val === null) return val
    return invalidValue(typ, val)
  }
  if (typ === false) return invalidValue(typ, val)
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref]
  }
  if (Array.isArray(typ)) return transformEnum(typ, val)
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val)
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val)
  return transformPrimitive(typ, val)
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps)
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps)
}

function a(typ: any) {
  return { arrayItems: typ }
}

function u(...typs: any[]) {
  return { unionMembers: typs }
}

function o(props: any[], additional: any) {
  return { props, additional }
}

function m(additional: any) {
  return { props: [], additional }
}

function r(name: string) {
  return { ref: name }
}

const typeMap: any = {
  Translation: o(
    [
      { json: 'name', js: 'name', typ: '' },
      { json: 'companies', js: 'companies', typ: r('TranslationCompanies') },
      { json: 'intro', js: 'intro', typ: r('Intro') },
    ],
    false,
  ),
  TranslationCompanies: o(
    [
      { json: 'name', js: 'name', typ: '' },
      { json: 'title', js: 'title', typ: '' },
      { json: 'intro', js: 'intro', typ: '' },
      { json: 'description', js: 'description', typ: '' },
      { json: 'notes', js: 'notes', typ: r('Notes') },
      { json: 'FAQ', js: 'FAQ', typ: r('FAQ') },
    ],
    false,
  ),
  FAQ: o(
    [
      { json: 'title', js: 'title', typ: '' },
      { json: 'items', js: 'items', typ: a(r('Item')) },
    ],
    false,
  ),
  Item: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'contents', js: 'contents', typ: a('') },
    ],
    false,
  ),
  Notes: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'items', js: 'items', typ: a('') },
    ],
    false,
  ),
  Intro: o(
    [
      { json: 'name', js: 'name', typ: '' },
      { json: 'title', js: 'title', typ: '' },
      { json: 'intro', js: 'intro', typ: '' },
      { json: 'description', js: 'description', typ: '' },
      { json: 'FAQ', js: 'FAQ', typ: r('FAQ') },
      { json: 'users', js: 'users', typ: r('UsersClass') },
      { json: 'companies', js: 'companies', typ: r('UsersClass') },
    ],
    false,
  ),
  UsersClass: o(
    [
      { json: 'label', js: 'label', typ: '' },
      { json: 'content', js: 'content', typ: '' },
    ],
    false,
  ),
}
