import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './Signup';
import Home from './Home';
import Landing from './Landing';



function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
     <Routes>
  <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
  <Route path="/login" element={<Login onLogin={setUser} />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
</Routes>
    </Router>
  );
}

export default App;
