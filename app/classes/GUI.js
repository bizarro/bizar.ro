import Dat from 'dat.gui'

export const GUI = window.location.search.indexOf('gui') > -1 ? new Dat.GUI() : null

if (GUI) {
  GUI.close()
}
