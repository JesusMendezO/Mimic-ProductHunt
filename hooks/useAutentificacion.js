import React, { useEffect, useState } from 'react';
import firebase from '../firebase/index';

function useAutentificacion ()  {
   const [ usuarioAutenticado, guardarUsuarioAutenticado ] = useState(null);

   useEffect(() => {
     const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
         if( usuario ){
            guardarUsuarioAutenticado(usuario);
         } else{
             guardarUsuarioAutenticado(null);
         }
     })  
    
     return () => unsuscribe ()

   }, [])
   return usuarioAutenticado;
}
  
export default useAutentificacion;
