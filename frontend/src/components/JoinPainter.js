import React, { useContext, useEffect, useCallback } from 'react';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import { Button, Modal } from '@mui/material';
import { Circle, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

//import { DetectRooms } from '../util/roomDetectutils';
import { initial_menuItems } from "../data/MenuItems.js";
import { CoordinateTranslator, checkJoins, checkEdgeConnections, specifyEdgeConnection, checkIds, findElement, splitBasedonID, getDistance } from "../util/join_utils.js";
import { GetMapConnections, GetMap, SaveMap } from '../services/apiServices';
import { AuthContext } from '../context/AuthContext';
//Noted Bug
// joining 3 images at a point leads to incorrect connections
// angled connection to map translation is full of bugs


var Joins = [];

function getOverlapDistanceV(line1, line2, variance) {


    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            line1[i][j] = Math.round(line1[i][j] * 10) / 10
        }
    }

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            line2[i][j] = Math.round(line2[i][j] * 10) / 10
        }
    }

    for (var n = 0; n < 2; n++) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                for (var k = 0; k < 2; k++) {
                    for (var l = 0; l < 2; l++) {
                        if (line1[i][j] != line2[k][l] && Math.abs(line1[i][j] - line2[k][l]) < variance) {

                            if (line1[i][j] > line2[k][l]) {
                                line1[i][j] = line2[k][l]
                            }
                            else {
                                line2[k][l] = line1[i][j]

                            }

                        }
                    }
                }
            }
        }
    }


    var oD = getOverlapDistance(line1, line2)
    return oD

}


function areLinesParallel(point1, point2, point3, point4) {


    // Check if both line segments are vertical


    if (point1[0] == point2[0] && point3[0] == point4[0]) {
        return true;
    }

    // Calculate the slopes of both line segments (excluding vertical lines)
    let slope1, slope2;
    if (point1[0] !== point2[0]) {
        slope1 = (point2[1] - point1[1]) / (point2[0] - point1[0]);
    }
    if (point3[0] !== point4[0]) {
        slope2 = (point4[1] - point3[1]) / (point4[0] - point3[0]);
    }


    // Check if the slopes are equal (within a small tolerance)

    if (slope1 == slope2) {

        return true;

    } else {
        return false;
    }
}

function getOverlapDistance(line1, line2) {



    var x1 = line1[0][0];
    var y1 = line1[0][1];
    var x2 = line1[1][0];
    var y2 = line1[1][1];
    var x3 = line2[0][0];
    var y3 = line2[0][1];
    var x4 = line2[1][0];
    var y4 = line2[1][1];


    // Check if the line segments are parallel
    if (!areLinesParallel([x1, y1], [x2, y2], [x3, y3], [x4, y4])) {

        return 0; // Line segments are not parallel, no overlap
    }

    // Calculate max_start and min_end
    var max_startx = Math.max(Math.min(x1, x2), Math.min(x3, x4));
    var min_endx = Math.min(Math.max(x1, x2), Math.max(x3, x4));

    var overlap_distancex = min_endx - max_startx;


    var max_starty = Math.max(Math.min(y1, y2), Math.min(y3, y4));
    var min_endy = Math.min(Math.max(y1, y2), Math.max(y3, y4));


    var overlap_distancey = min_endy - max_starty;


    if (!areLinesParallel([x1, y1], [x2, y2], [max_startx, max_starty], [min_endx, min_endy])) {


        return 0; // Line segments are not parallel, no overlap

    }



    var overlap_distance = getDistance(max_startx, max_starty, min_endx, min_endy);

    if (overlap_distancex > -1 && overlap_distancey > -1) {
        return overlap_distance

    }

    return 0;
}

function ID2Rooms(id2j, cycle) {
    var corners = []
    for (var i = 0; i < cycle.length; i++) {
        corners.push(id2j[cycle[i]]);
    }

}

export const DetectRooms = (nJoins, Joins, connections) => {



    var joinProximity = 10;

    var iD2Join = {}

    // assigning all joins to a dictionary 
    for (var i = 0; i < Joins.length; i++) {
        var value = [Joins[i].x, Joins[i].y]
        iD2Join[i] = value


    }

    console.log("🚀 ~ file: JoinPainter.js:244 ~ DetectRooms ~ iD2Join:", iD2Join)

    // creating all possible pairs of joins
    var joinIds = Object.keys(iD2Join)
    var joinPairs = joinIds.flatMap(
        (v, i) => joinIds.slice(i + 1).map(w => [parseInt(v), parseInt(w)])
    );
    console.log("🚀 ~ file: JoinPainter.js:260 ~ DetectRooms ~ joinPairs:", joinPairs)


    let graph = [];
    let cycles = [];





    for (var i = 0; i < connections.length; i++) {
        console.log("------------------------------------------------------")
        var oPairs = []
        for (var j = 0; j < joinPairs.length; j++) {
            var l1 = [[connections[i].x1, connections[i].y1], [connections[i].x2, connections[i].y2]]
            console.log("🚀 ~ file: roomDetectutils.js:253 ~ DetectRooms ~ l1:", l1)


            var l2 = [iD2Join[joinPairs[j][0]], iD2Join[joinPairs[j][1]]]
            console.log("🚀 ~ file: JoinPainter.js:279 ~ DetectRooms ~ joinPairs:", joinPairs[j])
            console.log("🚀 ~ file: roomDetectutils.js:257 ~ DetectRooms ~ l2:", l2)


            var oDist = getOverlapDistanceV([...l1], [...l2], 5)
            console.log("🚀 ~ file: roomDetectutils.js:261 ~ DetectRooms ~ oDist:", oDist)

            if (oDist > 0 && oDist <= getDistance(l1[0][0], l1[0][1], l1[1][0], l1[1][1])) {
                oPairs.push([oDist, joinPairs[j][0], joinPairs[j][1]])
            }


        }
        oPairs.sort(function (a, b) {
            return a[0] - b[0]
        });
        console.log("🚀 ~ file: roomDetectutils.js:272 ~ oPairs:", oPairs)



        if (oPairs.length != 0) {
            if (oPairs.length == 1) {
                graph.push([oPairs[0][1], oPairs[0][2]])
            }
            else {
                var onPairs = []
                //add valid pairs to onPairs
                for (var j = 0; j < oPairs.length; j++) {
                    if (j == 0) {
                        onPairs.push([oPairs[j][1], oPairs[j][2]])
                        graph.push([oPairs[j][1], oPairs[j][2]])

                    }
                    else {
                        var overlap = false
                        for (var k = 0; k < onPairs.length; k++) {


                            var l1 = [iD2Join[oPairs[j][1]], iD2Join[oPairs[j][2]]]

                            var l2 = [iD2Join[onPairs[k][0]], iD2Join[onPairs[k][1]]]

                            var odist = getOverlapDistanceV([...l1], [...l2], 5)


                            if (odist > 0) {

                                overlap = true
                            }

                        }
                        if (!overlap) {
                            onPairs.push([oPairs[j][1], oPairs[j][2]])
                            graph.push([oPairs[j][1], oPairs[j][2]])

                        }
                    }

                }

            }

        }
        console.log("🚀 ~ file: roomDetectutils.js:309 ~ DetectRooms ~ onPairs:", onPairs)




    }







    function findNewCycles(path) {
        let start_node = path[0];
        let next_node = null;
        let sub = [];

        for (let edge of graph) {
            let [node1, node2] = edge;

            if (start_node === node1) {
                next_node = node2;
            } else if (start_node === node2) {
                next_node = node1;
            }

            if (next_node && !visited(next_node, path)) {
                sub = [next_node];
                sub.push(...path);
                findNewCycles(sub);
            } else if (path.length > 2 && next_node === path[path.length - 1]) {
                let p = rotateToSmallest(path);
                let inv = invert(p);

                if (isNew(p) && isNew(inv)) {
                    cycles.push(p);
                }
            }
        }
    }

    function invert(path) {
        return rotateToSmallest(path.slice().reverse());
    }

    function rotateToSmallest(path) {
        let n = path.indexOf(Math.min(...path));
        return path.slice(n).concat(path.slice(0, n));
    }

    function isNew(path) {
        return !cycles.some(cycle => JSON.stringify(cycle) === JSON.stringify(path));
    }

    function visited(node, path) {
        return path.includes(node);
    }

    for (let edge of graph) {
        for (let node of edge) {
            findNewCycles([node]);
        }
    }
    console.log(graph)
    console.log(cycles)

    for (let cy of cycles) {
        console.log(cy);
    }



}

export const JoinPainter = (props) => {
    const theme = useTheme();
    const [allMaps, setAllMaps] = useState([]);
    const auth = useContext(AuthContext)
    const { testBtn } = props
    const { testBtn2 } = props
    const { setImageObjects } = props
    const { newId } = props
    const { setNewId } = props
    const { enable3D } = props
    const { setCons } = props
    const { setLabs } = props
    const { mapToDraw } = props

    const { ImageObjects } = props;
    const [connections, setConnections] = React.useState([]);

    const { setImageChanged } = props
    const { ImageChanged } = props
    const { selectedItemCoordinates } = props
    const [newJoinId, setNewJoinId] = React.useState('1');
    const [labels, setLabels] = React.useState([])
    const [textList, setTextList] = React.useState([])

    const dbContext = useContext(DrawingBoardContext);


    const makeJoins = (xx, yy, id1, id2, obj1, obj2) => {
        // Creates a join between two img Objects
        if (id1 != id2) {
            if (id1 > id2) {
                var temp = id1
                id1 = id2
                id2 = temp
            }
            Joins.push({ img1Id: id1, img2Id: id2, type1: obj1, type2: obj2, x: xx, y: yy })
        }

    };

    const joinMaker = (selectedImgInstance, selectedItemCoordinates) => {

        // detect attachments and make joins accordingly,also removes unnecessary joins
        var selid = selectedImgInstance
        var selt = findElement(ImageObjects, "id", selid)
        if (selt != null) {
            var selAsset = selt.alt

            var coords2 = CoordinateTranslator(selectedItemCoordinates.x, selectedItemCoordinates.y, selectedItemCoordinates.w, selectedItemCoordinates.h, selectedItemCoordinates.angle, selAsset)

            // checking for attachment and making joins
            for (var img = 0; img < ImageObjects.length; img++) {
                if (ImageObjects[img] != null) {
                    var coords1 = CoordinateTranslator(ImageObjects[img].x, ImageObjects[img].y, ImageObjects[img].width, ImageObjects[img].height, ImageObjects[img].rotation, ImageObjects[img].alt)
                    for (var i = 0; i < coords1.length; i++) {
                        for (var j = 0; j < coords2.length; j++) {
                            if (checkJoins(coords1[i], coords2[j])) {
                                if (checkIds(selectedImgInstance, ImageObjects[img].id, coords1[i], Joins)) {
                                    makeJoins(coords1[i][0], coords1[i][1], selectedImgInstance, ImageObjects[img].id, selAsset, ImageObjects[img].alt)
                                }
                            }
                        }
                    }
                }
            }



            // Checking to Remove all unattached joins
            var toRemove = []

            for (var i = 0; i < Joins.length; i++) {

                for (var x = 0; x < Joins.length; x++) {

                }
                if (Joins[i].img1Id == selectedImgInstance || Joins[i].img2Id == selectedImgInstance) {
                    var valid = false;
                    for (var j = 0; j < coords2.length; j++) {
                        if (checkJoins([Joins[i].x, Joins[i].y], coords2[j])) {

                            valid = true
                        }
                    }
                    if (!valid) {
                        toRemove.push(i)
                    }
                }

            }

            //Remove all unattached joins
            for (var i = toRemove.length - 1; i >= 0; i--) {

                Joins.splice(toRemove[i], 1)
            }
            // making double joins into singles 
            var sJoins = splitBasedonID(Joins)
            toRemove = []
            for (var i = 0; i < sJoins.length; i++) {
                if (sJoins[i][1].length > 1) {
                    var avgX = 0
                    var avgY = 0
                    var indices = []
                    for (var j = 0; j < sJoins[i][1].length; j++) {
                        indices.push(sJoins[i][1][j][0])
                        avgX += sJoins[i][1][j][1].x
                        avgY += sJoins[i][1][j][1].y
                    }
                    avgX = avgX / sJoins[i][1].length
                    avgY = avgY / sJoins[i][1].length
                    var minIndex = sJoins[i][1][0][0]
                    var minDist = getDistance(sJoins[i][1][0][1].x, sJoins[i][1][0][1].y, avgX, avgY)

                    for (var j = 1; j < sJoins[i][1].length; j++) {
                        var ind = sJoins[i][1][j][0]
                        var dist = getDistance(sJoins[i][1][j][1].x, sJoins[i][1][j][1].y, avgX, avgY)
                        if (dist < minDist) {
                            minDist = dist
                            minIndex = ind
                        }
                    }
                    const index = indices.indexOf(minIndex);
                    indices.splice(index, 1);
                    toRemove = toRemove.concat(indices)
                }
            }

            toRemove.sort(function (a, b) { return a - b })

            //Remove all double joins
            for (var i = toRemove.length - 1; i >= 0; i--) {

                Joins.splice(toRemove[i], 1)
            }

        }
    }

    const joinRefresher = () => {


        for (var i = 0; i < ImageObjects.length; i++) {

            joinMaker(ImageObjects[i].id,
                {
                    x: ImageObjects[i].x,
                    y: ImageObjects[i].y,
                    w: ImageObjects[i].width,
                    h: ImageObjects[i].height,
                    angle: ImageObjects[i].rotation,
                }
            )

        }

    }
    const makeConnections = (ImageObjects, Joins) => {

        var cons = []
        for (var i = 0; i < ImageObjects.length; i++) {
            // console.log(ImageObjects[i])
            var edgeNo = -1
            var inJoin = false
            var points = [[0, 0], [0, 0]]
            for (var j = 0; j < Joins.length; j++) {
                //console.log(Joins[j])

                if (edgeNo < 1) {
                    if (Joins[j].img1Id == ImageObjects[i].id || Joins[j].img2Id == ImageObjects[i].id) {
                        inJoin = true
                        if (checkEdgeConnections(Joins[j].x, Joins[j].y, ImageObjects[i])) {

                            edgeNo += 1
                            points[edgeNo][0] = Joins[j].x
                            points[edgeNo][1] = Joins[j].y
                        }
                    }
                }
            }
            if (inJoin) {
                if (edgeNo == 0) {
                    if (specifyEdgeConnection(points[0][0], points[0][1], ImageObjects[i]) == "top") {

                        points[1][0] = points[0][0] - (ImageObjects[i].height * Math.cos((ImageObjects[i].rotation + 270) * (Math.PI / 180)))
                        points[1][1] = points[0][1] - (ImageObjects[i].height * Math.sin((ImageObjects[i].rotation + 270) * (Math.PI / 180)))

                    }
                    else {
                        points[1][0] = points[0][0] + (ImageObjects[i].height * Math.cos((ImageObjects[i].rotation + 270) * (Math.PI / 180)))
                        points[1][1] = points[0][1] + (ImageObjects[i].height * Math.sin((ImageObjects[i].rotation + 270) * (Math.PI / 180)))


                    }

                }
                else if (edgeNo == -1) {
                    var coords1 = CoordinateTranslator(ImageObjects[i].x, ImageObjects[i].y, ImageObjects[i].width, ImageObjects[i].height, ImageObjects[i].rotation, "Connector")

                    points[0][0] = coords1[4][0]
                    points[0][1] = coords1[4][1]
                    points[1][0] = coords1[5][0]
                    points[1][1] = coords1[5][1]

                }

                cons.push({
                    x1: points[0][0],
                    y1: points[0][1],
                    x2: points[1][0],
                    y2: points[1][1],
                    type: ImageObjects[i].alt
                })

            }
        }
        if (auth.selectedMap === '') {
            setConnections(cons)
        }

        //setConnections()
        //saving map to the database 
        if (props.mapName !== "") {
            //labels.map((lab)=>{
            //   cons.push(lab)
            //})
            console.log("Posting CONS: ", cons, "Labels: ", labels)
            ///postMap(cons, labels)
            //  .catch(console.error);
        }
    }
    const makeMap = (connections) => {
        console.log("Make map called on cons: ", connections)
        var imgs = []
        setImageObjects([])
        Joins = []
        var ids = '1'
        var temp_labels = []
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].type != 'label') {
                ids = String(parseInt(ids, 10) + 1)

                var dist1 = getDistance(0, 0, connections[i].x1, connections[i].y1)
                var dist2 = getDistance(0, 0, connections[i].x2, connections[i].y2)

                if (dist1 > dist2) {
                    var tempx = connections[i].x1
                    var tempy = connections[i].y1
                    connections[i].x1 = connections[i].x2
                    connections[i].y1 = connections[i].y2
                    connections[i].x2 = tempx
                    connections[i].y2 = tempy
                }

                var rot = (Math.atan((connections[i].y2 - connections[i].y1) / Math.abs(connections[i].x2 - connections[i].x1)) * (180 / Math.PI)) - 90
                var alt = connections[i].type
                var element = findElement(initial_menuItems, "alt", alt)
                var ea = element.enabledAnchors
                var kr = element.keepRatio
                var url = element.url
                var width = element.width
                var height = getDistance(connections[i].x1, connections[i].y1, connections[i].x2, connections[i].y2)
                var newx = connections[i].x1 - ((width / 2) * Math.cos((rot) * (Math.PI / 180)))
                var newy = connections[i].y1 - ((width / 2) * Math.sin((rot) * (Math.PI / 180)))
                //var coords1 = CoordinateTranslator(ImageObjects[i].x, ImageObjects[i].y, ImageObjects[i].width, ImageObjects[i].height, ImageObjects[i].rotation, "Connector")
                //                if(connections[i].type=='Door'){
                //                  rot=rot+90
                //                width= getDistance(connections[i].x1, connections[i].y1, connections[i].x2, connections[i].y2);
                //              height=element.height
                //            newx=connections[i].x1 + ((height / 2) * Math.cos((rot-90) * (Math.PI / 180)))
                //          newy=connections[i].y1 + ((height / 2) * Math.sin((rot-90) * (Math.PI / 180)))
                //    }


                imgs.push(

                    {
                        alt: alt,
                        url: url,
                        x: newx,
                        y: newy,
                        width: width,
                        height: height,
                        id: ids,
                        rotation: rot,
                        keepRatio: kr,
                        enabledAnchors: ea,
                        name: 'object',
                    },

                )
            }
            else if (connections[i].type == 'label') {
                //setLabels(prevList => [...prevList, connections[i]])
                temp_labels.push(connections[i])
            }

        }
        setLabels(temp_labels)
        ids = String(parseInt(ids, 10) + 1)

        setNewId(ids)

        setImageObjects(imgs)
        // console.log("IMAGES: ", imgs)

    }
    React.useEffect(() => {
        joinMaker(dbContext.selectedImgInstance, selectedItemCoordinates)

    }, [ImageChanged])

    React.useEffect(() => {
        if (connections.length > 0) {
            console.log("Enabling 3D")


            enable3D()
            setCons(connections) //passing to parent component
            setLabs(labels)
            DetectRooms(Joins.length, Joins, connections)
        }
    }, [connections])



    React.useEffect(() => {
        if (auth.selectedMap !== "" && !Array.isArray(auth.selectedMap)) {    //selected map isa map id 
            console.log("I will now make the map", auth.selectedMap)
            GetMap(auth.selectedMap).then(res => {
                console.log("Map Fetched:", res.data)
                dbContext.setMapDim(res.data.width, res.data.length)
                var tempCons = []
                if ('Labels' in res.data) {
                    console.log('Setting Labels: ', res.data.Labels)
                    for (var i = 0; i < res.data.Labels.length; i++) {
                        res.data.Labels[i].type = 'label'
                        var tempObj = res.data.Labels[i]
                        tempObj['id'] = i   //assign id
                        tempCons.push(tempObj)
                    }
                }
                auth.setSelectedMap("")

                var tempLabels = []
                if (Array.isArray(res.data.Joins) && res.data.Joins.length > 0) {
                    for (var i = 0; i < res.data.Joins.length; i++) {
                        tempCons.push({ x1: res.data.Joins[i].X1, y1: res.data.Joins[i].Y1, x2: res.data.Joins[i].X2, y2: res.data.Joins[i].Y2, type: res.data.Joins[i].Type })
                        /*if (res.data.Joins[i].type == 'label')
                            tempLabels.push(res.data.Joins[i])
                        }*/
                    }
                    console.log("Temp Cons: ", tempCons)
                    setConnections(tempCons)

                    //makeConnections(ImageObjects, Joins)
                    //console.log("This should not be printed")
                    makeMap(tempCons)

                }

                // makeMap(tempCons)
            }).catch(err => console.log("Error: ", err))
        }
        else if (Array.isArray(auth.selectedMap) && auth.selectedMap.length > 0) {
            console.log("Drawing Generated Map", auth.selectedMap)
            setAllMaps(auth.selectedMap)
            setConnections(auth.selectedMap[mapToDraw])
            //makeConnections(ImageObjects, Joins)
            makeMap(auth.selectedMap[mapToDraw])
            // joinRefresher()
            //console.log("IMAGE OBJECTS: ", ImageObjects)
            auth.setSelectedMap("")
        }

    }, [])

    React.useEffect(() => {
        if (allMaps.length > 0) {
            setConnections(allMaps[mapToDraw])
            makeMap(allMaps[mapToDraw])
        }
    }, [mapToDraw])

    React.useEffect(() => {

        joinRefresher()
        makeConnections(ImageObjects, Joins)
    }, [ImageObjects])

    React.useEffect(() => {

        joinRefresher()

        // makeConnections(ImageObjects, Joins)




    }, [testBtn])

    React.useEffect(() => {
        makeMap(connections)
    }, [auth.selectedMap])

    const handleLabelChange = (id, newLabel) => {
        setLabels(prevLabels =>
            prevLabels.map(lab => (lab.id === id ? { ...lab, label: newLabel } : lab))
        );
    };


    useEffect(() => { console.log("Labels Changed, new: ", labels) }, [labels])

    return (
        <>
            { /* <Rect 
                x ={20}
                y={20}
                width = {50}
                height = {20}
                fill={'red'}
                stroke={'black'}
                strokeWidth={2}
                onClick = {()=>{
                    console.log("Add Label clicked")
                }}>
                
            </Rect>}*/}
            {
                Joins.map((circ, i) => {
                    return (
                        <>
                            <Circle
                                x={circ.x}
                                y={circ.y}
                                radius={theme.custom.joins.outerRadius}
                                fill={theme.custom.joins.outerColor}
                            />
                            <Circle
                                x={circ.x}
                                y={circ.y}
                                radius={theme.custom.joins.innerRadius}
                                fill={theme.custom.joins.innerColor}
                            />
                        </>
                    );
                })
            }
            {
                labels.length > 0 &&
                labels.map((lab, index) => {
                    return (<>
                        <Rect
                            key={lab.id}
                            x={lab.x - 20}
                            y={lab.y}
                            width={lab.label.length * 7}
                            height={20}
                            fill="#FFFFFF"
                            opacity={0.9}
                        />
                        <Text text={lab.label.charAt(0).toUpperCase() + lab.label.slice(1)} x={lab.x - 20} y={lab.y} onDblClick={() => {
                            const newText = window.prompt('Update Label', lab.label);
                            if (newText) {
                                handleLabelChange(lab.id, newText);
                            }
                        }} />
                    </>
                    );
                })
            }


        </>

    );
};