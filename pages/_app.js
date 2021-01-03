import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase/index';
import useAutentificacion from '../hooks/useAutentificacion';

const MyApp = props => {
  const usuario = useAutentificacion();
  const { Component, pageProps} = props;

  return (
    <FirebaseContext.Provider
       value= {{
         firebase,
         usuario
       }}
    >
       <Component {...pageProps} /> 
    </FirebaseContext.Provider>

   
  )
}

export default MyApp;
