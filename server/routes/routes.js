const mysql = require('../config/mysql');
const uuidv4 = require('uuid/v4');

// vigtigt at hente path.
const path = require('path');
const sharp = require('sharp');

// module exports
module.exports = (app) => {

    // Hvis det er dataudtræk som skal gentages, lav en async function, som kaldes nede i routen, se eksempel nederst.
    app.get(['/', '/home'], function(req, res) {

        res.render('home', {
            // "title" : "",
        });

    }); // route slutter

    app.get('/imageupload', function(req, res) {

        res.render('imageeditor', {
            // "title" : "",
        });

    }); // route slutter

    // route til at modtage billeder fra clientsize crop funktionen/upload funktionen
    app.post('/imageupload', async function(req, res, next) {

        let billede = req.files.billede;
        let imageTitle = req.body.title;
        console.log(imageTitle);

         // denne bruges hvis bruger selv vil vælge image file path navent
        // let uploadLocation = path.join(__dirname, '..', '..', 'public', 'IMG', billede.name)

        console.log("imagetitle", imageTitle);
        
        if(billede != undefined && billede.name != "") {
            if(billede.mimetype == 'image/jpg' || billede.mimetype == 'image/png') {
                let filename = 'X-CLIENTSIDE-' + uniqueFilename(billede.mimetype);

                // let uploadLocation = path.join(__dirname, '..', '..', 'public', 'IMG', filename);
                
                // denne bruges hvis bruger selv vil vælge image file path navent
                let uploadLocation = path.join(__dirname, '..', '..', 'public', 'IMG', billede.name)

                let thumbnailLocation = path.join(__dirname, '..', '..', 'public', 'IMG', 'thumbnails', filename);


                //  NB hvis du briger uuiv skal navnet laves til string for at blive sendt til databasen
                imageFilePath = filename.toString();
                billede.mv(uploadLocation, (err) => {
                    // console.log(uploadLocation);
                    res.sendStatus(200);
                    uploadImageToDatabase(imageTitle, imageFilePath);
                })
            }
        }
   
    }); // route slutter

    // funktion som skaber unikt filnavn
    function uniqueFilename(mimetype) {
        let ext = '.txt';

        switch(mimetype) {
            case 'image/jpg' :
                ext = '.jpg';
                break;
            case 'image/png' :
                ext = '.png';
                break;
        }
        return new Date().getTime() + '-' + uuidv4().substring(0,13) + ext;
    } //function slutter

    // ASYNC FUNCTION uploader til database.
    async function uploadImageToDatabase(imagetitle, filepath) {
        console.log(imagetitle, filepath);
        let database = await mysql.connect();
        let standardImageTypeID = 1;
    
        let [sql] = await database.execute(`
        INSERT INTO images 
        (image_name, image_filepath, fk_type_id) 
        VALUES (?,?,?)`
        , [imagetitle, filepath, standardImageTypeID]
        );
    
        database.end();
        return sql;
    } //async function slutter
    

} // module.exports slutter

/* SE NOGLE MERE AVANCEREDE ROUTES HER 
https://github.com/nkarij/the-awesome-newspage-nkarij/blob/master/server/routes/routes.js */




