"use strict";
require('dotenv').config();
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRoutes = require(__dirname + '/routes/user-routes.js');
const adminRoutes = require(__dirname + '/routes/admin-routes.js');
const adminTpuRoutes = require(__dirname + '/routes/admin-tpu-routes.js');
// Require controllers to callback socket.io for chat purposes
const adminControllers = require(__dirname + '/controllers/admin-controllers.js');
const userControllers = require(__dirname + '/controllers/user-controllers.js');
// const adminControllers = require(__dirname + '/controllers/admin-controllers.js');

app.use(express.json()); // use JSON format
app.use(express.urlencoded({extended: false})); // use express urlencode
app.use(cookieParser()); // using cookie

// Set up view engine, layout and layout path
app.set(path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(expressLayout);

// Development only
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//             res.header('Access-Allow-Method', 'GET');
//     next();
// })

// Executing all socket.io events from controllers
io.on('connection', socket => {
    console.log('get connection from socketio');
    // Sending message event
    adminControllers.message(socket, io);

    // Join or leave user on roomchat
    userControllers.userSocket(socket, io);

    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    })
})

// Routes
app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/admin-tpu', adminTpuRoutes);

// Set up path for bootstrap and asset
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/jquery.js'));
// app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist/popper.js'));
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist/umd/popper.js'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/icons', express.static(__dirname + '/node_modules/bootstrap-icons/icons/'));
app.use('/web-images', express.static(__dirname + '/asset/images/web/'));
// app.use('/kk-ahli-waris', express.static(__dirname + '/asset/images/kk-ahli-waris/'));
// app.use('/ktp-ahli-waris', express.static(__dirname + '/asset/images/ktp-ahli-waris/'));
app.use('/js', express.static(__dirname + '/asset/js'));
app.use('/css', express.static(__dirname + '/asset/css'));
app.use('/gis', express.static(__dirname + '/node_modules/leaflet-routing-machine/dist/'));


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Kuburin Running on port ${PORT}`));

module.exports = app;

// Warna wireframe admin
// -	1. Hex: #00B894
// -	2. Hex: #006266
// -	3. Hex: #DAE8FC (pesan)
// -	4. Hex: #0085FC (pesan)
// -	5. Hex: #6C8EBF (pesan)
// -	6. Hex: #1BA0B2 (dashboard admin/admin TPU)
// 7. Hex: #1CA5B8 (dashboard admin/admin tpu)