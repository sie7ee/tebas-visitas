/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require('http');

function initServer(){
      
      http.createServer(function(request, response){
            
            console.log('Peticion recibida ;)');
            
            response.writeHead(200, {
                  'Content-Type':'text/html'
            });
            response.write("Hola mundo");
            response.end();
      }).listen(8888);
}

exports.initServer = initServer;
