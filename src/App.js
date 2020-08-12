import React from 'react';
import './App.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            property: "value"
        }
    }

    createGraph(options) {
        let keyNum = 0

        //x graph elems
        let xIncs = []
        let xPos = 75
        let xPosInc = 650/options.xInc
        let xInc = (options.xMax - options.xMin)/options.xInc
        let currentX = options.xMin
        for (let i=0; i<=options.xInc; i++) {
            xIncs.push(
                <text x={xPos} y="545" textAnchor="middle" style={{fontSize: "18px"}} key={keyNum}>{currentX}</text>
            )
            xPos += xPosInc
            currentX += xInc
            keyNum++
        } //needs rounding

        let xLines = [] //vert grid lines along x axis
        let xLinePosInc = 650/options.xLineIncs
        let xLinePos = 75 + xLinePosInc
        for (let i=0; i < (options.xLineIncs - 1); i++) {
            xLines.push(
                <line x1={xLinePos} y1="525" x2={xLinePos} y2="100" style={{stroke: "gray", strokeWidth: ".5"}} key={keyNum}/>
            )
            xLinePos += xLinePosInc
            keyNum++
        }

        //y graph elems
        let yIncs = []
        let yPos = 530
        let yPosInc = -425/options.yInc
        let yInc = (options.yMax - options.yMin)/options.yInc
        let currentY = options.yMin
        for (let i=0; i<=options.yInc; i++) {
            yIncs.push(
                <text x="68" y={yPos} textAnchor="end" style={{fontSize: "18px"}} key={keyNum}>{currentY}</text> //fix key
            )
            yPos += yPosInc
            currentY += yInc
            keyNum++
        } //needs rounding

        let yLines = [] //vert grid lines along x axis
        let yLinePosInc = -425/options.yLineIncs
        let yLinePos = 525 + yLinePosInc
        for (let i=0; i < (options.yLineIncs - 1); i++) {
            yLines.push(
                <line x1="75" y1={yLinePos} x2="725" y2={yLinePos} style={{stroke: "gray", strokeWidth: ".5"}} key={keyNum}/>
            )
            yLinePos += yLinePosInc
            keyNum++
        }

        //data
        function convertX(num) { return ((num - options.xMin)/(options.xMax - options.xMin))*650 + 75 }   //convert x 
        function convertY(num) { return ((num - options.yMin)/(options.yMax - options.yMin))*-425 + 525 } //and y coords to coords on svg

        let data = []
        for (let dataSet of options.data) {
            if (dataSet.x.length!==dataSet.y.length) {
                console.log(
                    `warning for data set ${dataSet.name}: mismatched data
                    ${dataSet.x.length} x values and ${dataSet.y.length} y values`
                )
            }
            if (dataSet.shape==="circle") {
                data.push(
                    <circle
                        cx={convertX(dataSet.x[0])}
                        cy={convertY(dataSet.y[0])}
                        r={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <circle
                            cx={convertX(dataSet.x[i])}
                            cy={convertY(dataSet.y[i])}
                            r={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            } else if (dataSet.shape==="square") {
                data.push(
                    <rect
                        x={convertX(dataSet.x[0]) - dataSet.shapeSize/2}
                        y={convertY(dataSet.y[0]) - dataSet.shapeSize/2}
                        width={dataSet.shapeSize} height={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <rect
                            x={convertX(dataSet.x[i]) - dataSet.shapeSize/2}
                            y={convertY(dataSet.y[i]) - dataSet.shapeSize/2}
                            width={dataSet.shapeSize} height={dataSet.shapeSize} fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            } else if (dataSet.shape==="triangle") {
                function pointToTriangle(x, y, r) { //converts center of tri to string containing all pts of tri
                    return `${x},${y-r} ${x+0.866*r},${y + 0.5*r} ${x-0.866*r},${y+0.5*r}`
                }
                data.push(
                    <polygon
                        points={pointToTriangle(convertX(dataSet.x[0]), convertY(dataSet.y[0]), Number(dataSet.shapeSize))}
                        fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <polygon
                            points={pointToTriangle(convertX(dataSet.x[i]), convertY(dataSet.y[i]), Number(dataSet.shapeSize))}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            } else if (dataSet.shape==="rhombus") {
                function pointToRhombus(x, y, r) { //converts center of rhom to string containing all pts of rhom
                    return `${x},${y-r} ${x-r},${y} ${x},${y+r} ${x+r},${y}`
                }
                data.push(
                    <polygon
                        points={pointToRhombus(convertX(dataSet.x[0]), convertY(dataSet.y[0]), Number(dataSet.shapeSize))}
                        fill={dataSet.color} key={keyNum}
                    />
                )
                keyNum++
                for (let i=1; i<dataSet.x.length; i++) {
                    data.push(
                        <polygon
                            points={pointToRhombus(convertX(dataSet.x[i]), convertY(dataSet.y[i]), Number(dataSet.shapeSize))}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                    keyNum++
                    data.push(
                        <line
                            x1={convertX(dataSet.x[i-1])}
                            y1={convertY(dataSet.y[i-1])}
                            x2={convertX(dataSet.x[i])}
                            y2={convertY(dataSet.y[i])}
                            style={{stroke: dataSet.color, strokeWidth: dataSet.lineWidth}} key={keyNum}
                        />
                    )
                    keyNum++
                }
            }
        }

        return (
            <svg viewBox="0 0 800 600" style={{width: "800px"}}>
                <text x="400" y="50" textAnchor="middle" style={{fontSize: "50px"}}>{options.title}</text>
                <text x="400" y="585" textAnchor="middle" style={{fontSize: "20px"}}>{options.xTitle}</text>
                <text x="400" y="300" textAnchor="middle" style={{
                        fontSize: "20px", transform: "rotate(270deg) translateY(-275px) translateX(-700px)" //idk
                    }} id="y-title">{options.yTitle}</text>
                <polygon points="0,0 0,600 800,600 800,0" style={{stroke: "black", strokeWidth: "1", fill: "none"}}></polygon>
                <polygon points="75,100 75,525 725,525 725,100" style={{stroke: "black", strokeWidth: "1", fill: "none"}}></polygon>
                {xIncs}
                {yIncs}
                {xLines}
                {yLines}
                {data} 
                {/* add key */}
            </svg>
        )
    }

    render() {
        let theOptions = { //font family
            title: "graph title",
            xTitle: "x axis title",
            xInc: 10,
            xMin: 0,
            xMax: 10,
            xLineIncs: 10,
            yTitle: "y axis title",
            yMin: 0,
            yInc: 10,
            yMax: 100,
            yLineIncs: 10,
            data: [
                {
                    name: "line 1",
                    color: "blue",
                    lineWidth: "2",
                    shapeSize: "5",
                    shape: "circle", //circle, square, triangle, rhombus
                    x: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10],
                    y: [ 0, 5,10,50,23,50,25,33,45,65,66]
                },
                {
                    name: "line 2",
                    color: "red",
                    lineWidth: "2",
                    shapeSize: "6",
                    shape: "rhombus", //circle, square, triangle, rhombus
                    x: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10],
                    y: [52,45,39,36,45,60,80,95,102,55, 6]
                }
            ]
        }
        return (
            <div>
                {this.createGraph(theOptions)}
            </div>
        )
    }
}

export default App;

//key
//hover
//defaults
//rounding