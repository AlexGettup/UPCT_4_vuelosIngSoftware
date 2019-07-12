var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended: true
 }));
 
 // Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

  // default route
 app.get('/', function (req, res) {
     return res.send({ error: false, message: 'Bienvenido al servidor REST API' })
 });

 
 //// connection configurations
 var db = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'ingsoftware'
 });
 // connect to database
 db.connect(); 
 

 // Retrieve all distict origen 
app.get('/origen', function (req, res) {
    db.query('SELECT DISTINCT origen FROM vuelos', function (error, results, fields) {
        if (error) throw error;
		console.log("ORIGEN");
        return res.send({ error: false, data: results, message: 'ORIGEN' });
    });
});

 // Retrieve all distict destino 
app.get('/destino', function (req, res) {
    db.query('SELECT DISTINCT destino FROM vuelos', function (error, results, fields) {
        if (error) throw error;
		console.log("DESTINO");
        return res.send({ error: false, data: results, message: 'DESTINO.' });
    });
});

 // Retrieve idas y vueltas
app.get('/idavuelta', function (req, res) {
	
	let origen = req.query.origen;
	let destino = req.query.destino;
	
    db.query('SELECT * FROM vuelos WHERE origen=? AND destino=?',[origen, destino], function (error, results, fields) {
        if (error) throw error;
		console.log("IDAVUELTA");
        return res.send({ error: false, data: results, message: 'IDAVUELTA' });
    });
});


// Add a new compra  
app.post('/compra', function (req, res) {
  
	let fecha_vuelo = req.query.fecha_vuelo;
	let vuelo = req.query.fecha;
	let salida = req.query.salida;
	let npas_business = req.query.npas_business;
	let npas_optima = req.query.npas_optima;
	let npas_economy = req.query.npas_economy;
  
  
    db.query(" INSERT INTO compras (fecha_compra, fecha_vuelo, vuelo, salida, npas_businnes , npas_optima, npas_economy) VALUES (CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?);", [fecha_vuelo, vuelo, salida, npas_business, npas_optima, npas_economy], function (error, results, fields) {
        if (error) throw error;
		console.log("COMPRA");
        return res.send({ error: false, data: results, message: 'COMPRA' });
    });
});

//  Update numplazas of vuelo
app.put('/numplazas', function (req, res) {
  
    let tipoPlaza = req.query.tipoPlaza;
    let numeroPlazas = req.query.numeroPlazas;
	let idVuelo = req.query.idVuelo;

  
    db.query("UPDATE vuelos SET ? = ? WHERE vuelo=?", [user, user_id], function (error, results, fields) {
        if (error) throw error;
		console.log("NUMPLAZAS");
        return res.send({ error: false, data: results, message: 'NUMPLAZAS' });
    });
});

 // Retrieve reservas
app.get('/reserva', function (req, res) {
	
	let cod_reserva = req.query.cod_reserva;

	
    db.query('SELECT * FROM compras WHERE cod_reserva=?',[cod_reserva], function (error, results, fields) {
        if (error) throw error;
		console.log("RESERVA");
        return res.send({ error: false, data: results, message: 'RESERVA' });
    });
});

 // Retrieve login
app.get('/login', function (req, res) {
	
	let id = req.query.id;
	let passwd = req.query.passwd;

	
    db.query('SELECT COUNT(id) as n FROM aerolineas WHERE id=? AND passwd = ?',[id, passwd], function (error, results, fields) {
        if (error) throw error;
		console.log("LOGIN");
        return res.send({ error: false, data: results, message: 'LOGIN' });
    });
});

// Add a new aerolinea  
app.post('/nuevaaerolinea', function (req, res) {
  
	let id = req.query.id;
	let name = req.query.name;
	let passwd = req.query.passwd;
  
  
    db.query("INSERT INTO aerolineas(id,name,passwd) VALUES (?,?,?)", [id, name, passwd], function (error, results, fields) {
        if (error) throw error;
		console.log("NUEVAAEROLINEA");
        return res.send({ error: false, data: results, message: 'NUEVAAEROLINEA' });
    });
});

 // Retrieve vuelos de aerolinea
app.get('/vuelosaerolinea', function (req, res) {
	
	let id = req.query.id;

	
    db.query('SELECT * FROM vuelos WHERE vuelo LIKE ?', id + '%', function (error, results, fields) {
        if (error) throw error;
		console.log("VUELOSAEROLINEA");
        return res.send({ error: false, data: results, message: 'VUELOSAEROLINEA' });
    });
});

// Add a new vuelo  
app.post('/nuevovuelo', function (req, res) {
  
	let vuelo = req.query.vuelo;
	let origen = req.query.origen;
	let destino = req.query.destino;
  	let salida = req.query.salida;
	let llegada = req.query.llegada;
	let precio_business = req.query.precio_business;
	let precio_optima = req.query.precio_optima;
	let precio_economy = req.query.precio_economy;
	let plazas_business = req.query.plazas_business;
  	let plazas_optima = req.query.plazas_optima;
	let plazas_economy = req.query.plazas_economy;
	
    db.query("INSERT INTO vuelos (vuelo,origen,destino,salida,llegada,precio_business,precio_optima,precio_economy,plazas_business, plazas_optima, plazas_economy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [vuelo, origen, destino, salida, llegada, precio_business,precio_optima,precio_economy,plazas_business,plazas_optima,plazas_economy], function (error, results, fields) {
        if (error) throw error;
		console.log("NUEVOVUELO");
        return res.send({ error: false, data: results, message: 'NUEVOVUELO' });
    });
});

// Add a new vuelo  
app.post('/pasajeros', function (req, res) {
  
	let numero = req.query.numero;
	let nombre = req.query.nombre;
  	let apellidos = req.query.apellidos;
	
    db.query("INSERT INTO pasajeros (numero,nombre,apellidos) VALUES (?,?,?)", [numero, nombre, apellidos], function (error, results, fields) {
        if (error) throw error;
		console.log("PASAJEROS");
        return res.send({ error: false, data: results, message: 'PASAJEROS' });
    });
});

 // set port
 app.listen(3000, function () {
     console.log('Node app is running on port 3000');
 });
 module.exports = app;