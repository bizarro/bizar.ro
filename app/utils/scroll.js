import GSAP from 'gsap'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

GSAP.registerPlugin(ScrollToPlugin)
GSAP.registerPlugin(ScrollTrigger)

if (window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual'
}
