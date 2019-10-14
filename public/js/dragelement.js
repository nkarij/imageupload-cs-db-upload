// Make the element draggable:
function dragElement(elmnt) {
    // mellem hver frame skal vi ivde hvad som er ændret
    let newX = 0; 
    let newY = 0; 
    let prevX = 0;
    let prevY = 0;
    // console.log("noget");
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // grib start positionen
        prevX = e.clientX;
        prevY = e.clientY;
        // afslut drag når musen slippes:
        document.onmouseup = closeDragElement;
        // når musen flyttes, kald elementDrag
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate difference between last and new cursor position
        newX = prevX - e.clientX;
        newY = prevY - e.clientY;
        prevX = e.clientX;
        prevY = e.clientY;
        // console.log("whatever");
        // placer elementet med den forskydning der er mellem click og øverste venstre hjørne
        elmnt.style.top = (elmnt.offsetTop - newY) + "px";
        elmnt.style.left = (elmnt.offsetLeft - newX) + "px";

        // grib boundingbox hjørnerne så vi kan sætte de nye koordinater(coords);

        let y = e.target.offsetTop;
        let x = e.target.offsetLeft;
        let w = e.target.offsetWidth;
        let h = e.target.offsetHeight;

        if(y < 0) {
            y = 0;
            elmnt.style.top = y + 'px';
        }
        if(x < 0) {
            x = 0;
            elmnt.style.left = x + 'px';
        }
        if(elmnt.offsetLeft + w > previewElement.width){
            x = previewElement.width - w;
            elmnt.style.left = x + 'px';    
        }
        if(elmnt.offsetTop + h > previewElement.height){
            y = previewElement.height - h;
            elmnt.style.top = y + 'px';    
        }

        // gem de nye coords - den gemmer ikke de nye coords...
        coords.punkt1.x = x;
        coords.punkt1.y = y;
        coords.punkt2.x = x + w;
        coords.punkt2.y = y + h;

        // opdater crop preview med de nye coords
        previewCroppedImage();
    }

    function closeDragElement() {
            // stop drag når musen "slipper":
            document.onmouseup = null;
            document.onmousemove = null;
    }
} // draggable functions end



