import Konva from "konva";

export function generateTarget(targets, stage, offset, tar_tag) {
  //console.log("Offset received: ", offset)
    var x_pos = 10 + offset*70;
    var y_pos = 50;
    if (x_pos > stage.width() - 70 && offset > 10){
      offset = offset - 10;
      x_pos = 10 + offset*70; 
      y_pos = y_pos + 70;
    }
    targets.push({
    id: 'target-' + targets.length,
    x: x_pos,
    y: y_pos,
    tag: tar_tag,
    });
    return targets;
}

// function to generate arrows between targets
export function generateConnectors(connectors, targets) {
    var number = targets.length;
    //checking if there are enough tergets to add connectors 
    if (targets.length < 2) return connectors;
    while (connectors.length < number) {
      var from = 'target-' + Math.floor(Math.random() * targets.length);
      var to = 'target-' + Math.floor(Math.random() * targets.length);
      if (from === to) {
        continue;
      }
      connectors.push({
        id: 'connector-' + connectors.length,
        from: from,
        to: to,
      });
    }
    return connectors;
}

// function to generate arrows between targets
export function makeConnection(targets, connectors, from, to) {
  console.log("Making connecton from ", from, ", to ", to)
  //checking if there are enough tergets to add connectors 
  if (targets.length < 2) return connectors;
  // checking if the connection already exists
 for (var i=0; i<connectors.length; i++) {
    if(from === connectors[i].from && to === connectors[i].to){
      return connectors;
    }
    // connectors are already bi-directional
    if(to === connectors[i].from && from === connectors[i].to){
      return connectors;
    }

  };
    if (from === to) {
      return connectors;
    }
    connectors.push({
      id: 'connector-' + connectors.length,
      from: from,
      to: to,
    });
  return connectors;
}

export function getConnectorPoints(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    let angle = Math.atan2(-dy, dx);

    const radius = 50;

    return [
        from.x + -radius * Math.cos(angle + Math.PI),
        from.y + radius * Math.sin(angle + Math.PI),
        to.x + -radius * Math.cos(angle),
        to.y + radius * Math.sin(angle),
    ];
}

export function updateObjects(targets, connectors, layer) {
    targets.forEach((target) => {
      var node = layer.findOne('#' + target.id);
      node.x(target.x);
      node.y(target.y);
    });
    connectors.forEach((connect) => {
      var line = layer.findOne('#' + connect.id);
      var fromNode = layer.findOne('#' + connect.from);
      var toNode = layer.findOne('#' + connect.to);

      const points = getConnectorPoints(
        fromNode.position(),
        toNode.position()
      );
      line.points(points);
    });
}

export function drawNodes(connectors, targets, layer, setSelectedNode ){
    // generate nodes for the app
    console.log("Connectors: ", connectors.length)
    connectors.forEach((connect) => {
        var line = new Konva.Arrow({
          stroke: 'black',
          id: connect.id,
          fill: 'black',
        });
        layer.add(line);
    });

    targets.forEach((target) => {
        var rad = 10;
        if (target.tag.includes("bedroom")){
          rad = 40
        }
        else if(target.tag.includes("bathroom")){
          rad = 25
        }
        var node = new Konva.Circle({
          x: target.x,
          y: target.y,
          id: target.id,
          fill: Konva.Util.getRandomColor(),
          radius: rad,
          shadowBlur: 10,
          draggable: true,
          name: target.id,
        });
        layer.add(node);

        node.on('dragmove', () => {
          // mutate the state
          target.x = node.x();
          target.y = node.y();

          // update nodes from the new state
          updateObjects(targets, connectors, layer);
          var label = layer.findOne((obj)=>
            obj.attrs.id === target.tag
          );
         // console.log("LABEL TO MOVE: ", label)
          label.x(node.x() - 30);
          label.y(node.y() - 10);
          
        });

        node.on('click', () => {
            console.log("ID of clicked node: ", node.id())
            setSelectedNode(node)
        });

        var simpleLabel = new Konva.Label({
          id: target.tag,
          x: target.x - 30,
          y: target.y - 10,
          opacity: 0.75,
        });
        simpleLabel.add(
          new Konva.Tag({
            fill: 'white',
          })
        );
        simpleLabel.add(
          new Konva.Text({
            text: target.tag,
            fontFamily: 'Calibri',
            fontSize: 12,
            padding: 2,
            fill: 'black',
          })
        );
        layer.add(simpleLabel)
        //console.log("Label added to layer: ", simpleLabel)
      

    });


}
