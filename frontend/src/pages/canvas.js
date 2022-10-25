import { Text } from 'konva/lib/shapes/Text';
import React from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';


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
    url: "https://svgshare.com/i/nfP.svg",
    width: 100,
    height: 100
  },
  {
    alt: "Wall",
    url: "https://svgshare.com/i/nfn.svg",
    width: 16,
    height: 100
  },
  {
    alt: "Window",
    url: "https://svgshare.com/i/nf7.svg",
    width: 16,
    height: 100
  }

  

]
export const Sketcher = () => {
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
      {imageUrls.map((img1, i) => {
        return (

          <img

            style={{ width: '100px',height: '100px' }}
            alt={img1.alt}
            src={img1.url}
            draggable="true"
            onDragStart={(e) => {
              dragUrl.current = e.target.src;
              selectObj(img1)
            }}
          />

        );
      })}




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
                
                url: dragUrl.current,
                x: stageRef.current.getPointerPosition().x,
                y: stageRef.current.getPointerPosition().y,
                width: selectedObj.width,
                height: selectedObj.height,
                id: newId,
              },
            ])
          );
        }}
        onDragOver={(e) => e.preventDefault()}
      >

        <Stage
          width={window.innerWidth}
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


