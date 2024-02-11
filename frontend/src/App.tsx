import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from 'socket.io-client';
import Admin from './components/Admin';
import User from './components/User';
// export const socket = io('http://localhost:3000');
export const socket = io('http://54.196.224.52:3001');

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Admin />} />
          <Route path="user" element={<User />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
