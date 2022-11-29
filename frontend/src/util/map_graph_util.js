import Konva from "konva";

export function generateTarget(targets, stage) {
    targets.push({
    id: 'target-' + targets.length,
    x: stage.width() * Math.random(),
    y: stage.height() * Math.random(), 
    });
    return targets;
}

// function to generate arrows between targets
export function generateConnectors(connectors, targets) {
    var number = targets.length;
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
    connectors.forEach((connect) => {
        var line = new Konva.Arrow({
          stroke: 'black',
          id: connect.id,
          fill: 'black',
        });
        layer.add(line);
    });

    targets.forEach((target) => {
        var node = new Konva.Circle({
          id: target.id,
          fill: Konva.Util.getRandomColor(),
          radius: 20 + Math.random() * 20,
          shadowBlur: 10,
          draggable: true,
        });
        layer.add(node);

        node.on('dragmove', () => {
          // mutate the state
          target.x = node.x();
          target.y = node.y();

          // update nodes from the new state
          updateObjects(targets, connectors, layer);
        });

        node.on('click', () => {
            setSelectedNode(node)
        });
    });
}
