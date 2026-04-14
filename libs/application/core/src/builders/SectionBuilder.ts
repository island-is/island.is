import {
  FormItemTypes,
  FormLeaf,
  Section,
  SectionChildren,
  SubSection,
  FormText,
} from '@island.is/application/types'
import { PageBuilder } from './PageBuilder'

export class SubSectionBuilder<TSchema = unknown> {
  private children: FormLeaf[] = []
  private _id: string
  private _title: FormText

  constructor(id: string, title: FormText) {
    this._id = id
    this._title = title
  }

  addPage(
    id: string,
    title: FormText,
    builderFn: (p: PageBuilder<TSchema>) => void,
  ): this {
    const pageBuilder = new PageBuilder<TSchema>(id, title)
    builderFn(pageBuilder)
    this.children.push(pageBuilder.build())
    return this
  }

  build(): SubSection {
    return {
      id: this._id,
      title: this._title,
      type: FormItemTypes.SUB_SECTION,
      children: this.children,
    }
  }
}

export class SectionBuilder<TSchema = unknown> {
  private children: SectionChildren[] = []
  private _id: string
  private _title: FormText

  constructor(id: string, title: FormText) {
    this._id = id
    this._title = title
  }

  addPage(
    id: string,
    title: FormText,
    builderFn: (p: PageBuilder<TSchema>) => void,
  ): this {
    const pageBuilder = new PageBuilder<TSchema>(id, title)
    builderFn(pageBuilder)
    this.children.push(pageBuilder.build())
    return this
  }

  addSubSection(
    id: string,
    title: FormText,
    builderFn: (s: SubSectionBuilder<TSchema>) => void,
  ): this {
    const subSectionBuilder = new SubSectionBuilder<TSchema>(id, title)
    builderFn(subSectionBuilder)
    this.children.push(subSectionBuilder.build())
    return this
  }

  build(): Section {
    return {
      id: this._id,
      title: this._title,
      type: FormItemTypes.SECTION,
      children: this.children,
    }
  }
}
