import { describe, it, expect } from "vitest";
import { createVector, addVectors, subtractVectors, distance, magnitude, normalize, dotProduct } from "@core/geometry";

describe("Vector Operations", () => {
  it("creates a vector with x and y coordinates", () => {
    const v = createVector(3, 4);
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  it("adds two vectors correctly", () => {
    const v1 = createVector(1, 2);
    const v2 = createVector(3, 4);
    const result = addVectors(v1, v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it("subtracts two vectors correctly", () => {
    const v1 = createVector(5, 6);
    const v2 = createVector(1, 2);
    const result = subtractVectors(v1, v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(4);
  });

  it("calculates magnitude correctly", () => {
    const v = createVector(3, 4);
    expect(magnitude(v)).toBe(5);
  });

  it("calculates distance between two points", () => {
    const p1 = createVector(0, 0);
    const p2 = createVector(3, 4);
    expect(distance(p1, p2)).toBe(5);
  });

  it("normalizes a vector correctly", () => {
    const v = createVector(3, 4);
    const normalized = normalize(v);
    expect(Math.abs(magnitude(normalized) - 1)).toBeLessThan(0.0001);
  });

  it("calculates dot product correctly", () => {
    const v1 = createVector(1, 2);
    const v2 = createVector(3, 4);
    expect(dotProduct(v1, v2)).toBe(11);
  });
});
