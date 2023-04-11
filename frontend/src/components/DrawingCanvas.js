import React, { useContext } from 'react';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import { Stage, Layer, Image, Transformer } from 'react-konva';
import { ImagePainter } from './ImagePainter'
import { JoinPainter } from './JoinPainter'

import { getLineGuideStops, getObjectSnappingEdges, getGuides, drawGuides } from '../util/snapping_util';

export const DrawingCanvas = (props) => {
    const stageW = 800
    const stageH = 800

    const { testBtn } = props
    const { testBtn2 } = props


    const { ImageObjects } = props
    const { setImageObjects } = props
    const { selectedItemCoordinates } = props
    const { setSelectedItemCoordinates } = props
    const stageRef = React.useRef();
    const { scale } = props
    const { setExportData } = props
    const { exportData } = props
    const { newId } = props
    const { setNewId } = props
    const [ImageChanged, setImageChanged] = React.useState(1)
    const dbContext = useContext(DrawingBoardContext);
    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            dbContext.setSelectedImgInstance(null);
            setSelectedItemCoordinates({ x: 0, y: 0, w: 0, h: 0, angle: 0 });

        }
    };


    return (
        <Stage
            style={{
                border: '2px solid',
                marginTop: '2px',
                border: '2px solid red'
            }}
            ref={stageRef}
            onMouseDown={(e) => {


                if (dbContext.selectedTool == "") {
                    checkDeselect(e);

                }
                else if (e.target._changedPointerPositions != undefined) {
                    setNewId(String(parseInt(newId, 10) + 1))

                    var transform = stageRef.current.getAbsoluteTransform().copy();

                    // to detect relative position we need to invert transform
                    transform.invert();
                    // now we find relative point
                    const pos = e.target.getStage().getPointerPosition();
                    var correctPos = transform.point(pos);
                    setImageObjects(
                        ImageObjects.concat([
                            {
                                alt: dbContext.selectedAsset.alt,
                                url: dbContext.selectedSource,
                                x: (correctPos.x * scale),
                                y: (correctPos.y * scale),
                                width: dbContext.selectedAsset.width,
                                height: dbContext.selectedAsset.height,
                                id: newId,
                                rotation: dbContext.selectedAsset.rotation,
                                keepRatio: dbContext.selectedAsset.keepRatio,
                                enabledAnchors: dbContext.selectedAsset.enabledAnchors,
                                name: 'object',
                            },
                        ]))

                    setExportData(
                        exportData.concat({
                            type: dbContext.selectedAsset.alt,
                            width: dbContext.selectedAsset.width,
                            height: dbContext.selectedAsset.height,
                            x: (correctPos.x * scale),
                            y: (correctPos.y * scale),
                            id: newId,
                            url: dbContext.selectedAsset.url,
                            rotation: dbContext.selectedAsset.rotation,
                            keepRatio: dbContext.selectedAsset.keepRatio,
                            enabledAnchors: dbContext.selectedAsset.enabledAnchors,

                        })
                    )


                }



            }}
            width={stageW}
            height={stageH}
            scaleX={scale}
            scaleY={scale}
            draggable={true}

        >
            <Layer
                onDragMove={(e) => {
                    const layer = e.target.parent;
                    const stage = layer.parent;
                    //console.log("Layer on Drag: ", e.target.parent) //layer 
                    e.target.parent.find('.guid-line').forEach((l) => l.destroy());
                    var lineGuideStops = getLineGuideStops(e.target, layer);  //obj and obj parent which is layer 
                    var itemBounds = getObjectSnappingEdges(e.target);

                    // now find where can we snap current object
                    var guides = getGuides(lineGuideStops, itemBounds);

                    // do nothing of no snapping
                    if (!guides.length) {
                        return;
                    }

                    drawGuides(guides, layer);
                    var absPos = e.target.absolutePosition();
                    // now force object position
                    guides.forEach((lg) => {
                        switch (lg.snap) {
                            case 'start': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        absPos.x = lg.lineGuide + lg.offset;
                                        break;
                                    }
                                    case 'H': {
                                        absPos.y = lg.lineGuide + lg.offset;
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'center': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        absPos.x = lg.lineGuide + lg.offset;
                                        break;
                                    }
                                    case 'H': {
                                        absPos.y = lg.lineGuide + lg.offset;
                                        break;
                                    }
                                }
                                break;
                            }
                            case 'end': {
                                switch (lg.orientation) {
                                    case 'V': {
                                        absPos.x = lg.lineGuide + lg.offset;
                                        break;
                                    }
                                    case 'H': {
                                        absPos.y = lg.lineGuide + lg.offset;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    });
                    e.target.absolutePosition(absPos);

                    //console.log(getLineGuideStops(e.target, e.target.parent));
                    //console.log(layer)
                }
                }
                onDragEnd={(e) => {
                    const layer = e.target.parent;
                    layer.find('.guid-line').forEach((l) => l.destroy());
                }}
            >
                <ImagePainter
                    ImageObjects={ImageObjects}
                    setImageObjects={setImageObjects}
                    setSelectedItemCoordinates={setSelectedItemCoordinates}
                    exportData={exportData}
                    setImageChanged={setImageChanged}
                    ImageChanged={ImageChanged}
                />
                <JoinPainter mapName={props.mapName} newId={newId} setNewId={setNewId} setImageObjects={setImageObjects} testBtn={testBtn} testBtn2={testBtn2} ImageObjects={ImageObjects} ImageChanged={ImageChanged} selectedItemCoordinates={selectedItemCoordinates} />
            </Layer>
        </Stage>

    );
};
