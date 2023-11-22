import { SectionChildren } from '@island.is/application/types'
import { SubSection } from '../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'

export class SubSectionFactory implements IFormItemFactory<SubSection> {
  create(item: SectionChildren): SubSection {
    const subSectionDto = new SubSection()

    return subSectionDto
  }
}
