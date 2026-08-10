import { LanguageProvider } from './LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Order from './components/Order'
import Footer from './components/Footer'
import useScrollDamping from './useScrollDamping'

const SNAP_SECTIONS = ['about', 'skills', 'experience', 'order']

function App() {
  // Section chegarasiga yaqinlashganda scroll tabiiy ravishda sekinlashadi.
  // Magnit emas, fizikaviy deceleration — tormoz kuchlanib, keyin yana tezlashadi.
  useScrollDamping(SNAP_SECTIONS, { edgeRatio: 0.18, minMultiplier: 0.25 })

  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Order />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
