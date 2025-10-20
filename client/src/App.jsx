import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/dashboard'

function App() {
 

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element= {<Dashboard/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
