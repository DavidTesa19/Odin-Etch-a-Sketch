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

const toRGBArray = x => x.match(/\d+/g).map(Number);

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

array[0].style.backgroundColor = "white";
array[0].style.color = "black";

let brushColors = document.querySelectorAll(".brushColor");
let brushColorArray = [...brushColors];
for (let i = 0; i < brushColorArray.length; i++) {
    brushColorArray[i].style.backgroundColor = "white";
    
}

brushColorArray.forEach(function(elem, index) {
    elem.addEventListener("click", function() {
        let colorTemp = brushColorArray[0].style.backgroundColor;
        brushColorArray[0].style.backgroundColor = brushColorArray[index].style.backgroundColor; 
        brushColorArray[index].style.backgroundColor = colorTemp;
        COLOR_BRUSH = toRGBArray(brushColorArray[0].style.backgroundColor);  

    });
});


let brushSize = 1;
let brushSizeButton = document.querySelectorAll(".brush");
let brushArray = [...brushSizeButton];

let eraserButton = document.querySelector(".eraser");
let brushButton = document.querySelector(".brushButton");

let softButton = document.querySelector(".soft");
let hardButton = document.querySelector(".hard");

let rainbowButton = document.querySelector(".rainbow");
let rainbowSelected = false;
let eraserSelected = false;

opacity = 1;

function applySelectedButtonsStyle() {
    hardButton.style.backgroundColor = "#ffffff";
    hardButton.style.color = "black";

    brushButton.style.backgroundColor = "#ffffff";
    brushButton.style.color = "#000000";
}

applySelectedButtonsStyle();

rainbowButton.addEventListener("click", function() {
    rainbowSelected = true;

    rainbowButton.style.backgroundColor = "#ffffff";
    rainbowButton.style.color = "#000000";    

    brushButton.style.backgroundColor = "transparent";
    brushButton.style.color = "#ffffff";    

    eraserButton.style.backgroundColor = "transparent";
    eraserButton.style.color = "#ffffff";
    eraserSelected = false;
});

eraserButton.addEventListener("click", function() {
    COLOR_BRUSH = COLOR_WHITE;
    eraserButton.style.backgroundColor = "#ffffff";
    eraserButton.style.color = "#000000";

    brushButton.style.backgroundColor = "transparent";
    brushButton.style.color = "#ffffff";

    rainbowButton.style.backgroundColor = "transparent";
    rainbowButton.style.color = "#ffffff";
    rainbowSelected = false
    eraserSelected = true;
});

brushButton.addEventListener("click", function() {
    brushButton.style.backgroundColor = "#ffffff";
    brushButton.style.color = "#000000";

    eraserButton.style.backgroundColor = "transparent";
    eraserButton.style.color = "#ffffff";

    rainbowButton.style.backgroundColor = "transparent";
    rainbowButton.style.color = "#ffffff";
    rainbowSelected = false
    eraserSelected = false;

    changeBrushColor();
});

softButton.addEventListener("click", function() {
    opacity = 0.5;

    softButton.style.backgroundColor = "#ffffff";
    softButton.style.color = "black";

    hardButton.style.backgroundColor = "transparent";
    hardButton.style.color = "white";
});

hardButton.addEventListener("click", function() {
    opacity = 1;

    hardButton.style.backgroundColor = "#ffffff";
    hardButton.style.color = "black";

    softButton.style.backgroundColor = "transparent";
    softButton.style.color = "white";
});



let brushColor = document.querySelector(".brushColor");
let sliderContainer = document.querySelector(".sliderContainer");
let slider1 = document.getElementById("hue");
let slider2 = document.getElementById("saturation");
let slider3 = document.getElementById("lightness");
brushColor.style.backgroundColor = rgb(COLOR_BRUSH); 

let sliderArray = [slider1, slider2, slider3];

sliderArray.forEach(item => {
    item.oninput = function() {changeBrushColor()};

});

function changeBrushColor() {
    let x = sliderContainer.style.backgroundColor;
    let COLOR_BRUSH2 = HSLToRGB(slider1.value, slider2.value, slider3.value);
    brushColor.style.backgroundColor = rgb(COLOR_BRUSH2);
    if(brushApplied == true) {
        for (let i = brushColorArray.length - 1; i >= 1; i--) {
            brushColorArray[i].style.backgroundColor = brushColorArray[i-1].style.backgroundColor;
            
            brushApplied = false;
        }

    }

    if(!eraserSelected && !rainbowSelected) {
        COLOR_BRUSH = COLOR_BRUSH2;
        
    }
}


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
}

brushArray.forEach(function(elem, index) {
    elem.addEventListener("click", function() {
        brushSize = +elem.textContent;
        elem.style.backgroundColor = "white";
        elem.style.color = "black";
        let brushArray3 = [...brushArray];
        brushArray3.splice(index, 1);
        brushArray3[0].style.backgroundColor = "transparent";
        brushArray3[0].style.color = "white";
    });
});

array.forEach(function(elem, index) {
    elem.addEventListener("click", function() {
        gridWidth = elem.textContent;
        gridCreated = true;
        createGrid();

        elem.style.backgroundColor = "white";
        elem.style.color = "black";

        let array2 = [...array];
        array2.splice(index, 1);
        for (let i = 0; i < array.length; i++) {
            array2[i].style.backgroundColor = "transparent";
            array2[i].style.color = "white";
            
        }
        brushArray3[0].style.backgroundColor = "transparent";
        brushArray3[0].style.color = "white";
    });
});

let elemContainer;
let rainbowNumber = 0;
let rainbowNumberChange = 4;
let brushApplied = false;

function renewListeners() {
    pixelArray.forEach(function(elem) {
        elem.addEventListener("mouseover", function() {
            if(mouseDown == 1) {
                
                let opacityStart = opacity;
                if (brushSize == 3 ) {
                    opacity = 1;
                }
                let e = elem.style.backgroundColor;
                const toRGBArray = e => e.match(/\d+/g).map(Number);
                let e2 = toRGBArray(e);
                
                if(rainbowSelected & rainbowNumber >= rainbowNumberChange) {
                    let rainbowColor = Math.floor(Math.random() * 360);
                    COLOR_BRUSH = HSLToRGB(rainbowColor, 100, 50);
                    rainbowNumber = 0;
    
                }

                let newColorArray2 = [];

                for (let i = 0; i < 3; i++) {
                    newColorArray2.push(parseInt(e2[i] - (e2[i] - COLOR_BRUSH[i])*opacity))
                    
                }
                elem.style.backgroundColor = rgb(newColorArray2);
                elemContainer = elem;
                if (brushSize == 3) {
                    opacity = opacityStart;
                    applySecondaryBrush(elem);
                }
                rainbowNumber++;
                brushApplied = true;
            }
            
        });
        elem.addEventListener("click", function() {
            
            let opacityStart = opacity;
            if (brushSize == 3 ) {
                opacity = 1;
            }
            let e = elem.style.backgroundColor;
            const toRGBArray = e => e.match(/\d+/g).map(Number);
            let e2 = toRGBArray(e);

            if(rainbowSelected & rainbowNumber >= rainbowNumberChange) {
                let rainbowColor = Math.floor(Math.random() * 360);
                COLOR_BRUSH = HSLToRGB(rainbowColor, 100, 50);
                rainbowNumber = 0;
            }

            if(!rainbowSelected && !eraserSelected) {

            }

            let newColorArray2 = [];

            for (let i = 0; i < 3; i++) {
                newColorArray2.push(parseInt(e2[i] - (e2[i] - COLOR_BRUSH[i])*opacity))
                
            }
            elem.style.backgroundColor = rgb(newColorArray2);
            elemContainer = elem;
            if (brushSize == 3) {
                opacity = opacityStart;
                applySecondaryBrush(elem);
            }
            brushApplied = true;
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

const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

sketcher.addEventListener("mouseleave", (event) => {
    mouseDown = 0;
});


function addSecondarypixels(elem3, gridNumber) {
    for (let i = 0; i < 2; i++) {
        if((+elem3 - gridNumber >= 0) && (+elem3 - gridNumber < gridWidth**2) && !(((+elem3 - gridNumber) % gridWidth) == 0 && gridNumber == -1 )  && !(elem3 % gridWidth == 0 && gridNumber == 1 )) {
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

changeBrushColor();


