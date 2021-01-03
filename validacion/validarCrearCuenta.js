export default function validarCrearCuenta(valores){

    let  errores = {};

    //validar le nombre de usuario
    if(!valores.nombre){
        errores.nombre = "EL nombre es Obligatorio";
    }

     //validar el email
     if(!valores.email){
    errores.email = "EL email es Obligatorio";
} else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ) {
    errores.email = "Email no valido"
}

 //validar el password
 if(!valores.password) {
    errores.password = "EL password es Obligatorio";
}else if ( valores.password.length < 6 ) {
    errores.password = "El password debe ser de al menos 6 caracteres";
}

return errores;

} 