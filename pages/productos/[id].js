import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase/index';
import Error404 from '../../components/layout/404';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/formulario';
import Boton from '../../components/ui/Boton'

const ConetenedorProducto= styled.div`
@media (min-width:768px){
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 2rem;
}
`
const P = styled.p`
 text-align: center;
`;

const Div = styled.div`
margin-top:5rem;
`;

const CreadorProducto = styled.p`
  padding: .5rem 2rem;
  background-color: #DA552F;
  color: #fff;
  text-transform: uppercase;
  font-weight:bold;
  display: inline-block;
  text-align: center;
`

const Producto = () => {

    //state del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState (false);
    const [comentario, guardarComentario ] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);

    //Routing para obtener el id actual
    const router = useRouter();
    const {query: { id }} = router;

    //context firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarDB ) {
           const obtenerProducto = async () => {
              const productoQuery = await firebase.db.collection('productos').doc(id);
              const producto = await productoQuery.get();
              if(producto.exists) {
                guardarProducto( producto.data() );
                guardarConsultarDB(false);
              } else {
                  guardarError( true);
                  guardarConsultarDB(false);
        }
     } 
     obtenerProducto();
    } 
     
      }, [id]);

      if(Object.keys(producto).length === 0 && !error) return 'Cargando...';
      const {  comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;
  
      //Administrar y validar los votos
      const votarProducto = () => {
        if(!usuario) {
          return router.push('/login')
        }
        
        // obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return

        //guardar el ID del usuario que ha votado
        const nuevoHavotado = [...haVotado, usuario.uid];
        
        //Actualizar en la BD
        firebase.db.collection('productos').doc(id).update({ votos: nuevoTotal, haVotado: nuevoHavotado});

        //Actualizar en el state
        guardarProducto({
          ...producto,
          votos: nuevoTotal
        })
        guardarConsultarDB(true); //hay un voto, se consulta a la BD
      }

     //Funciones para crear comentarios
     const comentarioChange = e => {
       guardarComentario({
        ...comentario,
        [e.target.name] : e.target.value
       })
     }

     //Identifica si el comentario es del creador del producto
     const esCreador = id => {
      if(creador.id == id) {
        return true;
      }
     }

     const agregarComentario = e => {
       e.preventDefault();

       if(!usuario) {
         return router.push('/login')
       }
       //informacion extra al comentario
       comentario.usuarioId = usuario.uid;
       comentario.usuarioNombre = usuario.displayName;

       //tomar copia de comentarios y agregarlos al arreglo
       const nuevosComentarios = [...comentarios, comentario];

       //Actualizar la BD
       firebase.db.collection('productos').doc(id).update({ comentarios: nuevosComentarios});

       //Actualziar el State
       guardarProducto({
         ...producto,
         comentarios: nuevosComentarios
       })
       guardarConsultarDB(true); //hay un comentario, se consulta a la BD
     }

     //funcion que revisa que el creador del producto sea el mismo que esta autenticado
     const puedeBorrar = () => {
       if(!usuario) return false;

       if(creador.id === usuario.uid) {
         return true
       }
     }
     
     //Eleimina un producto de la bd
    const eliminarProducto = async () => {
      if(!usuario) {
        return router.push('/login')
      }
      if(creador.id !== usuario.uid) {
        return router.push('/login')
    }
      try {
     
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
     
       } catch (error) {
        console.log(error);
      }
    }

    return (  
        <Layout>
          <>
          { error ? <Error404 /> : (
            <div className="contenedor">
            <h1>{nombre}</h1>
            <style jsx>{`

             h1 {
             text-align: center;
              margin-top: 5rem;
              }
             h2 {
              margin: 2rem 0;
              }
              li{
                border: 1px solid #e1e1e1;
                padding: 2rem;
              }
              span{
                font-weight:bold;
              }
             
          `}</style>
          <ConetenedorProducto>
              <div>
              <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} )} </p>
              <p>Por: {creador.nombre} de {empresa}</p>
              <img src={urlimagen} />
              <p>{descripcion}</p>
              
              { usuario && (<> <h2>Agrega tu comentario</h2>
              <form 
                onSubmit={agregarComentario}
              >
                <Campo>
                  <input
                     type="text"
                     name="mensaje"
                     onChange={comentarioChange}
                  />
                  </Campo>
                  <InputSubmit
                      type="submit"
                      value="Agregar Comentario"
                      
                  />
                
              </form>
              </>
              )}

              <h2>Comentarios</h2>

            {comentarios.length === 0 ? 'Aun no hay comentarios':
            (
              <ul>
              {comentarios.map((comentario, i )=>(
                <li
                  key={`${comentario.usuarioId}-${i}`}
                >
                   <p>{comentario.mensaje}</p>
                   <p>Escrito por: {''} <span>{comentario.usuarioNombre}</span></p>
                   { esCreador( comentario.usuarioId ) && <CreadorProducto>Es Creador</CreadorProducto> }
                </li>
              )) }
              </ul>
            )}
             
            </div>
            <aside>
            <Boton
               target="_blank"
               bgColor="true"
               href={url}
            >Visitar URL</Boton>

            
            <Div> 
              <P>{votos} Votos</P>
            {usuario && (
              <Boton
                 onClick={votarProducto}
              >
              Votar
            </Boton>
            )}
            </Div>
            </aside>
            </ConetenedorProducto>
             { puedeBorrar() &&
               <Boton
                  onClick={eliminarProducto}
               >Eliminar Producto</Boton>
             }

          </div>
          ) }
          
          </>
          </Layout>

    );
    
}
 
export default Producto;
