/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class Item {
  id: number
  msg: string
}

export abstract class IMutation {
  abstract createItem(msg: string): Item | Promise<Item>
}

export abstract class IQuery {
  abstract items(): Item[] | Promise<Item[]>
  abstract getItem(id?: number): Item | Promise<Item>
}
