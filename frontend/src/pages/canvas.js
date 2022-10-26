import React, {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import DoorSymbol from "../assets/door_symbol.svg";
import WallSymbol from "../assets/wall_symbol.svg";
import WindowSymbol from "../assets/window_symbol.svg";
import RectangleSymbol from "../assets/Rectangle.svg";
import { Grid } from '@mui/material';

const ImageObject = ({ shapeProps, isSelected, onSelect, onChange }) => {
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
    height: 100
  },
  {
    alt: "Wall",
    url: WallSymbol,
    width: 16,
    height: 100
  },
  {
    alt: "Rectangle",
    url: RectangleSymbol,
    width: 100,
    height: 100
  },
  {
    alt: "Window",
    url: WindowSymbol,
    width: 12,
    height: 100
  }

  

]
export const Sketcher = () => {
  const auth = useContext(AuthContext);
  const [ImageObjects, setImageObjects] = React.useState(initialImages);
  const [newId, setNewId] = React.useState('1');
  const [selectedObj, selectObj] = React.useState(null);

  const [selectedId, selectShape] = React.useState(null);
  const dragUrl = React.useRef();
  const stageRef = React.useRef();
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();  
    if (clickedOnEmpty) {
      selectShape(null);  
    }
  };

  return (
    <div> 
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
            ])
          );
        }}
        onDragOver={(e) => e.preventDefault()}
      >

        <Stage
              style={{
                border: '2px solid',
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
                  }}
                  onChange={(newAttrs) => {
                    const rects = ImageObjects.slice();
                    rects[i] = newAttrs;
                    setImageObjects(rects);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      
      </div>
  );
};


