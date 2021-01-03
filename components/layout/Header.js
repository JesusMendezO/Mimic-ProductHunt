import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Buscar from '../ui/Buscar';
import Navegacion from '../layout/Navegacion';
import Link from 'next/link';
import Boton from '../ui/Boton';
import { FirebaseContext } from '../../firebase/index';

const ContenedorHeader = styled.div`
     max-width: 1200px;
     width: 95%;
     margin: 0 auto;
     @media (min-width: 768px){
         display: flex;
         justify-content: space-between;
     }
`;

const Logo = styled.a`
     color: var(--naranja);
     font-size: 4rem;
     line-height: 0;
     font-weight: 700;
     font-family: 'Roboto Slab', serif;
     margin-right: 2rem;
`;

const Header = () => {

    const { usuario, firebase }   = useContext(FirebaseContext);
   
    return (  
        <header>
       
            <ContenedorHeader >
                <div>
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                    

                    <Buscar />

                    <Navegacion /> 

                    <style jsx>{`
            
                       div {
                       display: flex;
                       align-items: center;
                       }
            
                    `}</style>
                </div>
                <div>
                    { usuario ? (
                <>
                    <p>Hola: {usuario.displayName}</p>
                    <Boton
                    bgColor="true"
                    onClick={() => firebase.cerrarSesion() }
                    > Cerrar Sesion </Boton>
                   </>
                    ): (
                     <>
                     <Link href="/login">
                        <Boton
                          bgColor="true"
                        >Login</Boton> 
                    </Link>
                    <Link href="/crear-cuenta">
                        <Boton>Crear Cuenta</Boton>
                    </Link>
                     </>

                    )}
                   


           <style jsx>{`
              p {
            margin-right : 2rem;
              }
              div {
            display: flex;
            align-items: center;
               }
            header{
                border-bottom: 2px solid var(--gris3);
                padding: 1rem 0;
            }
            `}</style>


                    
                    
                </div>
            </ContenedorHeader >
        </header>
    );
}
 
export default Header;