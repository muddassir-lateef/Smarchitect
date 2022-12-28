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

    const CoordinateTranslator = (x, y, w, h, angle) => {

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
        coords.push([(coords[2][0]+coords[3][0])/2,(coords[2][1]+coords[3][1])/2])

        // midpoint of p2 and p4
        coords.push([(coords[1][0]+coords[3][0])/2,(coords[1][1]+coords[3][1])/2])

        return coords


    };
    const makeJoins = (xx, yy, id1, id2) => {
        if (id1 != id2) {
            if (id1 > id2) {
                var temp = id1
                id1 = id2
                id2 = temp
            }
            Joins.push({ img1Id: id1, img2Id: id2, x: xx, y: yy })
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

    React.useEffect(() => {


        var coords2 = CoordinateTranslator(selectedItemCoordinates.x, selectedItemCoordinates.y, selectedItemCoordinates.w, selectedItemCoordinates.h, selectedItemCoordinates.angle)

        // checking for attachment and making joins
        for (var img = 0; img < ImageObjects.length; img++) {
            if (ImageObjects[img] != null) {
                var coords1 = CoordinateTranslator(ImageObjects[img].x, ImageObjects[img].y, ImageObjects[img].width, ImageObjects[img].height, ImageObjects[img].rotation)
                for (var i = 0; i < coords2.length; i++) {
                    for (var j = 0; j < coords2.length; j++) {

                        if (checkJoins(coords1[i], coords2[j])) {
                            if (checkIds(dbContext.selectedImgInstance, ImageObjects[img].id, coords1[i])) {
                                makeJoins(coords1[i][0], coords1[i][1], dbContext.selectedImgInstance, ImageObjects[img].id)
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
        toRemove = []

        for (var i = 0; i < Joins.length; i++) {

            for (var x = 0; x < Joins.length; x++) {

            }
            if (Joins[i].img1Id == dbContext.selectedImgInstance || Joins[i].img2Id == dbContext.selectedImgInstance) {
                var valid = false;
                for (var j = 0; j < 4; j++) {
                    if (checkJoins([Joins[i].x, Joins[i].y], coords2[j])) {

                        valid = true
                    }
                }
                if (!valid) {
                    toRemove.push(i)
                }
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
