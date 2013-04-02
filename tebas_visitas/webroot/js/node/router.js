/**
 * Funcion route se encarga de mandar llamar la llamada a la funcion que quiere realiar el usuario
 */
function route(handle, pathname, request, response){
      
      console.log("ruteando ->" + pathname);
      
      // probamos si la funcion existe si es asi la mandamos llamar si no mandamos un mensaje de error
      if(typeof handle[pathname] === 'function'){
            handle['pathname'](request, response);
      } else {
            console.log("Error nose encontro en handler para ->" + pathname);
            response.writeHeader(404, {'Content-Type':'text/html'});
            response.write("Pagina no encontrada");
            response.end();
      }
}

exports.route = route;