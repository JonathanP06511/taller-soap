const express = require('express');
const soap = require('soap');

const app = express();
const port = process.env.PORT || 3000; 
// URL del servicio web SOAP para obtener información sobre países
const url = 'http://www.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Ruta para manejar la solicitud de información sobre un país
app.get('/country', (req, res) => {
    const countryCode = req.query.code;
    console.log(`Solicitud de información sobre el país con código: ${countryCode}`);

    if (!countryCode) {
        res.status(400).send('Falta el parámetro countryCode');
        return;
    }

    getCountryInfo(countryCode, (err, result) => {
        if (err) {
            console.error('Error en la obtención de información del país:', err);
            res.status(500).send('Error en la obtención de información del país.');
        } else {
            res.json(result);
        }
    });
});

// Función para obtener información sobre un país
function getCountryInfo(countryCode, callback) {
    soap.createClient(url, (err, client) => {
        if (err) {
            console.error('Error al crear el cliente SOAP:', err);
            callback(err);
            return;
        }
        console.log('Cliente SOAP creado con éxito.');

        const args = { sCountryISOCode: countryCode };
        client.FullCountryInfo(args, (err, result) => {
            if (err) {
                console.error('Error al llamar al servicio SOAP:', err);
                callback(err);
                return;
            }
            console.log('Respuesta del servicio SOAP:', result);
            callback(null, result);
        });
    });
}

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
