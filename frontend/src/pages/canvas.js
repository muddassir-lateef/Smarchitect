import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import DoorSymbol from "../assets/door_symbol.svg";
import WallSymbol from "../assets/wall_symbol.svg";
import WindowSymbol from "../assets/window_symbol.svg";
import RectangleSymbol from "../assets/Rectangle.svg";
import { Button, getNativeSelectUtilityClasses, Grid } from '@mui/material';
import { CSVLink } from "react-csv";
import PostAddIcon from '@mui/icons-material/PostAdd';
import Papa from "papaparse";

const allowedExtensions = ["csv"];



const ImageObject = ({ shapeProps, isSelected, onSelect, onChange, onDragMove }) => {
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
        onDragMove={onDragMove}
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
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          console.log("Displaying the X of laptop")
          console.log(node.x())
          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const initialImages = [
];
const imageUrls = [
  {
    alt: "Door",
    url: DoorSymbol,
    width: 100,
    height: 100,
    x: 0,
    y: 0
  },
  {
    alt: "Wall",
    url: WallSymbol,
    width: 16,
    height: 100,
    x: 0,
    y: 0
  },
  {
    alt: "Rectangle",
    url: RectangleSymbol,
    width: 100,
    height: 100,
    x: 0,
    y: 0
  },
  {
    alt: "Window",
    url: WindowSymbol,
    width: 12,
    height: 100,
    x: 0,
    y: 0
  }



]


const headers = [
  { label: "Type", key: "type" },
  { label: "Width", key: "width" },
  { label: "Height", key: "height" },
  { label: "x", key: "x" },
  { label: "y", key: "y" },
  { label: "id", key: "id" },
  { label: "url", key: "url" }
];

export const Sketcher = () => {
  const auth = useContext(AuthContext);
  const [ImageObjects, setImageObjects] = React.useState(initialImages);
  const [newId, setNewId] = React.useState('1');
  const [selectedItemCoordinates, setSelectedItemCoordinates] = React.useState({ x: 0, y: 0 })
  const [selectedId, selectShape] = React.useState(null);
  const stageRef = React.useRef();
  const [exportData, setExportData] = React.useState([]);
  const [parsedInputData, setParsedInputData] = useState("");

  React.useEffect(()=>{
    if (parsedInputData !== null){
      var tempList = [];
     // console.log("LENGTH: ", parsedInputData.length)
      for (let i=1; i<parsedInputData.length; i++){
        tempList.push({
          url: parsedInputData[i][6],
          x: parseFloat(parsedInputData[i][3]),
          y: parseFloat(parsedInputData[i][4]),
          width: parseFloat(parsedInputData[i][1]),
          height: parseFloat(parsedInputData[i][2]),
          id: parsedInputData[i][5]
        })
      }

      setImageObjects(tempList.slice())
      console.log("TEMP LIST: ", tempList)
    }
  }, [parsedInputData])

  React.useEffect(() => {
    // eslint-disable-next-line
    const tempObj = ImageObjects.find(item => item.id == selectedId)
    if (tempObj !== null && typeof tempObj === 'object')
      setSelectedItemCoordinates({ x: tempObj.x, y: tempObj.y })
  }, [selectedId])

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleExportClick = () => {

  }

  


  return (
    <div>
     <Button variant="contained" component="label" color="primary">
        {" "}
        <PostAddIcon/> Upload a file
        <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={(e) => {
          const files = e.target.files;
          console.log(files);
          if (files) {
            console.log(files[0]);
            Papa.parse(files[0], {
              complete: function(results) {
                console.log("Finished:", results.data);
                setParsedInputData(results.data);
              }}
            )
          }
        }}  />
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
              url: auth.selectedAsset.url
            })
          )
        }}
        onDragOver={(e) => e.preventDefault()}
      >

        <Stage
          style={{
            border: '2px solid',
            marginTop: '2px',
          }}
          width={950}
          height={window.innerHeight}
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
                    console.log("Set through select")
                  }}
                  onDragMove={() => {
                    selectShape(rect.id);
                    console.log("Set through drag")
                  }}

                  onChange={(newAttrs) => {
                    const rects = ImageObjects.slice();
                    rects[i] = newAttrs;
                    setImageObjects(rects);
                    selectShape(rect.id);
                    console.log("NEW", newAttrs)
                    for (let i = 0; i < exportData.length; i++) {
                      if (exportData[i].id == rect.id) {
                        exportData[i].x = newAttrs.x;
                        exportData[i].y = newAttrs.y;
                        exportData[i].width = newAttrs.width;
                        exportData[i].height = newAttrs.height;
                      }
                    }
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} textAlign="right">
          <Button sx={{ mt: 1 }} variant="contained" onClick={handleExportClick}>
            <CSVLink style={{ textDecoration: 'none' }} data={exportData} headers={headers}>
              Export Map Data
            </CSVLink>
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};


