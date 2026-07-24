import fs from "node:fs";

const data = JSON.parse(fs.readFileSync(new URL("../src/data/trip.json", import.meta.url), "utf8"));
const serialized = JSON.stringify(data).toLowerCase();

const forbidden = [
  "номер паспорта",
  "паспортные данные",
  "номер автомобиля",
  "pnr",
  "e-ticket"
];

const hits = forbidden.filter((item) => serialized.includes(item));
if (hits.length > 0) {
  throw new Error(`Forbidden public data found: ${hits.join(", ")}`);
}

if (!Array.isArray(data.days) || data.days.length !== 2) {
  throw new Error("Trip must contain exactly two days");
}

for (const day of data.days) {
  if (!day.date || !day.weekday || !Array.isArray(day.stops) || day.stops.length < 4) {
    throw new Error(`Incomplete day: ${day.date || "unknown"}`);
  }
  for (const stop of day.stops) {
    if (!stop.time || !stop.title || !stop.plan || !stop.status) {
      throw new Error(`Incomplete stop: ${stop.title || "unknown"}`);
    }
  }
}

const points = data.map?.points;
if (!Array.isArray(points) || points.length < 12) {
  throw new Error("Expected at least 12 map points");
}

const orders = new Set();
for (const point of points) {
  if (orders.has(point.order)) {
    throw new Error(`Duplicate map order: ${point.order}`);
  }
  orders.add(point.order);
  if (
    !point.label ||
    !point.title ||
    !point.type ||
    !point.dateLabel ||
    !point.role ||
    !Number.isFinite(point.lat) ||
    !Number.isFinite(point.lng) ||
    !point.description ||
    !point.navigateUrl
  ) {
    throw new Error(`Incomplete map point: ${point.order}`);
  }
}

for (const [routeName, routes] of Object.entries(data.map.routes)) {
  const routeList = routeName === "alternative" ? routes : [routes];
  for (const route of routeList) {
    for (const order of route) {
      if (!orders.has(order)) {
        throw new Error(`Unknown point ${order} in ${routeName} route`);
      }
    }
  }
}

for (const section of [
  "dayTwoOptions",
  "lodgingOptions",
  "food",
  "optionalNotes",
  "bookingChecklist",
  "sources"
]) {
  if (!Array.isArray(data[section]) || data[section].length === 0) {
    throw new Error(`Missing ${section}`);
  }
}

console.log("trip.json validation passed");
