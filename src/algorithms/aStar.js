// Implementing aStar algorithm.
// aStar is a weighted algorithm,weights are non-negative in this algorithm.

// Performs aStar's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

export function aStar(grid, startNode, endNode) {
  const visitedNodesInOrder = []; // To animate visited nodes in order to animate the process of searching.
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes, endNode);
    const closestNode = unvisitedNodes.shift();

    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue; // Here isWall is the property of the node.

    visitedNodesInOrder.push(closestNode); // * Here pushing the node to the visited nodes wall are not included.

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;

    // Checking for the success condition.
    if (closestNode === endNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid);
  }
}

// Sorts the unvisitedNodes every time it is called.
function sortNodesByDistance(unvisitedNodes, endNode) {
  unvisitedNodes.sort((nodeA, nodeB) => {
    let distance_between_current_node_end_node_A = Math.sqrt(
      Math.pow(nodeA.row - endNode.row, 2) +
        Math.pow(nodeA.col - endNode.col, 2)
    );

    let distance_between_current_node_end_node_B = Math.sqrt(
      Math.pow(nodeB.row - endNode.row, 2) +
        Math.pow(nodeB.col - endNode.col, 2)
    );

    return (
      nodeA.distance +
      distance_between_current_node_end_node_A -
      (nodeB.distance + distance_between_current_node_end_node_B)
    );
  });
}

// Sets the neighbour nodes distance and also the previous node property.
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance =
      node.distance + // current node
      neighbor.weight + // upcoming node weight if it has else 0
      1;

    // Now the neighbor distance is not infinity and because of it it will show among the top in unvisited nodes.
    neighbor.previousNode = node; // With this property we can backtrack and find the shortest path between the start and end node.
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node; //col and row are properties of the node.

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited); // filtering the visited node
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the aStar method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
