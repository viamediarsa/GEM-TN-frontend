import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/landing'
import Game from './pages/game'
import Dashboard from './pages/dashboard'
import Earn from './pages/earn'
import Store from './pages/store'
import Rewards from './pages/rewards'
import History from './pages/history'
import './App.css'

function App() {
 

  return (
    <>
      <Router>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/store" element={<Store />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
