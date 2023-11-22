import {
  FormChildren,
  SectionChildren,
  FormItemTypes,
} from '@island.is/application/types'
import { Section } from '../dto/form.dto'
import { IFormItemFactory } from './IFormItemFactory'
import { SubSectionFactory } from './subSectionFactory'
import { MultiFieldFactory } from './MultifieldFactory'

export class SectionFactory implements IFormItemFactory<Section> {
  create(item: FormChildren): Section {
    const sectionDto = new Section()
    // Loop through subsections/multifields and create instances
    if (!item.children) {
      return sectionDto
    }

    item.children.forEach((child: SectionChildren) => {
      if (child.type === FormItemTypes.SUB_SECTION) {
        const subSectionFactory = new SubSectionFactory()
        sectionDto.children.push(subSectionFactory.create(child))
      }
      if (child.type === FormItemTypes.MULTI_FIELD) {
        const multiFieldFactory = new MultiFieldFactory()
        const s = child
        sectionDto.children.push(multiFieldFactory.create(s))
      }
    })

    return sectionDto
  }
}
