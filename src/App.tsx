import { PipelineGutter } from './sections/PipelineGutter'
import { StickyBar } from './sections/StickyBar'
import { Hero } from './sections/Hero'
import { Glance } from './sections/Glance'
import { FeaturedWork } from './sections/FeaturedWork'
import { Experience } from './sections/Experience'
import { Awards } from './sections/Awards'
import { Education } from './sections/Education'
import { Skills } from './sections/Skills'
import { Beyond } from './sections/Beyond'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

/**
 * Page composition. Owned by the orchestrator.
 * Section components live in src/sections/* and are owned by tasks A1–A3.
 *
 * Layout contract:
 *  - <main> is the centered column (max-w = --page-max). It is `relative` so the
 *    pipeline line can be absolutely positioned at x = --line-x from its left edge.
 *  - Content sits at padding-left = --page-pad + --gutter, leaving room for the line.
 */
export default function App() {
  return (
    <>
      <StickyBar />
      <main
        className="relative mx-auto min-h-dvh"
        style={{
          maxWidth: 'var(--page-max)',
          paddingLeft: 'calc(var(--page-pad) + var(--gutter))',
          paddingRight: 'var(--page-pad)',
        }}
      >
        <PipelineGutter />
        <Hero />
        <Glance />
        <FeaturedWork />
        <Experience />
        <Awards />
        <Education />
        <Skills />
        <Beyond />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
