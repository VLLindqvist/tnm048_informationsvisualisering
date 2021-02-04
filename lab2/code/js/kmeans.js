/**
 * @Created Jan 25, 2018
 * @LastUpdate Jan 31, 2020
 * @author Kahin Akram
 */

function kmeans(data, k) {
  //Crap we need
  let iterations = 0;
  const maxLoops = 10;
  let qualityChange = 0;
  let oldqualitycheck = 0;
  let qualitycheck = 0;
  //   let converge = false;

  //Parse the data from strings to floats
  let new_array = parseData(data);

  //Task 4.1 - Select random k centroids
  let centroid = initCentroids(new_array, k);
  console.log(centroid);

  // //Prepare the array for different cluster indices
  // let clusterIndexPerPoint = new Array(new_array.length).fill(0);

  //Task 4.2 - Assign each point to the closest mean.
  let clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

  //Master loop -- Loop until quality is good
  while (iterations <= maxLoops) {
    //Task 4.3 - Compute mean of each cluster
    centroid = computeClusterMeans(new_array, clusterIndexPerPoint, k);
    // assign each point to the closest mean.
    clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

    //Task 4.4 - Do a quality check for current result
    oldqualitycheck = qualitycheck;
    qualitycheck = qualityCheck(centroid, new_array, clusterIndexPerPoint);
    qualityChange = qualitycheck - oldqualitycheck;

    //End the loop if...
    if (qualityChange <= 0) break;

    ++iterations;
  }

  //Return results
  return {
    assignments: clusterIndexPerPoint,
  };
}

/**
 * Parse data from strings to floats
 * Loop over data length
			loop over every i in data
				Fill array with parsed values, use parseFloat
 * @param {*} data
 * @return {array}
 */
function parseData(data) {
  return data.map((point) => {
    parsed = {};

    for (const key in point) {
      parsed[key] = Number.parseFloat(point[key]);
    }

    return parsed;
  });
}

function findMinMax(data) {
  let maxObj = Object.assign({}, data[0]);
  let minObj = Object.assign({}, data[0]);

  for (const point of data) {
    for (const key in point) {
      maxObj[key] = Math.max(maxObj[key], point[key]);
      minObj[key] = Math.min(minObj[key], point[key]);
    }
  }

  return [
    Math.max(...Object.values(maxObj)),
    Math.min(...Object.values(minObj)),
  ];
}

/**
 * Task 4.1 - Randomly place K points
 * Loop over data and Use floor and random in Math
 * @return {array} centroid
 */

function initCentroids(data, k) {
  // Find max and min
  const [max, min] = findMinMax(data);

  //Create k centroids
  return [...Array(k).keys()].map(() => {
    centroid = {};

    for (const key in data[0]) {
      centroid[key] = Math.random() * (max - min) + min;
    }

    return centroid;
  });
}

/**
 * Taks 4.2 - Assign each item to the cluster that has the closest centroid
 * Loop over points and fill array, use findClosestMeanIndex(points[i],means)
 * Return an array of closest mean index for each point.
 * @param points
 * @param means
 * @return {Array}
 */
function assignPointsToMeans(points, means) {
  return points.map((point) => findClosestMeanIndex(point, means));
}

/**
 * Calculate the distance to each mean, then return the index of the closest.
 * Loop over menas and fill distance array, use euclideanDistance(point,means[i])
 * return closest cluster use findIndexOfMinimum,
 * @param point
 * @param means
 * @return {Number}
 */
function findClosestMeanIndex(point, means) {
  return findIndexOfMinimum(
    means.map((mean) => euclideanDistance(point, mean))
  );
}

/**
 * Euclidean distance between two points in arbitrary dimension(column/axis)
 * @param {*} point1
 * @param {*} point2
 * @return {Number}
 */
function euclideanDistance(point1, point2) {
  if (
    point1 !== undefined ||
    point2 !== undefined ||
    point1.length != point2.length
  )
    throw "point1 and point2 must be of same dimension";

  return Math.sqrt(
    Object.keys(point1)
      .map((key) => Math.pow(point1[key] - point2[key], 2))
      .reduce((acc, val) => acc + val)
  );
}

/**
 * Return the index of the smallest value in the array.
 *  Loop over the array and find index of minimum
 * @param array
 * @return {Number}
 */
function findIndexOfMinimum(array) {
  return array.indexOf(Math.min.apply(null, array));
}

/**
 * //Task 4.3 - Compute mean of each cluster
 * For each cluster loop over assignment and check if ass. equal to cluster index
 * if true fill array
 * then if array is not empty fill newMeans, use averagePosition(array)
 * @param {*} points
 * @param {*} assignments
 * @param {*} k
 * @returns {array}
 */
function computeClusterMeans(points, assignments, k) {
  console.log(points);
  if (
    points !== undefined ||
    assignments !== undefined ||
    points.length != assignments.length
  )
    throw "points and assignments arrays must be of same dimension";

  return [...Array(k).keys()].map((clusterIdx) => {
    let clusterPoints = [],
      centroid;

    for (const [pointIdx, assignedClusterIdx] of Object.entries(assignments)) {
      if (assignedClusterIdx == clusterIdx) {
        // fill array
        clusterPoints.push(points[pointIdx]);
      }
    }

    if (Array.isArray(clusterPoints) && clusterPoints.length !== 0) {
      centroid = averagePosition(clusterPoints);
    }

    return centroid;
  });
}

/**
 * Calculate quality of the results
 * For each centroid loop new_array and check if clusterIndexPerPoint equal clsuter
 * if true loop over centriod and calculate qualitycheck.
 * @param {*} centroid
 * @param {*} new_array
 * @param {*} clusterIndexPerPoint
 */
function qualityCheck(centroid, new_array, clusterIndexPerPoint) {
  console.log(new_array);
  // centroid.forEach((centroidIdx)=>{

  // });
  return qualitycheck;
}

/**
 * Calculate average of points
 * @param {*} points
 * @return {number}
 */
function averagePosition(points) {
  let sums = points[0];
  for (let i = 1; i < points.length; i++) {
    let point = points[i];
    for (let j = 0; j < point.length; j++) {
      sums[j] += point[j];
    }
  }

  for (let k = 0; k < sums.length; k++) sums[k] /= points.length;

  return sums;
}
