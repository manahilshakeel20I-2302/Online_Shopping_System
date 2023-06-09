
import './App.css';
import Login from './components/Login'
import Navbar from './components/Navbar'
import {Route, Routes} from 'react-router-dom'

function App() {
  return (
    <>
    <div className="App">
    <Navbar/>
      <Routes>
        <Route
          path ="/"
          element = {<Login/>}
        />
      </Routes>
     
     
    </div>
    </>
  );
}

export default App;
