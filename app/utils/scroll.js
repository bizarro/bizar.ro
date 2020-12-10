import GSAP from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

GSAP.registerPlugin(ScrollToPlugin)

if (window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual'
}
