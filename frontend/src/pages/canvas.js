import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';

import { Button, Card, CardContent, Typography, CardActions, Grid } from '@mui/material';
import { CSVLink } from "react-csv";
import PostAddIcon from '@mui/icons-material/PostAdd';
import Papa from "papaparse";
import { maxHeight } from '@mui/system';




const ImageObject = ({ shapeProps, isSelected, onSelect, onChange, attributeTrack }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const [img] = useImage(shapeProps.url);
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Image
        image={img}
        onClick={onSelect}
        //onDragMove={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
          attributeTrack({ x: e.target.x(), y: e.target.y(), angle: e.target.rotation() })

        }}

        onDragMove={(e) => {

          attributeTrack({ x: e.target.x(), y: e.target.y(), angle: e.target.rotation() })

        }}

        onTransform={(e) => {
          const node = shapeRef.current;
          attributeTrack({ x: node.x(), y: node.y(), angle: node.rotation() })

        }}

        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          console.log("On Transform end called")

          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
          attributeTrack({ x: node.x(), y: node.y(), angle: node.rotation() })

        }}

      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
          rotationSnaps={[0, 90, 180, 270]}
          keepRatio={shapeProps.keepRatio}
          enabledAnchors={shapeProps.enabledAnchors}
        />
      )}
    </React.Fragment>
  );
};

const initialImages = [
];


const headers = [
  { label: "Type", key: "type" },
  { label: "Width", key: "width" },
  { label: "Height", key: "height" },
  { label: "x", key: "x" },
  { label: "y", key: "y" },
  { label: "id", key: "id" },
  { label: "url", key: "url" },
  { label: "rotation", key: "rotation" },
  { label: "keepRatio", key: "keepRatio" },
  { label: "enabledAnchors", key: "enabledAnchors" },


];

export const Sketcher = () => {
  const auth = useContext(AuthContext);
  const [ImageObjects, setImageObjects] = React.useState(initialImages);
  const [newId, setNewId] = React.useState('1');
  const [selectedItemCoordinates, setSelectedItemCoordinates] = React.useState({ x: 0, y: 0, angle: 0 })
  const [selectedId, selectShape] = React.useState(null);
  const stageRef = React.useRef();
  const [exportData, setExportData] = React.useState([]);
  const [parsedInputData, setParsedInputData] = useState("");

  React.useEffect(() => {
    if (parsedInputData !== null) {
      var tempList = [];
      // console.log("LENGTH: ", parsedInputData.length)
      for (let i = 1; i < parsedInputData.length; i++) {
        tempList.push({
          alt: parsedInputData[i][0],
          url: parsedInputData[i][6],
          x: parseFloat(parsedInputData[i][3]),
          y: parseFloat(parsedInputData[i][4]),
          width: parseFloat(parsedInputData[i][1]),
          height: parseFloat(parsedInputData[i][2]),
          id: parsedInputData[i][5],
          rotation: parseFloat(parsedInputData[i][7]),
          keepRatio: (parsedInputData[i][8] === 'true'),
          enabledAnchors: parsedInputData[i][9].split(',')

        })
      }

      setImageObjects(tempList.slice())

      const tempExp = []
      for (let i = 1; i < parsedInputData.length; i++) {
        tempExp.push({
          type: parsedInputData[i][0],
          width: parseFloat(parsedInputData[i][1]),
          height: parseFloat(parsedInputData[i][2]),
          x: parseFloat(parsedInputData[i][3]),
          y: parseFloat(parsedInputData[i][4]),
          id: parsedInputData[i][5],
          url: parsedInputData[i][6],
          rotation: parseFloat(parsedInputData[i][7]),
          keepRatio: (parsedInputData[i][8] === 'true'),
          enabledAnchors: parsedInputData[i][9].split(',')

        })
      }
      setExportData(tempExp.slice());
    }
  }, [parsedInputData])

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      setSelectedItemCoordinates({ x: 0, y: 0, angle: 0 });
    }
  };

  const handleExportClick = () => {

  }




  return (
    <div>
      <Button variant="contained" component="label" color="primary">

        <PostAddIcon /> Upload a file
        <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={(e) => {
          const files = e.target.files;
          console.log(files);
          if (files) {
            console.log(files[0]);
            Papa.parse(files[0], {
              complete: function (results) {
                console.log("Finished:", results.data);
                setParsedInputData(results.data);
              }
            }
            )
          }
        }} />
      </Button>

      <div


        onDrop={(e) => {
          e.preventDefault();
          // register event position
          stageRef.current.setPointersPositions(e);
          // add image
          setNewId(String(parseInt(newId, 10) + 1))
          setImageObjects(
            ImageObjects.concat([
              {
                url: auth.selectedSource,
                x: stageRef.current.getPointerPosition().x,
                y: stageRef.current.getPointerPosition().y,
                width: auth.selectedAsset.width,
                height: auth.selectedAsset.height,
                id: newId,
                rotation: auth.selectedAsset.rotation,
                keepRatio: auth.selectedAsset.keepRatio,
                enabledAnchors: auth.selectedAsset.enabledAnchors
              },
            ]),

          );
          setExportData(
            exportData.concat({
              type: auth.selectedAsset.alt,
              width: auth.selectedAsset.width,
              height: auth.selectedAsset.height,
              x: stageRef.current.getPointerPosition().x,
              y: stageRef.current.getPointerPosition().y,
              id: newId,
              url: auth.selectedAsset.url,
              rotation: auth.selectedAsset.rotation,
              keepRatio: auth.selectedAsset.keepRatio,
              enabledAnchors: auth.selectedAsset.enabledAnchors



            })
          )
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Grid container sx={{ mt: 1 }}>
          <Stage
            style={{
              border: '2px solid',
              marginTop: '2px',
            }}
            width={900}
            height={800}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            ref={stageRef}
          >
            <Layer>
              {ImageObjects.map((rect, i) => {
                return (

                  <ImageObject
                    key={i}
                    shapeProps={rect}
                    isSelected={rect.id === selectedId}
                    onSelect={() => {
                      selectShape(rect.id);
                      setSelectedItemCoordinates({ x: rect.x, y: rect.y, angle: rect.rotation });
                    }}


                    onChange={(newAttrs) => {
                      const rects = ImageObjects.slice();
                      rects[i] = newAttrs;
                      setImageObjects(rects);
                      selectShape(rect.id);

                      for (let i = 0; i < exportData.length; i++) {
                        if (exportData[i].id == rect.id) {
                          exportData[i].x = newAttrs.x;
                          exportData[i].y = newAttrs.y;
                          exportData[i].width = newAttrs.width;
                          exportData[i].height = newAttrs.height;
                          exportData[i].rotation = newAttrs.rotation;
                          exportData[i].keepRatio = newAttrs.keepRatio;
                          exportData[i].enabledAnchors = newAttrs.enabledAnchors;
                        }

                      }
                    }}
                    attributeTrack={(newAttrs) => {
                      console.log("got it")
                      console.log(newAttrs)
                      setSelectedItemCoordinates(newAttrs);
                    }}
                  />
                );
              })}
            </Layer>
          </Stage>

          <Card sx={{ minWidth: 275, maxHeight: 300 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Entity Attributes
              </Typography>
              <Grid container sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: 20 }} color="red">
                  x:&nbsp;
                </Typography>
                <Typography sx={{ fontSize: 20 }} component="div">
                  {parseInt(selectedItemCoordinates.x)}
                </Typography>
              </Grid>

              <Grid container sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: 20 }} color="red">
                  y:&nbsp;
                </Typography>
                <Typography sx={{ fontSize: 20 }} component="div">
                  {parseInt(selectedItemCoordinates.y)}
                </Typography>
              </Grid>

              <Grid container sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: 20 }} color="red">
                  angle:&nbsp;
                </Typography>
                <Typography sx={{ fontSize: 20 }} component="div">
                  {parseInt(selectedItemCoordinates.angle)}
                </Typography>
              </Grid>

            </CardContent>

          </Card>
        </Grid>
      </div>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} textAlign="right">
          <Button sx={{ mt: 1 }} variant="contained" onClick={handleExportClick}>
            <CSVLink style={{ textDecoration: 'none', color: 'white' }} data={exportData} headers={headers}>
              Export Map Data
            </CSVLink>
          </Button>
        </Grid>
      </Grid>

    </div>
  );
};


