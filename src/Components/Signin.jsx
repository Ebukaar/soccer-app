import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {UserAuth} from './context/AuthContext'
// import "../index.css";
import './Signin.css'

const Signin = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const {signIn} = UserAuth();

  // To reset the Input tag
  const inputTagRef = useRef(null)

  const emailValidation = () => {
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g
    if (regEx.test(email)){
      setMessage('')
     
    } else if (!regEx.test(email) && email !== '' ){
      setMessage('Email or password is not Valid')
      
    } else {
        setMessage('');
       
    }
  }

  const resetInput = () => {
    // This will reset the input tag
    inputTagRef.current.value = null;
  }

  const signInForm = document.querySelector('#signin-form');

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (e) {
      setError(e.message)
      console.log(e.message)
      signInForm.querySelector('.error').innerHTML = `Email or password is incorrect.`
      resetInput()
    }
  }

  return (
    // max-w-[700px] mx-auto my-16 p-4
    <div className='signin'>
    <div>
    {/* text-2xl font-bold py-2 */}
     <h1 className='header'>
       Sign in to your account 
     </h1> 
     {/* <p className='py-2'> 
     Don't have an account yet?  </p> */}
     {/* <Link to='/signup' className='underline '> Sign up. </Link>  */}
    </div>
    <form id='signin-form' onSubmit={handleSubmit}>
    {/* flex flex-col py-2 */}
       <div className='mail-box'>
         <label className='signin-text'> Email Address:  </label>
         <input ref={inputTagRef} onChange={(e) => setEmail(e.target.value)} className='input-box' type="email" />
       </div>
       
       <div className='mail-box'>
         <label className='signin-text'> Password:  </label>
         <input ref={inputTagRef} onChange={(e) => setPassword(e.target.value)} className='input-box' type="password" />
       </div>
       <div className='signin-button'>
       <button onClick={emailValidation} className='button-signin' >
          Sign In
       </button>
       </div>
       
       <p>{message}</p>
       <p className='error'> </p>
      
    </form>
 </div>
  )
}

export default Signin