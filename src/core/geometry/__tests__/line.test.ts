import { describe, it, expect } from "vitest";
import {
  createLine,
  lineLength,
  getPointOnLine,
  nearestPointOnSegment,
  segmentsIntersection,
  pointOnSegment,
} from "@core/geometry";

describe("Line Operations", () => {
  it("creates a line with start and end points", () => {
    const line = createLine({ x: 0, y: 0 }, { x: 10, y: 0 });
    expect(line.start.x).toBe(0);
    expect(line.end.x).toBe(10);
  });

  it("calculates line length correctly", () => {
    const line = createLine({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(lineLength(line)).toBe(5);
  });

  it("gets point on line at parameter t", () => {
    const line = createLine({ x: 0, y: 0 }, { x: 10, y: 0 });
    const point = getPointOnLine(line, 0.5);
    expect(point.x).toBe(5);
    expect(point.y).toBe(0);
  });

  it("finds nearest point on segment", () => {
    const segment = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 0 } };
    const point = { x: 5, y: 5 };
    const nearest = nearestPointOnSegment(segment, point);
    expect(nearest.point.x).toBe(5);
    expect(nearest.point.y).toBe(0);
    expect(nearest.distance).toBe(5);
  });

  it("detects intersection between segments", () => {
    const seg1 = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 0 } };
    const seg2 = { p1: { x: 5, y: -5 }, p2: { x: 5, y: 5 } };
    const result = segmentsIntersection(seg1, seg2);
    expect(result.intersects).toBe(true);
    expect(result.points.length).toBe(1);
    expect(result.points[0].point.x).toBe(5);
    expect(result.points[0].point.y).toBe(0);
  });

  it("detects non-intersecting segments", () => {
    const seg1 = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 0 } };
    const seg2 = { p1: { x: 0, y: 1 }, p2: { x: 10, y: 1 } };
    const result = segmentsIntersection(seg1, seg2);
    expect(result.intersects).toBe(false);
  });

  it("checks if point is on segment", () => {
    const segment = { p1: { x: 0, y: 0 }, p2: { x: 10, y: 0 } };
    expect(pointOnSegment({ x: 5, y: 0 }, segment)).toBe(true);
    expect(pointOnSegment({ x: 5, y: 1 }, segment)).toBe(false);
  });
});
