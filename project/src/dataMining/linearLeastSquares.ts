import { Point } from "chart.js";

const linearLeastSquares = (points: Point[]): [Point, Point] => {
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let max_x = 0;
  let min_x = Infinity;

  if (points.length <= 1) {
    return [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
  }

  for (const point of points) {
    sum_x += point.x;
    sum_y += point.y;
    sum_xx += point.x * point.x;
    sum_xy += point.x * point.y;
    max_x = Math.max(point.x, max_x);
    min_x = Math.min(point.x, min_x);
  }

  /************ Calculate k and m ************/
  const k =
    (points.length * sum_xy - sum_x * sum_y) /
    (points.length * sum_xx - sum_x * sum_x);
  const m = sum_y / points.length - (k * sum_x) / points.length;

  /***** Calculate start and end points ******/
  const start: Point = { x: min_x, y: k * min_x + m };
  const end: Point = { x: max_x, y: k * max_x + m };

  return [start, end];
};

export default linearLeastSquares;
