const geojsonData1 = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-35.2115, -5.7954],
          [-38.7168, -3.6345], // !!!  lng, lat
          [-44.2403, -2.5266],
        ],
      },
      properties: {
        activity: "Kite",
        username: "Fred",
        phone: 44123456789,
        dateStart: new Date("2020-09-01"),
        dateEnd: "",
        id: 1,
        nbParticipants: 1,
        address: "toto",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [2.75, 45],
      },
      properties: {
        activity: "Bike",
        username: "Me",
        phone: 33123456,
        dateStart: new Date("2020-12-1"),
        dateEnd: "",
        id: 2,
        nbParticipants: 2,
        address: "toto",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-0.37, 45.2],
      },
      properties: {
        activity: "Bike",
        username: "Me",
        phone: 33123456,
        dateStart: new Date("2020-12-1"),
        id: 3,
        nbParticipants: 3,
        address: "bibi",
      },
    },
  ],
};
const geojsonData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [2.75, 45],
      },
      properties: {
        activity: "Kite",
        username: "Me",
        phone: 33123456,
        dateStart: new Date("2020-12-1"),
        dateEnd: "",
        id: 2,
        nbParticipants: 2,
        address: "toto",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-0.37, 45.2],
      },
      properties: {
        activity: "Bike",
        username: "Me",
        phone: 33123456,
        dateStart: new Date("2020-12-1"),
        id: 3,
        nbParticipants: 3,
        address: "bibi",
      },
    },
  ],
};

export { geojsonData };
