import { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from 'socket.io-client';
import Admin from './components/Admin';
import User from './components/User';


export const socket = io('http://localhost:3000');
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
