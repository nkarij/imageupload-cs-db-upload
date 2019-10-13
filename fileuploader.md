# FAG Programmering, Billeder

## Indhold:

1) serverside billeduploader

Vi skal oprette en server, som modtager et billede via en formular.

2) Efter upload skal man fx kunne trykke på billedet og forstørre det.

3) Noter:
Module: express-fileupload:
Når man submitter en formular, og laver en upload-route, kan vi modtage dokumentet/billedet via req.files

Dvs. req.files.upload1, req.files.upload2
upload1 = name-attributten på input-feltet.

Formularens html skal have en ny attribut <form enctype="multipart/formdata"></form>. Ellers så vil billedet ikke blive sendt med.
Der skal være en input type="file".

i routen kan man bruge en mv-metode, fx billede.mv()
Move-metoden flytter billedet til en mappe.

## UPLOAD TIL SERVER/MAPP

Formularen skal tilføjes en ny attribut <form enctype="multipart/formdata"></form>. 
Der skal stadig være method="post" for at sende til app.post
Der skal være et input type="file".

1) installer fileuploader modul

2) i app.js: require fileuploader modul
3) i app.js: 
    limit skal knyttes til fileiploaderen (se modulets dokumentation).
    app.use(fileuploader modul({
        filsize sættes fx til 10mb (10 * 1024 *1024)
    }))

3A) hvis du skal bruge noget tekstinput, fx en titel til billedet, så skal req.body kaldes først i din route???

4) submit formularen til din app.post-route:

5) Validering inden insert to database.
Husk at tjekke om din variabel indeholder info: billed != 'undefined' && billede.name != "

6) Mappevalidering, som sørger for at det fungerer på alle styresystemer

    require('path') - skal ikke installeres, skrives øverst i din routefil.

    let upload_location = path.join(__dirname, '..', '..', 'public', 'IMG', billed.name)
    __dirname = den mappe man allerede står i. 
    '..' = jeg skal et skridt tilbage
    'public' = publicmappen osv.

billede.mv(upload_location, (err) => {
    <!-- callback function når billedet er flyttet til serveren -->
    <!-- her kan vi fx skalere billedet -->
})

## SCALERING MED SHARP#
1) Lave en resize function med 2 værdier med Sharp#
NB! Der bliver brugt python, så evt skal Python installeres i VSC.

2) installer sharp#: npm install sharp --save

3) sådan ca ser koden ud:
sharp(fillocation).resize(breddePX, højdePX).tofile(targetlocation).then((data) =>{ console.log(data)}) 

## UNIKKE NAVNE TIL BILLEDERNE