import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import QuizzData from './componets/QuizzData'

function App() {

  return (<div style={{
    display: "grid",
    gap: "1.3rem",
    paddingBlock: "1rem",
    paddingInline: "1.5rem"
  }}>
    <QuizzData />
  </div>

  )

}

export default App
