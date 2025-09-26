import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AudioRecorder from './components/AudioRecorder'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AudioRecorder/>
    </>
  )
}

export default App
