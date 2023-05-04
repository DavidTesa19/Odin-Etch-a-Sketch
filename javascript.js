class ClickAndHold {
    
    constructor(target, callback) {
        this.target = target;
        this.callback = callback;
        this.isHeld = false;
        this.activeHoldTimeoutid = null;

        ["mousedown", "touchstart"].forEach(type => {
            this.target.addEventListener(type, this._onHoldStart.bind(this));
        });

        ["mouseup", "touchstart", "mouseout", "touchend", "touchcancel"].forEach(type => {
            this.target.addEventListener(type, this._onHoldEnd.bind(this));
        });
    }
     

    _onHoldStart() {
        this.held = true;

        this.activeHoldTimeoutid = setTimeout(() => {
            if (this.isHeld) {
                this.callback();
            }
        }, 100);
    }

    _onHoldEnd() {
        this.isHeld = false;
        clearTimeout(this.activeHoldTimeoutid);
    }

}

const COLOR_BLACK_TRANSPARENT = "#00000080";
const COLOR_BLACK = [0,0,0];
const COLOR_DEFAULT = "#EDEEFF";
const COLOR_WHITE = [255,255,255];
const COLOR_GREY = "#888888";
let COLOR_BRUSH = [0,0,0];
const colorWhite = "#ffffff";
let opacity = 0.5;

let gridWidth = 8;
let gridWidthChanged = 20;
let gridCreated = false;

let pixelContainer = document.createElement("div");
pixelContainer.classList.add("pixel-container");
const sketcher = document.querySelector(".sketcher");
sketcher.appendChild(pixelContainer);

let pixelDivs = document.querySelectorAll(".pixel");
let pixelArray = [...pixelDivs];

function createGrid() {
    if(gridCreated == true) {
        pixelContainer = document.querySelector(".pixel-container");
        pixelContainer.remove();
        pixelContainer = document.createElement("div");
        pixelContainer.classList.add("pixel-container");
        sketcher.appendChild(pixelContainer);
    };

    
    var positionInfo = sketcher.getBoundingClientRect();
    let pixelWidth = (positionInfo.width/gridWidth);
    
    for (let i = 0; i < gridWidth**2; i++) {
        let pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.classList.add("p" + i);
        pixel.style.width = pixelWidth + "px";
        pixel.style.backgroundColor = colorWhite;
        pixelContainer.appendChild(pixel);
        
    }
    pixelDivs = document.querySelectorAll(".pixel");
    pixelArray = [...pixelDivs];
    gridCreated = true;

    renewListeners();

}

let gridButton = document.querySelectorAll(".grid-size");
let array = [...gridButton];

let brushSize = 1;
let brushSizeButton = document.querySelectorAll(".brush");
let brushArray = [...brushSizeButton]

let eraserButton = document.querySelector(".eraser")
let brushButton = document.querySelector(".brushButton")

let softButton = document.querySelector(".soft")
let hardButton = document.querySelector(".hard")


eraserButton.addEventListener("click", function() {
    COLOR_BRUSH = COLOR_WHITE;
});

brushButton.addEventListener("click", function() {
    COLOR_BRUSH = COLOR_BLACK;
});

softButton.addEventListener("click", function() {
    opacity = 0.5;
});

hardButton.addEventListener("click", function() {
    opacity = 1;
});


createGrid();

let mouseDown = 0;
document.body.onmousedown = function() { 
  mouseDown = 1;
}
document.body.onmouseup = function() {
  mouseDown = 0;
}

let targetDiv;

function checkPixelArray() {
    console.log(pixelArray);
}

brushArray.forEach(function(elem) {
    elem.addEventListener("click", function() {
        brushSize = +elem.textContent;
    });
});

array.forEach(function(elem) {
    elem.addEventListener("click", function() {
        gridWidth = elem.textContent;
        gridCreated = true;
        createGrid();
    });
});

let elemContainer;



function renewListeners() {
    pixelArray.forEach(function(elem) {
        elem.addEventListener("mouseover", function() {
            if(mouseDown == 1) {
                elem.style.backgroundColor = rgb(COLOR_BRUSH);
                if (brushSize == 3) {
                    applySecondaryBrush(elem);
                }
    
            }
    
        });
        elem.addEventListener("click", function() {
            elem.style.backgroundColor = rgb(COLOR_BRUSH);
            elemContainer = elem;
            if (brushSize == 3) {
                applySecondaryBrush(elem);
            }
        });
    });
}



function applySecondaryBrush(elem) {

    let gridNumber = gridWidth;
    let elem2 = elem.className.split(" ")[1];
    let elem3 = elem2.substring(1);
    

    addSecondarypixels(elem3, gridNumber);
    gridNumber /= gridNumber;
    addSecondarypixels(elem3, gridNumber);    


   

    
}

function rgb(values) {
    return 'rgb(' + values.join(', ') + ')';
}

sketcher.addEventListener("mouseleave", (event) => {
    mouseDown = 0;
});

function addSecondarypixels(elem3, gridNumber) {
    for (let i = 0; i < 2; i++) {
        if((+elem3 - gridNumber >= 0) && (+elem3 - gridNumber < gridWidth**2) && !(((+elem3 - gridNumber) % gridWidth) == 0)  && !(elem3 % gridWidth == 0 && gridNumber == 1 )) {
            let pixel1 = document.querySelector(".p" + (+elem3 -gridNumber));
            let pixelColor1 =  pixel1.style.backgroundColor;
            
            const toRGBArray = pixelColor1 => pixelColor1.match(/\d+/g).map(Number);
        
            
            let color2 = toRGBArray(pixelColor1);
            let newColorArray = [];
            
            for (let i = 0; i < 3; i++) {
                newColorArray.push(parseInt(color2[i] - (color2[i] - COLOR_BRUSH[i])*opacity))
                
            }

            pixel1.style.backgroundColor = rgb(newColorArray);  
            
        }
        gridNumber = -gridNumber;
        
    }
}




