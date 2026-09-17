import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, domAnimation } from 'motion/react'
import './index.css'
import App from './App.tsx'

/**
 * LazyMotion + `m` components load only the animation feature set (no drag /
 * layout code). `strict` throws in dev if any `motion.*` component slips in.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </StrictMode>,
)
