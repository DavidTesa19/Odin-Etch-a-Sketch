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
        pixel.classList.add(i);
        pixel.style.width = pixelWidth + "px";
        pixelContainer.appendChild(pixel);
        
    }
    pixelDivs = document.querySelectorAll(".pixel");
    pixelArray = [...pixelDivs];
    gridCreated = true;

    renewListeners();

}

let gridButton = document.querySelectorAll(".grid-size");
let array = [...gridButton];


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

array.forEach(function(elem) {
    elem.addEventListener("click", function() {
        gridWidth = elem.textContent;
        gridCreated = true;
        createGrid();
    });
});

renewListeners();

function renewListeners() {
    pixelArray.forEach(function(elem) {
        elem.addEventListener("mouseover", function() {
            if(mouseDown == 1) {
                elem.style.backgroundColor = "black";
    
            }
    
        });
        elem.addEventListener("click", function() {
            elem.style.backgroundColor = "black";
    
        });
    });
}






