(function(){

    function drawCanvasArea(canvas,options){

        this.canvasEl = canvas
        this.width = this.canvasEl.width
        this.height = this.canvasEl.height
        this.offset = {
            x: parseInt(this.canvasEl.getBoundingClientRect().x),
            y: parseInt(this.canvasEl.getBoundingClientRect().y)
        }
        console.log('offset',this.offset)

        var self = this
        this.ctx = this.canvasEl.getContext('2d')
        this.pointSize = 6
        
        // The data structure that will hold all the points coordinates
        this.points = []

        this.canvasEl.addEventListener('mousedown', function(event){
            // Calculate the relative position of the point
            var pos = self._getMousePosition(event)
            console.log('mouse position: ', pos)
            // Draw the point
            self.draw(pos)

        })

        // Draw the grid
        // this.drawGrid(2)


        return {
            util: {
                clearCanvas: self.clear.bind(self)
            }
        }
    }

    drawCanvasArea.prototype.draw = function(pos){

        // Record its coordinates
        var coords = `${pos.x},${pos.y}`
        console.log(this.points)

        // Define the constant threshold
        var thresholdPixelProximity = 4

        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.fillStyle = 'rgb(255,255,255)'
        this.ctx.strokeStyle = 'rgb(255,20,20)';

    
        // Look up the points array
        // var ptIndx = this.points.indexOf(coords)
        for(var i=0; i<this.points.length; i++){
            var pointCoords = this.points[i].split(',')
            console.log(pointCoords)
            if(Math.abs(pos.x - pointCoords[0]) <= thresholdPixelProximity && 
                Math.abs(pos.y - pointCoords[1]) <= thresholdPixelProximity ){
                // Delete point
                this.ctx.clearRect(pointCoords[0] -1,pointCoords[1] -1,this.pointSize+2,this.pointSize+2)
                this.points.splice(i,1)
                return false
            }
        }

        // Get the coordinates for the center of the point
        var center = [parseInt(pos.x + this.pointSize/2), parseInt(pos.y + this.pointSize/2)]
    
        if(this.points.length){
            // Get the last point in the points array
            // var lastPoint = this.points[this.points.length -1].split(',')
            this.ctx.lineTo(center[0], center[1]);
            this.ctx.stroke()
            this.ctx.closePath();           
        }

        // Start the path
        this.ctx.beginPath();
        this.ctx.moveTo(center[0], center[1]);
        // Draw the point
        this.ctx.fillRect(pos.x,pos.y,this.pointSize,this.pointSize)
        this.ctx.strokeRect(pos.x,pos.y,this.pointSize,this.pointSize);
        // Add point to the array
        this.points.push(coords)
    }

    drawCanvasArea.prototype.clear = function(){
        this.ctx.clearRect(0,0,this.width,this.height)
    }

    drawCanvasArea.prototype._getMousePosition = function(event){
        if(!event || event.constructor.name !== 'MouseEvent'){
            console.error('Required param mouse event not passed')
            return false
        }

        return {
            x: parseInt(event.clientX - this.offset.x),
            y: parseInt(event.clientY - this.offset.y)
        }
    }

    // Find the largest "n" so that 4^n <= width * height
    drawCanvasArea.prototype._findMaxSubdivisions = function(){
        // Find the area
        var area = this.width * this.height
        var n = 1
        while(Math.pow(4,parseInt(n+1)) <= area){
            console.log(n)
            n++
        }

        console.log(n)
        return n
    }
    drawCanvasArea.prototype.drawGrid = function(n){

         // Find the area       
        var area = this.width * this.height
        var factor
        var maxSubdivisions = this._findMaxSubdivisions()  
        console.log('maximun subdivisions', maxSubdivisions)      

        if(n && n > maxSubdivisions){
            factor = maxSubdivisions
        } else
            factor = n || maxSubdivisions

        var size = Math.pow(4,factor/2)
        console.log('matrix size', size)
        var matrix = this._buildMatrix(size)
        var colIdx = 1, rowIdx = 1, squareWidth

        this.ctx.fillStyle = 'black'
        this.ctx.lineWidth = 1;

        // Paint the rows
        while(rowIdx <= size){
            var h = this.height * rowIdx / size
            this.ctx.moveTo(0, h);
            this.ctx.lineTo(this.width, h);
            this.ctx.stroke();
            // this.ctx.fillRect(0, this.height * (rowIdx) / size, this.width, 1)
            rowIdx++
        }

        // Paint the columns
        while(colIdx <= size){
            var w = this.width * colIdx / size
            this.ctx.moveTo(w, 0);
            this.ctx.lineTo(w, this.height);
            this.ctx.stroke();
            // this.ctx.fillRect(this.width * (colIdx) / size, 0, 1, this.height)
            colIdx++
        }
    }

    drawCanvasArea.prototype._buildMatrix = function(size){
        //Build the matrix
        var matrix = new Array(size).fill(0).map( col => new Array(size) )
        console.log(matrix)
        return matrix
    }

    
    // Initialize the canvas
    // On window loaded
    window.onload = function(){
        
        // Get DOM
        var canvas = document.querySelector('canvas')
        var clearBtn = document.getElementById('clear')
        
        var c = new drawCanvasArea(canvas)

        clearBtn.addEventListener('click', function(e){
             e.preventDefault()
             c.util.clearCanvas()
         })

        console.log(c)

    }

})()