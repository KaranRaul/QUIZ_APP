import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from 'socket.io-client';
import Admin from './components/Admin';
import User from './components/User';
import styles from "./index.css"
// export const socket = io('http://localhost:3000');
export const socket = io('https://quiz-app-backend-gray.vercel.app/');

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
