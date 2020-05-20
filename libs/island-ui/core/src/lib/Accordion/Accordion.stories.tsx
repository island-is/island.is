import React from 'react'
import Accordion from './Accordion'
import { AccordionItem } from '../AccordionItem/AccordionItem'

export default {
  title: 'Components/Accordion',
  component: Accordion,
}

export const SingleExpand = () => (
  <Accordion>
    <AccordionItem id="id_1" label="Hvenær þarf að skila umsókn?">
      Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi.
      Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.
    </AccordionItem>
    <AccordionItem
      id="id_2"
      label="Er hægt að leggja inn greiðslur á bankareikning maka?"
    >
      Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi.
      Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.
    </AccordionItem>
    <AccordionItem id="id_3" label="Hvernig kem ég umsókninni til ykkar?">
      Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi.
      Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.
    </AccordionItem>
  </Accordion>
)

export const MultiExpand = () => (
  <Accordion singleExpand={false}>
    <AccordionItem id="id_1" label="Hvenær þarf að skila umsókn?">
      Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi.
      Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.
    </AccordionItem>
    <AccordionItem
      id="id_2"
      label="Er hægt að leggja inn greiðslur á bankareikning maka?"
    >
      Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi.
      Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.
    </AccordionItem>
    <AccordionItem id="id_3" label="Hvernig kem ég umsókninni til ykkar?">
      Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi.
      Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.
    </AccordionItem>
  </Accordion>
)
