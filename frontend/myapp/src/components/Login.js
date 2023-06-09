
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Login = () => {
    let navigate = useNavigate();

  const [password, setPassword] = useState('')

  const [Email, setEmail] = useState('')

  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userData = {Email,  password}
    
    const response = await fetch('http://localhost:3001/user/login', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // try{
    //     const res = await axios.post(`http://localhost:3001/user/login`, 
    //      userData, {
    //         headers: {
    //             'Content-type': 'application/json'
    //         }

    //      }
    //     )
    // }catch(error){
    //     console.log(error)
    // }
    //   .then(res => {
    //     console.log(res);
    //     console.log(res.data);
    //   })
    const json = response.json()

    if (!response.ok) {
      setError(json.error)
    
    }
    if (response.ok) {
      setError(null)
      setPassword('')
      setEmail('')
      localStorage.setItem('token', json.token)
      navigate("/")

     
      console.log('new userData added', json)
    }

  }

  return (
    <form  className="create" onSubmit={handleSubmit}> 
     
      <div className="col-md-10">
        <label htmlFor="validationCustomUsername" className="form-label">Email Address:</label>
        <div className="input-group">
          <span className="input-group-text" id="inputGroupPrepend">@</span>
          <input type="text" className="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" 
          onChange={(e) => setEmail(e.target.value)} 
          value={Email}
          required />
          <div className="invalid-feedback">
            Please provide valid email address.
          </div>
        </div>
      </div>
      <div className="col-md-10">
        <label htmlFor="validationCustom01" className="form-label">Password:</label>
        <input type="password" className="form-control" id="validationCustom01" 
        onChange={(e) => setPassword(e.target.value)} 
        value={password} required />
        <div className="valid-feedback">
          Looks good!
        </div>
      </div>
      <div className="col-10">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required/>
          <label className="form-check-label" htmlFor="invalidCheck">
            I Agree the above provided information is correct
          </label>
          <div className="invalid-feedback">
            You must agree before submitting.
          </div>
        </div>
      </div>
      <div className="col-6">
        <button className="btn btn-primary" type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  )}
  

export default Login