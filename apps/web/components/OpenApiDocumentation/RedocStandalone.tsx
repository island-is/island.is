import { MenuStore, RedocStandalone } from 'redoc'

const originalActivate = MenuStore.prototype.activate

MenuStore.prototype.activate = function (menuItem) {
  originalActivate.apply(this, [menuItem, false, false])
}

export default RedocStandalone
