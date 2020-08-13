import React from 'react';
import './App.css';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            property: "value"
        }
    }

    createGraph(opt) {
        let options = opt
        
        //defaults
        options.title = options.title || "graph title" 
        if (typeof(options.decimals)!=="number") options.decimals = 2
        if (typeof(options.legend)!=="boolean" && options.data.length > 1) options.legend = true
        options.fontFamily = options.fontFamily || "Times New Roman"
        options.xTitle = options.xTitle || "x axis title"
        options.xInc = options.xInc || options.data[0].x.length - 1
        if (typeof(options.xMin)!=="number") options.xMin = 0
        if (typeof(options.xMax)!=="number") {
            let biggestX = 0
            for (let dataSet of options.data) {
                for (let x of dataSet.x) {
                    if (x > biggestX) biggestX = x
                }
            }
            options.xMax = biggestX
        }
        if (typeof(options.xLineIncs)!=="number") options.xLineIncs = options.data[0].x.length - 1

        options.yTitle = options.yTitle || "y axis title"
        options.yInc = options.yInc || options.data[0].y.length + 1
        if (typeof(options.yMin)!=="number") options.yMin = 0
        if (typeof(options.yMax)!=="number") {
            let biggestY = 0
            for (let dataSet of options.data) {
                for (let y of dataSet.y) {
                    if (y > biggestY) biggestY = y
                }
            }
            options.yMax = biggestY
        }
        if (typeof(options.yLineIncs)!=="number") options.yLineIncs = options.data[0].y.length + 1

        for (let i=0; i<options.data.length; i++) {
            options.data[i].name = options.data[i].name || `line ${i+1}`
            options.data[i].shape = options.data[i].shape || "circle"
            if (typeof(options.data[i].lineWidth)!=="number") options.data[i].lineWidth = 2
            if (typeof(options.data[i].shapeSize)!=="number") {
                if (options.data[i].shape==="circle") options.data[i].shapeSize = 5 //sizes should be diff
                else if (options.data[i].shape==="square") options.data[i].shapeSize = 5
                else if (options.data[i].shape==="triangle") options.data[i].shapeSize = 5
                else if (options.data[i].shape==="rhombus") options.data[i].shapeSize = 5
            }
            options.data[i].color = options.data[i].color || "black" //colors should be diff
        }

        let keyNum = 0

        let xAxisEnd = 775
        if (options.legend) xAxisEnd = 675
        let xAxisWidth = xAxisEnd - 75

        function roundToPlace(num, power) {
            return Math.round(num*(10**power))/(10**power)
        }

        //x graph elems
        let xIncs = []
        let xPos = 75
        let xPosInc = xAxisWidth/options.xInc
        let xInc = (options.xMax - options.xMin)/options.xInc
        let currentX = options.xMin
        for (let i=0; i<=options.xInc; i++) {
            xIncs.push(
                <text 
                    x={xPos} y="545" textAnchor="middle"
                    style={{fontSize: "18px", fontFamily: options.fontFamily}} key={keyNum}>
                        {roundToPlace(currentX, options.decimals)}
                </text>
            )
            xPos += xPosInc
            currentX += xInc
            keyNum++
        }

        let xLines = [] //vert grid lines along x axis
        let xLinePosInc = xAxisWidth/options.xLineIncs
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
                <text
                    x="68" y={yPos} textAnchor="end"
                    style={{fontSize: "18px", fontFamily: options.fontFamily}} key={keyNum}>
                        {roundToPlace(currentY, options.decimals)}
                </text>
            )
            yPos += yPosInc
            currentY += yInc
            keyNum++
        }

        let yLines = [] //vert grid lines along y axis
        let yLinePosInc = -425/options.yLineIncs
        let yLinePos = 525 + yLinePosInc
        for (let i=0; i < (options.yLineIncs - 1); i++) {
            yLines.push(
                <line x1="75" y1={yLinePos} x2={xAxisEnd} y2={yLinePos} style={{stroke: "gray", strokeWidth: ".5"}} key={keyNum}/>
            )
            yLinePos += yLinePosInc
            keyNum++
        }

        //data
        function convertX(num) { return ((num - options.xMin)/(options.xMax - options.xMin))*xAxisWidth + 75 }   //convert x 
        function convertY(num) { return ((num - options.yMin)/(options.yMax - options.yMin))*-425 + 525 } //and y coords to coords on svg
        function pointToTriangle(x, y, r) { //converts center of tri to string containing all pts of tri
            return `${x},${y-r} ${x+0.866*r},${y + 0.5*r} ${x-0.866*r},${y+0.5*r}`
        }
        function pointToRhombus(x, y, r) { //converts center of rhom to string containing all pts of rhom
            return `${x},${y-r} ${x-r},${y} ${x},${y+r} ${x+r},${y}`
        }

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

        //legend
        let legend = []
        if (options.legend) {
            legend.push(
                <text x="737.5" y="90" textAnchor="middle"
                    style={{fontSize: "20px", fontFamily: options.fontFamily}} key={keyNum}>
                        Legend
                </text>
            )
            keyNum++
            for (let i=0; i<options.data.length; i++) {
                let dataSet = options.data[i]
                if (dataSet.shape==="circle") {
                    legend.push(
                        <circle
                            cx="695" cy={35*i + 120}
                            r="6" fill={dataSet.color} key={keyNum}
                        />
                    )
                } else if (dataSet.shape==="square") {
                    legend.push(
                        <rect
                            x="689.5"
                            y={35*i + 114.5}
                            width="11" height="11" fill={dataSet.color} key={keyNum}
                        />
                    )
                } else if (dataSet.shape==="triangle") {
                    legend.push(
                        <polygon
                            points={pointToTriangle(695, (35*i + 121), 8)}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                } else if (dataSet.shape==="rhombus") {
                    legend.push(
                        <polygon
                            points={pointToRhombus(695, (35*i + 120), 7)}
                            fill={dataSet.color} key={keyNum}
                        />
                    )
                }
                keyNum++
                legend.push(
                    <line
                        x1="685"
                        y1={35*i + 120}
                        x2="705"
                        y2={35*i + 120}
                        style={{stroke: dataSet.color, strokeWidth: "3"}} key={keyNum}
                    />
                )
                keyNum++
                legend.push(
                    <text x="710" y={35*i + 125}
                        style={{fontSize: "14px", fontFamily: options.fontFamily}} key={keyNum}>
                            {dataSet.name}
                    </text>
                )
                keyNum++
            }
        }

        return (
            <svg viewBox="0 0 800 600" style={{width: "800px"}}>
                <text x="400" y="50" textAnchor="middle" style={{fontSize: "50px", fontFamily: options.fontFamily}}>{options.title}</text>
                <text x="400" y="585" textAnchor="middle" style={{fontSize: "20px", fontFamily: options.fontFamily}}>{options.xTitle}</text>
                <text x="400" y="300" textAnchor="middle" style={{
                        fontSize: "20px", fontFamily: options.fontFamily,
                        transform: "rotate(270deg) translateY(-275px) translateX(-700px)" //idk
                    }} id="y-title">{options.yTitle}</text>
                <polygon points="0,0 0,600 800,600 800,0" style={{stroke: "black", strokeWidth: "1", fill: "none"}}></polygon>
                <polygon points={`75,100 75,525 ${xAxisEnd},525 ${xAxisEnd},100`} style={{stroke: "black", strokeWidth: "1", fill: "none"}}></polygon>
                {xIncs}
                {yIncs}
                {xLines}
                {yLines}
                {data}
                {legend}
            </svg>
        )
    }

    render() {
        let theOptions = {
            data: [
                {
                    x: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10],
                    y: [ 0, 5,10,50,23,50,25,33,45,65,66]
                },
                {
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