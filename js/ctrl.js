'use strict';

angular.module('VUELOS', [])
    .controller('MainCtrl', function ($scope, $http) {

        $http({
            method: 'GET',
            url: 'http://localhost:3000/origen'
        }).then(function successCallback(response) {
            angular.forEach(response.data.data, function (v){
                $scope.uniqueOrigenes.push(v.origen);
            });
        }, function errorCallback(response) {
        });

        $http({
            method: 'GET',
            url: 'http://localhost:3000/destino'
        }).then(function successCallback(response) {
            angular.forEach(response.data.data, function (v){
                $scope.uniqueDestinos.push(v.destino);
            });
        }, function errorCallback(response) {
        });

        var resetVariables = function(){
            $scope.seleccionIda = [];
            $scope.seleccionVuelta = [];
            $scope.seleccionVuelos = [];
        };

        //Funcion que se realiza cuando pulsas el boton de buscar vuelos
        $scope.buscarVuelos = function() {
            resetVariables();
            var selectedOrigen = $scope.origen;
            var selectedDestino = $scope.destino;

            var selectedIda = new Date($scope.fechaIda);
            var selectedVuelta = new Date($scope.fechaVuelta);

            var idas = [];
            var vueltas = [];

            var auxidas = [];
            var auxvueltas = [];

            $http({
                method: 'GET',
                url: 'http://localhost:3000/idavuelta',
                params: {origen: selectedOrigen,
                        destino: selectedDestino}
            }).then(function successCallback(response) {
                idas = Array.from(response.data.data);
                angular.forEach(idas, function (v){
                    if(sameDay(new Date(v.salida), selectedIda)){
                        $scope.seleccionIda.push(v);
                    }
                });
                $http({
                    method: 'GET',
                    url: 'http://localhost:3000/idavuelta',
                    params: {origen: selectedDestino, destino: selectedOrigen}
                }).then(function successCallback(response) {
                    vueltas = Array.from(response.data.data);
                    angular.forEach(vueltas, function (v){
                        if(sameDay(new Date(v.salida),selectedVuelta)) $scope.seleccionVuelta.push(v);
                    });
                    angular.forEach($scope.seleccionIda, function(v) {
                        angular.forEach($scope.seleccionVuelta, function(w) {
                            console.log(v);
                            var idaTabla = new Date(v.salida);
                            var vueltaTabla = new Date(w.salida);
                            var horaIda = (idaTabla.getHours() == 0 ? '00' : idaTabla.getHours()) + ":" + (idaTabla.getMinutes() == 0 ? '00' : idaTabla.getMinutes());
                            var horaVuelta = (vueltaTabla.getHours() == 0 ? '00' : vueltaTabla.getHours()) + ":" + (vueltaTabla.getMinutes() == 0 ? '00' : vueltaTabla.getMinutes());
                            var newArray = [v,w, horaIda, horaVuelta, costo(v,w,1)];
                            $scope.seleccionVuelos.push(newArray);
                        });

                    });
                    if ($scope.seleccionVuelos === undefined || $scope.seleccionVuelos.length == 0) {
                        // array empty or does not exist
                        $scope.noVuelos = true;
                    }else{
                        $scope.noVuelos = false;
                    }
                }, function errorCallback(response) {
                });
            }, function errorCallback(response) {
            });

        };
        $scope.registro_aero = function() {
            var registroid = $scope.idaerolinea;
            var registroname = $scope.nameaerolinea;
            var registropasswd = $scope.passwdaerolinea;

            $http({
                method: 'POST',
                url: 'http://localhost:3000/nuevaaerolinea',
                params: {id: registroid,
                        name: registroname,
                        passwd: registropasswd}
            }).then(function successCallback(response) {
            console.log("Exito");
            location.reload();
            }, function errorCallback(response) {
            });

        };

        //añadir nuevos vuelos
        $scope.addVuelo= function()
        {
            var fechasalida=tfFecha($scope.NuevofechaSalida);
            var fechallegada=tfFecha($scope.NuevofechaLlegada);
            $http({
                method: 'POST',
                url: 'http://localhost:3000/nuevovuelo',
                params: {vuelo: $scope.NuevoidVuelo,
                        origen: $scope.NuevoOrigen,
                        destino: $scope.NuevoDestino,
                        salida: fechasalida,
                        llegada: fechallegada,
                        precio_business: $scope.NuevoprecioBusiness,
                        precio_optima: $scope.NuevoprecioOptima,
                        precio_economy: $scope.NuevoprecioEconomy,
                        plazas_business: $scope.NuevonBusiness,
                        plazas_optima: $scope.NuevonOptima,
                        plazas_economy: $scope.NuevonEconomy}

            }).then(function successCallback(response) {
                console.log("Exito");
                location.reload();
            }, function errorCallback(response) {
            });
        };

        //Convert datetime to json datetime
        function tfFecha(d){
            var json = JSON.stringify(d);
            var dateStr = JSON.parse(json);

            return dateStr;
        }

        $scope.login = function ()
        {
            $scope.vuelosAerolinea = [];
            $http({
                method: 'GET',
                url: 'http://192.168.1.151:3000/login',
                params: {id: $scope.id, passwd: $scope.passwd}
            }).then(function successCallback(response) {
                    $scope.respuestaLogin = response.data.data[0].n;

                if($scope.respuestaLogin == 1)
                {
                    $http({
                        method: 'GET',
                        url: 'http://192.168.1.151:3000/vuelosaerolinea',
                        params: {id: $scope.id}
                    }).then(function successCallback(response) {
                        angular.forEach(response.data.data, function (v){
                            $scope.vuelosAerolinea.push(v);
                        });
                        $scope.reslogin();
                    }, function errorCallback(response) {
                    });
                }
            }, function errorCallback(response) {
            });
        };

        //mostrar vuelos login
        $scope.reslogin = function () {
            var mostrarvuelos = false;
            $scope.haylogin = true;
            $scope.errorlogin  = false;
            if($scope.respuestaLogin  == 0){
                mostrarvuelos = false;
                $scope.noLogin  = true;
                $scope.silogin = true;
            }else if($scope.respuestaLogin  == 1){
                mostrarvuelos = true;
                $scope.silogin = false;
                $scope.noLogin  = false;
            }
            return mostrarvuelos;
        };

        var costo = function (ida, vuelta, numPasajeros ) {
            var coste = [];
            coste[0]= (ida.precio_business + vuelta.precio_business) * numPasajeros;
            coste[1]= (ida.precio_optima + vuelta.precio_optima) * numPasajeros;
            coste[2]= (ida.precio_economy + vuelta.precio_economy) * numPasajeros;
            return coste;
        };

        //Para mostrar los vuelos, depende del numero de pasajeros
        $scope.showTravels = function () {
            var isFilled = false;
            if($scope.nPasajeros > 0){
                isFilled = true;
            }else {
                isFilled = false;
            }
            return isFilled;
        };


        //mostrar resultado compra
        $scope.rescompra = function () {
            var isFilled = false;
            if($scope.resCompra  === undefined || $scope.resCompra.length == 0){
                isFilled = false;
            }else {
                isFilled = true;
            }
            return isFilled;
        };
//consulta reserva
        $scope.consultarReserva = function ()
        {
            $http({
                method: 'GET',
                url: 'http://192.168.1.151:3000/reserva',
                params: {cod_reserva: cod_reserva}
            }).then(function successCallback(response) {
                angular.forEach(response.data.data, function (v){
                    $scope.consultaReserva.push(v);
                });
            }, function errorCallback(response) {
            });
        }
        $scope.resconsulta = function () {
            var isFilled = false;
            if($scope.consultaReserva  === undefined || $scope.consultaReserva.length == 0){
                isFilled = false;
                $scope.noResultados = true;
            }else {
                isFilled = true;

            }
            return isFilled;
        };
        //Funcion de inicio
        var init = function() {
            $scope.uniqueOrigenes = [];
            $scope.uniqueDestinos = [];

            $scope.seleccionIda = [];
            $scope.seleccionVuelta = [];

            $scope.seleccionVuelos = [];

            $scope.consultaReserva = [];
            $scope.respuestaLogin =[];

            $scope.vuelosAerolinea=[];

            $scope.noVuelos = false;
            $scope.noResultados = false;
            $scope.errorlogin = false;
            $scope.haylogin  = true;
        }();

    });


function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}