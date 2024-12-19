import { useContext } from 'react'
import { ControlContext } from '../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../lib/utils/interfaces'
import { NavbarSelect } from '../../NavbarSelect/NavbarSelect'
import { Navbar } from '../../Navbar/Navbar'

export const NavbarColumn = () => {
  const { selectStatus } = useContext(ControlContext)
  return selectStatus !== NavbarSelectStatus.OFF ? <NavbarSelect /> : <Navbar />
}
