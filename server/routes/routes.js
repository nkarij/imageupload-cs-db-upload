// // NEDENSTÅENDE ER TAGET FRA SERVER SIDE UPLOADER...
const mysql = require('../config/mysql');

// vigtigt at hente path.
const path = require('path');
// Version 4 (random names):
const uuidv4 = require('uuid/v4');

// skaber et unikt navn og billedtype
function createUniqueFileName(mimetype){
    let ext = '.txt'
    switch(mimetype){
        case 'image/jpg':
            ext = '.jpg';
            break;
        case 'image/png':
            ext = '.png';
            break;
    }
    return new Date().getTime() + '-' + uuidv4().substring(0,13) + ext;
}

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


    app.post('/upload', async function(req, res) {

        // HVORDAN GØR JEG DENNE OPTIONAL????
        // let imageName = req.body.imagetitle;
        // NB billede er en reference til fetchen
        let image = req.files.billede;
        let imageTitle = req.body.titel;
        // console.log("billede", image);
        // res.send(image);

        if((image != 'undefined') && (imageTitle != 'undefined')){
            if(image.mimetype == 'image/jpg' || image.mimetype == 'image/png') {
                let filename = 'X-clientside' + createUniqueFileName(image.mimetype);
                // console.log(filename);
                // denne bruges ved unikke filnavne
                let uploadLocation = path.join(__dirname, '..', '..', 'public', 'IMG', filename);
                // denne bruges ved unikke filnavne
                let thumbnailLocation = path.join(__dirname, '..', '..', 'public', 'IMG', 'thumbnails', filename);

                //  NB hvis du briger uuiv skal navnet laves til string for at blive sendt til databasen
                //  imageFilePath = imageFilePath(filename).toString();

                // denne bruges hvis bruger selv vil vælge image file path navent
                // let uploadLocation = path.join(__dirname, '..', '..', 'public', 'IMG', imageTitle)

                // denne bruges hvis bruger selv vil vælge image file path navent
                // let thumbnailLocation = path.join(__dirname, '..', '..', 'public', 'IMG', 'thumbnails', imageTitle);

                image.mv(uploadLocation, (err) => {
                    // console.log(uploadLocation);
                    res.sendStatus(200)
                    uploadImageToDatabase(imageTitle, filename)
                })
                image.mv(thumbnailLocation, (err) => {
                    // console.log(uploadLocation);
                    // res.sendStatus(200)
                })
            }

        }
                
    }); // route slutter


    // ASYNC FUNCTIONS
    async function uploadImageToDatabase(imagetitle, imagefilepath) {
        let database = await mysql.connect();
        let standardImageTypeID = 1;
    
        let [sql] = await database.execute(`
        INSERT INTO images 
        (image_name, image_filepath, fk_type_id) 
        VALUES (?,?,?)`
        , [imagetitle, imagefilepath, standardImageTypeID]
        );
    
        database.end();
        return sql;
    }
    

} // module.exports slutter

/* SE NOGLE MERE AVANCEREDE ROUTES HER 
https://github.com/nkarij/the-awesome-newspage-nkarij/blob/master/server/routes/routes.js */






/* SE NOGLE MERE AVANCEREDE ROUTES HER 
https://github.com/nkarij/the-awesome-newspage-nkarij/blob/master/server/routes/routes.js */




