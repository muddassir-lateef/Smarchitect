import React, { useContext } from 'react';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import { Stage, Layer, Image, Circle, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useState } from 'react';



//Noted Bug
// joining 3 images at a point create 2 join points instead of one

// need to implement something for joins in  a T shape

var Joins = [];
export const JoinPainter = (props) => {
    const { ImageObjects } = props;
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

        //p1
        coords.push([x, y])

        //p2
        coords.push([x + (w * Math.cos(angle * (Math.PI / 180))), y + (w * Math.sin(angle * (Math.PI / 180)))])

        //p3
        var x3 = x - (h * Math.cos((angle + 270) * (Math.PI / 180)))
        var y3 = y - (h * Math.sin((angle + 270) * (Math.PI / 180)))
        coords.push([x3, y3])

        //p4
        coords.push([x3 + (w * Math.cos((angle) * (Math.PI / 180))), y3 + (w * Math.sin((angle) * (Math.PI / 180)))])

        // midpoint of p1 and p3
        coords.push([(coords[0][0] + coords[2][0]) / 2, (coords[0][1] + coords[2][1]) / 2])

        // midpoint of p1 and p2
        coords.push([(coords[0][0] + coords[1][0]) / 2, (coords[0][1] + coords[1][1]) / 2])

        // midpoint of p3 and p4
        coords.push([(coords[2][0] + coords[3][0]) / 2, (coords[2][1] + coords[3][1]) / 2])

        // midpoint of p2 and p4
        coords.push([(coords[1][0] + coords[3][0]) / 2, (coords[1][1] + coords[3][1]) / 2])

        if (type == 'Wall') {
            var step = 5
            var xt = 0
            var yt = 0
            var edgeAvoidance = 2

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

    React.useEffect(() => {

        var selid = dbContext.selectedImgInstance
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
                                if (checkIds(dbContext.selectedImgInstance, ImageObjects[img].id, coords1[i])) {
                                    makeJoins(coords1[i][0], coords1[i][1], dbContext.selectedImgInstance, ImageObjects[img].id, selAsset, ImageObjects[img].alt)
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
                if (Joins[i].img1Id == dbContext.selectedImgInstance || Joins[i].img2Id == dbContext.selectedImgInstance) {
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
    }, [ImageChanged])
    return (
        <>
            {
                Joins.map((circ, i) => {
                    return (
                        <Circle
                            x={circ.x}
                            y={circ.y}
                            radius={5}
                            fill="red"
                        />
                    );
                })
            }
        </>

    );
};
