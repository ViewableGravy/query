import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Store } from './core/store'
import { useStore } from './react/useStore'

const myStore = new Store({
  myValue: "I am the starting value",
  anotherValue: 1
})

function App() {
  const myValue = useStore(myStore, ({ anotherValue }) => anotherValue)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          myStore.setState((state) => ({
            ...state,
            anotherValue: state.anotherValue + 1
          }))
        }}>
          value is: {myValue}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>
        This is my pog value: {myValue}
      </p>
    </>
  )
}

export default App
