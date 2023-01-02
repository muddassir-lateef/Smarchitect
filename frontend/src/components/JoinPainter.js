import React, { useContext } from 'react';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import { Stage, Layer, Image, Circle, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useState } from 'react';


import DoorSymbol from "../assets/door_symbol.svg";
import WallSymbol from "../assets/wall_symbol.svg";
import WindowSymbol from "../assets/window_symbol.svg";
import StairsSymbol from "../assets/stairs_symbol.svg";

const initial_menuItems = [
    //eligible anchors: ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
    {
        alt: "Wall",
        url: WallSymbol,
        width: 15,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-center', 'bottom-center'],

    },
    {
        alt: "Door",
        url: DoorSymbol,
        width: 70,
        height: 50,
        rotation: 0,
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],

    },
    {
        alt: "Window",
        url: WindowSymbol,
        width: 20,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-center', 'bottom-center'],

    },
    {
        alt: "Stairs",
        url: StairsSymbol,
        width: 31,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'],


    },


]

//Noted Bug
// joining 3 images at a point leads to incorrect connections


var Joins = [];

export const JoinPainter = (props) => {
    const { testBtn } = props
    const { testBtn2 } = props
    const { setImageObjects } = props
    const { newId } = props
    const { setNewId } = props

    const { ImageObjects } = props;
    const [connections, setConnections] = React.useState([]);

    const { setImageChanged } = props
    const { ImageChanged } = props
    const { selectedItemCoordinates } = props
    const [newJoinId, setNewJoinId] = React.useState('1');

    const dbContext = useContext(DrawingBoardContext);


    //
    //    p1____________________p2
    //     |                    |
    //     |                    |
    //     |                    |
    //     |____________________|
    //    p3                    p4

    const CoordinateTranslator = (x, y, w, h, angle, type) => {

        var coords = []

        if (type != "Door") {
            //p1
            coords.push([x, y])

            //p2
            coords.push([x + (w * Math.cos(angle * (Math.PI / 180))), y + (w * Math.sin(angle * (Math.PI / 180)))])
        }

        //p3
        var x3 = x - (h * Math.cos((angle + 270) * (Math.PI / 180)))
        var y3 = y - (h * Math.sin((angle + 270) * (Math.PI / 180)))
        coords.push([x3, y3])

        //p4
        coords.push([x3 + (w * Math.cos((angle) * (Math.PI / 180))), y3 + (w * Math.sin((angle) * (Math.PI / 180)))])

        if (type != "Door") {

            if (type != "Connector") {
                // midpoint of p1 and p3
                coords.push([(coords[0][0] + coords[2][0]) / 2, (coords[0][1] + coords[2][1]) / 2])
                // midpoint of p2 and p4
                coords.push([(coords[1][0] + coords[3][0]) / 2, (coords[1][1] + coords[3][1]) / 2])


            }
            // midpoint of p1 and p2
            coords.push([(coords[0][0] + coords[1][0]) / 2, (coords[0][1] + coords[1][1]) / 2])

            // midpoint of p3 and p4
            coords.push([(coords[2][0] + coords[3][0]) / 2, (coords[2][1] + coords[3][1]) / 2])


            if (type == 'Wall') {
                var step = 5
                var xt = 0
                var yt = 0
                var edgeAvoidance = 5

                //generating points btwn p1 and p3
                for (var i = edgeAvoidance * step; i < h - edgeAvoidance * step; i += step) {
                    xt = x - (i * Math.cos((angle + 270) * (Math.PI / 180)))
                    yt = y - (i * Math.sin((angle + 270) * (Math.PI / 180)))
                    coords.push([xt, yt])
                }

                //generating points btwn p2 and p4
                for (var i = edgeAvoidance * step; i < h - edgeAvoidance * step; i += step) {
                    xt = coords[1][0] - (i * Math.cos((angle + 270) * (Math.PI / 180)))
                    yt = coords[1][1] - (i * Math.sin((angle + 270) * (Math.PI / 180)))
                    coords.push([xt, yt])
                }

            }
        }
        return coords


    };
    const makeJoins = (xx, yy, id1, id2, obj1, obj2) => {
        if (id1 != id2) {
            if (id1 > id2) {
                var temp = id1
                id1 = id2
                id2 = temp
            }
            Joins.push({ img1Id: id1, img2Id: id2, type1: obj1, type2: obj2, x: xx, y: yy })
        }

    };
    const checkJoins = (coord1, coord2) => {

        if (Math.abs(coord1[0] - coord2[0]) < 5 && Math.abs(coord1[1] - coord2[1]) < 5) {
            return true
        }
        else {
            return false
        }

    };
    const checkEdgeConnections = (x, y, image) => {

        var coords1 = CoordinateTranslator(image.x, image.y, image.width, image.height, image.rotation, "Connector")
        for (var i = 0; i < coords1.length; i++) {
            if (checkJoins([x, y], coords1[i])) {
                return true
            }

        }
        return false
    }

    const specifyEdgeConnection = (x, y, image) => {

        var coords1 = CoordinateTranslator(image.x, image.y, image.width, image.height, image.rotation, "Connector")
        for (var i = 0; i < coords1.length; i++) {
            if (checkJoins([x, y], coords1[i])) {
                if (i == 0 || i == 1 || i == 4) {
                    return "top"
                }
                else {
                    return "bottom"
                }
            }

        }
        return false
    }

    const checkIds = (id1, id2, coord1) => {

        if (id1 == null || id2 == null) {
            return false
        }
        if (id1 > id2) {
            var temp = id1
            id1 = id2
            id2 = temp
        }

        for (var i = 0; i < Joins.length; i++) {
            if (id1 == Joins[i].img1Id && id2 == Joins[i].img2Id) {
                if (checkJoins(coord1, [Joins[i].x, Joins[i].y])) {
                    return false
                }
            }
        }
        return true
    };
    const findElement = (arr, propName, propValue) => {
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] == propValue)
                return arr[i];

        return null
    }
    const findEntry = (arr, entry) => {

        for (var i = 0; i < arr.length; i++) {
            if (JSON.stringify(arr[i][0]) === JSON.stringify(entry)) {

                return i
            }
        }
    }

    const checkInclusion = (arr, entry) => {

        for (var i = 0; i < arr.length; i++) {
            if (JSON.stringify(arr[i]) === JSON.stringify(entry)) {
                return true
            }
        }
        return false
    }

    const splitBasedonID = (arr) => {
        var tArr = []
        var temp = []
        for (var i = 0; i < arr.length; i++) {
            if (checkInclusion(temp, { id1: arr[i].img1Id, id2: arr[i].img2Id })) {
                tArr[findEntry(tArr, { id1: arr[i].img1Id, id2: arr[i].img2Id })][1].push([i, arr[i]])
            }
            else {
                temp.push({ id1: arr[i].img1Id, id2: arr[i].img2Id })
                tArr.push([{ id1: arr[i].img1Id, id2: arr[i].img2Id }, [[i, arr[i]]]])
            }
        }
        return tArr
    }

    const getDistance = (xA, yA, xB, yB) => {
        var xDiff = xA - xB;
        var yDiff = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    const joinMaker = (selectedImgInstance, selectedItemCoordinates) => {

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
                                if (checkIds(selectedImgInstance, ImageObjects[img].id, coords1[i])) {
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

            // making joins into connections


        }
        console.log(Joins)
        console.log(connections)

    }
    React.useEffect(() => {
        joinMaker(dbContext.selectedImgInstance, selectedItemCoordinates)

    }, [ImageChanged])

    React.useEffect(() => {

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


        var cons = []
        for (var i = 0; i < ImageObjects.length; i++) {
            console.log(ImageObjects[i])
            var edgeNo = -1
            var inJoin = false
            var points = [[0, 0], [0, 0]]
            for (var j = 0; j < Joins.length; j++) {
                console.log(Joins[j])

                if (edgeNo < 1) {
                    if (Joins[j].img1Id == ImageObjects[i].id || Joins[j].img2Id == ImageObjects[i].id) {
                        inJoin = true
                        if (checkEdgeConnections(Joins[j].x, Joins[j].y, ImageObjects[i])) {
                            console.log("edge here")
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
        setConnections(cons)

        console.log(connections)


    }, [testBtn])
    React.useEffect(() => {
        var imgs = []
        setImageObjects([])
        Joins = []
        var ids = '1'
        for (var i = 0; i < connections.length; i++) {
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


            var rot = (Math.atan((connections[i].y2 - connections[i].y1) / (connections[i].x2 - connections[i].x1)) * (180 / Math.PI)) - 90
            var alt = connections[i].type
            var element = findElement(initial_menuItems, "alt", alt)
            var ea = element.enabledAnchors
            var kr = element.keepRatio
            var url = element.url
            var width = element.width
            var height = getDistance(connections[i].x1, connections[i].y1, connections[i].x2, connections[i].y2)
            //var coords1 = CoordinateTranslator(ImageObjects[i].x, ImageObjects[i].y, ImageObjects[i].width, ImageObjects[i].height, ImageObjects[i].rotation, "Connector")

            imgs.push(

                {
                    alt: alt,
                    url: url,
                    x: connections[i].x1 - ((width / 2) * Math.cos((rot) * (Math.PI / 180))),
                    y: connections[i].y1 - ((width / 2) * Math.sin((rot) * (Math.PI / 180))),
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
        ids = String(parseInt(ids, 10) + 1)

        setNewId(ids)

        setImageObjects(imgs)

    }, [testBtn2])


    return (
        <>
            {
                Joins.map((circ, i) => {
                    return (
                        <>
                            <Circle
                                x={circ.x}
                                y={circ.y}
                                radius={10}
                                fill="red"
                            />
                            <Circle
                                x={circ.x}
                                y={circ.y}
                                radius={7}
                                fill="white"
                            />
                        </>
                    );
                })
            }
        </>

    );
};
