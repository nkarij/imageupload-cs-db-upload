// hent input element
let fileInputElement = document.querySelector(".fileinput")
// hent preview element
const previewElement = document.querySelector(".preview");
// kald et filereader objekt
let fileReader = new FileReader();
let clickCount = 0;
// opret et objekt som kan modtage coordinates.
let coords = {};
// clear coordinates når siden åbner
clearCoords();
// "globale variabler"
let buttonClearCrop;
let buttonSubmit;
let point;
let boundingBox;
let canvasElement;



// når der hentes en fil (on change)
fileInputElement.addEventListener('change', function (event) {
    // console.log("inde i fileinput-element")
    clearCoords();

    // hent den første fil med index 0
    let file = fileInputElement.files[0];
    // console.log(file);

    // når filereader er færdig med at indlæse filen, loades den til preview
    // filereader objektet har en onload function til dette.
    fileReader.onload = function() {
        previewElement.src = fileReader.result;
    }

    // når filereaderen læser billedet, skal det læses som DATAURL
    if(file) {
        fileReader.readAsDataURL(file);
    }

}) // det hele slutter.
    
// knyt clickevents til previewet.
previewElement.addEventListener('click', (event) => {
        // fjern punkt1, hvis det eksisterer i DOM
        point = document.querySelector(".point1");
        
        if(point != undefined) {
            point.remove();
        }

        switch(clickCount) {
            // første klik
            case 0:
                // console.log("case 0")
                // codeblock;
                coords.punkt1.x = event.offsetX;
                coords.punkt1.y = event.offsetY;
                // indsæt det første punkt iDOM

                point = document.createElement("div");
                point.className = "point1";
                point.style.top = coords.punkt1.y + 'px';
                point.style.left = coords.punkt1.x + 'px';
                document.querySelector(".preview-container").appendChild(point);
                break;
            case 1:
                coords.punkt2.x = event.offsetX;
                coords.punkt2.y = event.offsetY;
                // console.log("case 1");
                break;
            default:
                clickCount = 0;
                let box = document.querySelector(".bounding-box");
                if(box != undefined) {
                    box.remove();
                }
        }

        clickCount++;
    

        // punkterne skal altid have point1 som det mindste tal
        if((coords.punkt2.x != null && coords.punkt1.x > coords.punkt2.x)) {
            let tempx = coords.punkt1.x;
            coords.punkt1.x = coords.punkt2.x;
            coords.punkt2.x = tempx;
        }

        if((coords.punkt2.y != null && coords.punkt1.y > coords.punkt2.y)) {
            let tempy = coords.punkt1.y;
            coords.punkt1.y = coords.punkt2.y;
            coords.punkt2.y = tempy;
        }

        // hvis clickcount == 2, skal boundingBox vises op preview
        if(clickCount == 2){
            drawBoundingBox();
            previewCroppedImage();
            // console.log(coords.punkt2.x)
        }
    })

// knyt clickevents til clearcrop button
buttonClearCrop = document.querySelector("#clear-preview");
buttonClearCrop.addEventListener('click', function(e){
    e.preventDefault();
    clearPreview();
});

// knyt clickevent til button submit
buttonSubmit = document.querySelector("#submit-image");
buttonSubmit.addEventListener('click', function(event){
    console.log("buttonsubmit")
    event.preventDefault();
    // upload skal kun ske hvis der eksisterer en fil i filereader
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readyState
    // find selv på en måde at sikre et crop preview. Måske sætte privewCroppedImage = true; eller blot genbekræfte clickcount.
    if(fileReader.readyState == 2 && clickCount == 2){
        console.log("filereader", fileReader)
        crop();
    }

})


// ----------- HJÆLPE FUNKTIONER ---------------------------

// funktion som clearer coordinaterne (coords)


// tager sig af at lave boundingbox 
function drawBoundingBox(){
    boundingBox = document.querySelector(".bounding-box");
    if(boundingBox == undefined) {
        boundingBox = document.createElement("div");
        boundingBox.className = "bounding-box";

        // top + left placeringen er lig punkt1s koordinater
        boundingBox.style.top = coords.punkt1.y + 'px';
        boundingBox.style.left = coords.punkt1.x + 'px';

        // og størrelsen er forskellen mellem punkt1 og punkt2
        boundingBox.style.width = (coords.punkt2.x - coords.punkt1.x) + 'px';
        boundingBox.style.height = (coords.punkt2.y - coords.punkt1.y) + 'px';

        // append til preview container, husk at der bruges position til begge elementer
        document.querySelector(".preview-container").appendChild(boundingBox);

        // knyt draggable funktionalitet til boundingBox
        boundingBox.draggable = true;
        dragElement(boundingBox);
    }

    buttonClearCrop.disabled = false;

}

// vis det valgte crop i crop-preview
function previewCroppedImage(){

    let image = document.querySelector(".preview");

    let values = calculateSizes();
    // console.log(values);
    canvasElement = document.querySelector('.preview-crop');

    // specificer størrelsen på canvas udfra de beregnede værdier (cropPreview)
    canvasElement.width = values.cropPreviewWidth;
    canvasElement.height = values.cropPreviewHeight;
    // console.log(canvasElement);

    // specificer dimension på canvas
    let context = canvasElement.getContext("2d");
    // brug metoden drawImage til at indlæse billedet i canvas (i previews str)
    // drawImage(kilde, sourceX, sourceY, sourceX, sourceY, destinationX, destinationY, destinationWidth, destinationHeight)
    context.drawImage(image, values.cropStartX, values.cropStartY, values.cropWidth, values.cropHeight, 0, 0, values.cropPreviewWidth, values.cropPreviewHeight);

}
// udregner størrelserne baseret på forhåndsvisningen og originalen
function calculateSizes(){
    let preview = document.querySelector(".preview");

    let v = {}
    // beregn forholdstallet
    v.scale = preview.naturalHeight / preview.height;
    // console.log(v.scale);
    // find højde og bredde på det croppede billede ud fra punkterne
    v.cropPreviewWidth = Math.round(coords.punkt2.x - coords.punkt1.x);
    v.cropPreviewHeight = Math.round(coords.punkt2.y - coords.punkt1.y);

    // beregn startpunkter til crop
    v.cropStartX = Math.round(coords.punkt1.x * v.scale);
    v.cropStartY = Math.round(coords.punkt1.y * v.scale);

    // beregn den faktiske størrelse på det croppede billede
    v.cropWidth = Math.round(v.cropPreviewWidth * v.scale);
    v.cropHeight = Math.round(v.cropPreviewHeight * v.scale);
    return v;
}

// nulstiller crop og boundingBox og punkt, men fjerner ikke det valgte billede.
function clearPreview(){

    // fjern punkt1, hvis den eksisterer.
    if(point != undefined){
        point.remove();
    }

    // fjern boundingBox, hvis den eksisterer.
    if(boundingBox != undefined) {
        boundingBox.remove();
    }

    // fjern forhåndsvisningen/crop canvas, hvis det eksisterer
    if(canvasElement != undefined) {
        // når vi benytter os af getContext, får vi også metoden clearRect(angle)
        let context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height)
    }

    // slå nulstilknappen fra:
    if(buttonClearCrop != undefined) {
        buttonClearCrop.disabled = true;
    }
    
    // afslut med at nulstille coordinates (coords);
    clearCoords();

}


// crop
function crop() {
    // get values from function
    let v = calculateSizes();
    console.log("inside crop", v);

    // størrelserne skal være de faktiske størrelser, ikke previews
    canvasElement.width = v.cropWidth;
    canvasElement.height = v.cropHeight;

    // indsæt den ønskede det af billedet i canvas, husk at der skal ikke være 
    // preview størrelser denne gang.
    let context = canvasElement.getContext("2d");
    context.drawImage(previewElement, v.cropStartX, v.cropStartY, v.cropWidth, v.cropHeight, 0, 0, v.cropWidth, v.cropHeight);

    // træk det nye billede ud af canvas som en Datastreng vil kan arbejde med
    let dataURL = canvasElement.toDataURL();
    // console.log(dataURL);

    // konverter canvas data til en "blob" som kan sendes via en form til serveren.
    // dette er i bund og grund det samme som en input type file gør bag maskinhjelmen.
    // men her kommer billeddata fra canvas dataurl, og den skal forberedes til upload
    // "atob" decoder denne base64 streng
    let blobBin = atob(dataURL.split(',')[1]);
    let array = [];
    for (let i = 0; i < blobBin.length; i++) {
        // skaf unicode karakteren på placering(i)
        array.push(blobBin.charCodeAt(i));   
    }

    // gem billedet som png for at undgår for meget komprimering. Det kunne også være jpg.
    let croppedImage = new Blob([new Uint8Array(array)], {
        type : 'image/png'
    })

    uploadFile(croppedImage);
}

function uploadFile(croppedimage) {
    // ryd evt tidligere succes-beskeder
    console.log("cropped", croppedimage)
    document.querySelector(".return-message").innerHTML = "";

    // opret en instans af formData objektet, tilføj filen 'billede, som svarer til et name i et formelement
    let formData = new FormData();
    formData.append('billede', croppedimage)

    // dette kan tilføjes hvis der skal sendes tekst og andre formfelter med sammen med uploaden. VIRKER IKKE, MEN FIXET I ROUTEN.
    // NB forudætter her at der findes et felt med name = titel.
    let form = document.querySelector('#formular');
    formData.append('titel', form.imagetitle.value);

    // benyt fetch() til at sende filen til serveren via POST method
    //
    fetch('/upload', {
        method : 'POST',
        // mode cors er nødvendig hvis domæne/port mellem browser og server er forskellige
        mode : 'cors',
        // sender til bodyparser? eller files?
        body : formData
    }).then(response => {
        if(response.status === 200)
        // skriv succesbesked, kunne også være window.location.replace;
        // console.log("succes");
        document.querySelector(".return-message").innerHTML = "Succes";
    })
    .catch(error => console.log(error));

}


function clearCoords(){
    clickCount = 0;

    coords = {
        punkt1 : {
            x: null,
            y: null
        },
        punkt2 : {
            x: null,
            y: null
        }
    };
}





