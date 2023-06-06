
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/loginRegsiterform'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route
              path="/user/login</Route>" 
              element={<Login />} 

        />
      </Routes>
      
      
      
      </BrowserRouter>
  



    </div>
  );
}

export default App;
