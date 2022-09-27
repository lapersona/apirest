const express = require( 'express' );
const router = express.Router();
const fs = require( 'fs' );

const app = express();

const PORT = process.env.PORT || 8080;
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

//Routes
app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/public/index.html' )
});


router.get( '/', ( req, res ) => {
    const read = fs.readFileSync( './productos.txt', 'utf-8' );
    const products = JSON.parse( read );
    res.json( products );
});


router.get( '/:id', ( req, res ) => {
    const id = Number( req.params.id );
    const read = fs.readFileSync( './productos.txt', 'utf-8' );
    const products = JSON.parse( read );

    const product = products.find( prod => prod.id === id );
    if ( product == undefined ){
        res.send({ error: 'Producto no encontrado.' });
    } else {
        res.json( product );
    }
});



router.post( '/', ( req, res ) => {
    const product = req.body;
    const read = fs.readFileSync( './productos.txt', 'utf-8' );
    const products = JSON.parse( read );

    const productsId = products.map( p => p.id );
    product.id = Math.max( ...productsId ) + 1;

    products.push( product );

    fs.writeFileSync( './productos.txt', JSON.stringify( products, null, '\t' ) );
    res.json( product );
});



router.put( '/:id', ( req, res ) => {
    const id = req.params.id;
    const product = req.body;
    product.id = id;
    const read = fs.readFileSync( './productos.txt', 'utf-8' );
    const products = JSON.parse( read );

    const idx = products.findIndex( p => p.id == id );

    if( idx === -1 ){
        res.send( 'El producto a editar no existe.' )
    } else {
        products.splice( idx, 1, product );

        fs.writeFileSync( './productos.txt', JSON.stringify( products, null, '\t' ) );
        res.json( product );
    }
});


router.delete( '/:id', ( req, res ) => {
    const id = req.params.id;
    const read = fs.readFileSync( './productos.txt', 'utf-8' );
    const products = JSON.parse( read );

    const idx = products.findIndex( p => p.id == id );

    if( idx === -1 ){
        res.send( 'El producto a eliminar no existe.' )
    } else {
        products.splice( idx, 1 );

        fs.writeFileSync( './productos.txt', JSON.stringify( products, null, '\t' ) );
        res.json( `Producto eliminado. ID: ${ id }` );
    }
});

//Router
app.use( '/api/productos', router );



const server = app.listen( PORT, () => {
    console.log( `Server PORT: ${ PORT }` );
});
server.on( 'error', err => console.log( 'Error server: ' + err ) );

