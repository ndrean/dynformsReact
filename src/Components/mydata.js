const geojsonFeature = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        type: "kite",
        username: "Fred",
        phone: 44123456789,
        dateStart: new Date("2020-09-01"),
        dateEnd: "",
        id: null,
        name: null,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-35.2115, -5.7954],
          [-38.7168, -3.6345], // !!!  lng, lat
          [-44.2403, -2.5266],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        type: "bike",
        username: "Me",
        phone: 33123456,
        date: new Date("2020-12-1"),
        dateEnd: "",
        name: null,
      },
      geometry: {
        type: "Point",
        coordinates: [0.45, 45],
      },
    },
    {
      type: "Feature",
      properties: {
        type: "bike",
        username: "Me",
        phone: 33123456,
        date: new Date("2020-12-1"),
        name: null,
      },
      geometry: {
        type: "Point",
        coordinates: [0.47, 45.2],
      },
    },
    {
      type: "Feature",
      properties: {
        type: "kite",
        username: "Me",
        phone: 33123456,
        date: new Date("2020-12-1"),
        dateEnd: "",
        name: null,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [0.46, 46.1],
          [0.56, 47.1],
        ],
      },
    },
  ],
};

const myLines = [
  {
    type: "LineString",
    coordinates: [
      [-100, 40],
      [-105, 45],
      [-110, 55],
    ],
  },
  {
    type: "LineString",
    coordinates: [
      [-105, 40],
      [-110, 45],
      [-115, 55],
    ],
  },
];

export { myLines, geojsonFeature };
