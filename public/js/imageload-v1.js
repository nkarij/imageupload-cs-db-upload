

// IMAGE LOAD TO PREVIEw
// https://www.youtube.com/watch?v=d5j8HFzflgY&t=585s

// hent dit input element
let fileInputElement = document.querySelector(".fileinput")
// hent dit preview element
let previewElement = document.querySelector(".preview");
// kald et filereader objekt
let fileReader = new FileReader();

// når der hentes en fil (on change)
fileInputElement.addEventListener('change', function (event) {

    // hent den første fil med index 0
    let file = fileInputElement.files[0];

    let clickCount = 0;

    let coords = {
        punkt1 : {
            x: Null,
            y: Null
        },
        punkt2 : {
            x: Null,
            y: Null
        }
    };

    // når filereader er færdig med at indlæse filen, loades den
    // filereader objektet har en onload function til dette.
    fileReader.onload = function() {
        previewElement.src = fileReader.result;

        // CROP BILLEDE, sker inde i onload function
        // https://www.youtube.com/watch?v=7LHxtZ0uiGA
        // vi skal bruge et nyt image tag, for at kunne håndtere data i hukkommelsen
        let image = new Image();
        // source sættes lig filereaders
        image.src = fileReader.result;
        console.log(image.src);
        // når billeddata indlæses skal det sendes til canvas, lav eventlistener
        // image tagget har også onload metoden.
        image.onload = function(){
            // hent canvas
            let canvasElement = document.querySelector('.preview-crop');
            // sæt bredde og højde lig med det originale previews
            // let previewStyles = window.getComputedStyle(previewElement);
            canvasElement.height = previewElement.height;
            canvasElement.width = previewElement.width;
            // specificer dimension
            let context = canvasElement.getContext("2d");
            // brug metoden drawImage til at indlæse billedet i canvas (i previews str)
            // this = image objektet. 0, 0 (startposition), bredde, højde (slutposition)
            context.drawImage(this, 0, 0, canvasElement.width, canvasElement.height);
        }
    }

    // når filereaderen læser billedet
    if(file) {
        fileReader.readAsDataURL(file);
    }

})