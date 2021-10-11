import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';
import './App.css';
import initializeFirebaseAuthentication from "./Firebase/firebase.initialize";

initializeFirebaseAuthentication();

const googleProvider = new GoogleAuthProvider();

function App () {
  const auth = getAuth();
  const [ name, setName ] = useState( '' );
  const [ email, setEmail ] = useState( '' );
  const [ password, setPassword ] = useState( '' );
  const [ error, setError ] = useState( '' );
  const [ isLogin, setIsLogin ] = useState( false );

  const emailInputFieldChange = e => {
    setEmail( e.target.value );
  }

  const passwordInputFieldChange = e => {
    setPassword( e.target.value );
  }

  const nameInputFieldChange = ( e ) => {
    setName( e.target.value );
  }

  const handleGoogleAuthentication = () => {
    signInWithPopup( auth, googleProvider )
      .then( result => {
        const user = result.user;
        console.log( user );
      } );
  }

  const verifyEmail = () => {
    sendEmailVerification( auth.currentUser )
      .then( result => {
        console.log( result );
      } )
  }

  const registerNewUser = ( email, password ) => {
    createUserWithEmailAndPassword( auth, email, password )
      .then( result => {
        setError( '' );
        console.log( email, password );
        const user = result.user;
        console.log( user );
        setError( '' );
        verifyEmail();
        setUserName();
      } )
      .catch( error => {
        setError( error.message );
      } );
  }

  const processLogin = ( email, password ) => {
    signInWithEmailAndPassword( auth, email, password )
      .then( result => {
        const user = result.user;
        setError( '' );
        console.log( user );
      } )
      .catch( error => {
        setError( error.message );
      } );
  }

  const setUserName = () => {
    updateProfile( auth.currentUser, { displayName: name } )
      .then( result => { } )
  }

  const handleRegister = e => {
    e.preventDefault();
    if ( password.length < 6 ) {
      setError( 'Password must be at least 6 characters long' );
      return;
    }

    else if ( !/(?=.*[A-Z].*[A-Z])/.test( password ) ) {
      setError( 'Ensure string has two uppercase letters' );
      return;
    }

    else {
      isLogin ? processLogin( email, password ) : registerNewUser( email, password );
    }
  }

  const toggleLogin = e => {
    setIsLogin( e.target.checked );
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail( auth, email )
      .then( result => {
        setError( 'Password reset mail sent' );
      } )
  }


  return (
    <div className="container mt-5">
      <form onSubmit={ handleRegister }>
        <h3 className="text-primary">Please { isLogin ? 'Login' : 'Register' }</h3>
        {
          !isLogin && <div className="row mb-3">
            <label htmlFor="inputAddress" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input onBlur={ nameInputFieldChange } type="text" className="form-control" placeholder="Your Name" />
            </div>
          </div>
        }
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={ emailInputFieldChange } type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label" required>Password</label>
          <div className="col-sm-10">
            <input onBlur={ passwordInputFieldChange } type="password" className="form-control" id="inputPassword3" />
          </div>
        </div><div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={ toggleLogin } className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <button onClick={ handleRegister } type="submit" className="btn btn-primary"> { isLogin ? 'Login' : 'Register' } With Email</button>
        <button onClick={ handleResetPassword } type="button" className="btn btn-secondary btn-sm ms-2">Reset Password</button>
      </form>
      <button onClick={ handleGoogleAuthentication } className="mt-2 btn btn-primary"> { isLogin ? 'Login' : 'Register' } With Google</button>
      <div className="row mt-3 text-danger">{ error }</div>
    </div>
  );
}

export default App;