export default function validarCrearCuentas(valores){

    let  errores = {};

    //validar le nombre de usuario
    if(!valores.nombre){
        errores.nombre = "EL nombre es Obligatorio";
    }

     //validar empresa 
     if(!valores.empresa){
    errores.empresa = "Nombre de Empresa es obligatorio";
   } 
//validar url
 if(!valores.url) {
    errores.url = "La url del producto es obligatoria";
}else if ( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) 
{     errores.url = "URL mal formateada o no valida";
}

 //validar descripcion
 if(!valores.descripcion){
     errores.descripcion = "Agrega una descripcion de tu Producto";
    } 
return errores;

} 