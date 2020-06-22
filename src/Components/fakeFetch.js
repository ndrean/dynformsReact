/*
 Generates GeoJSON FeatureCollection of random points based on
 he center coordinates passed in.
 */

const fetchFakeData = ({ lat, lng, radius }) => {
  function getRandomCoords({ lng, lat, radius }) {
    const r = 0.4 * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const rlat = lat + r * Math.cos(theta);
    const rlng = lng + r * Math.sin(theta);
    return [rlng, rlat];
  }

  const newFeaturesList = [];
  for (let i = 0; i < 5; i++) {
    const id = i;
    const [dlng, dlat] = getRandomCoords({ lat, lng, radius });

    const dateStart = new Date("2020-09-01") + i;
    const dateEnd = dateStart;
    const setType = (i) => {
      return i % 2 === 0 ? "kite" : "bike";
    };

    newFeaturesList.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [dlng, dlat],
        // [dlng + 0.1, dlat + 0.1],
        // ],
      },
      properties: {
        type: setType(i),

        username: "Fred",
        phone: 44123456789,
        dateStart: dateStart,
        dateEnd: dateEnd,
        id: id,
        nbParticipants: id,
        name: `Random Point #${id}`,
      },
    });
  }

  function distance([a, b], [c, d]) {
    return Math.sqrt((c - a) ** 2 + (d - b) ** 2) * 111;
  }

  return Promise.resolve({
    type: "FeatureCollection",
    features: newFeaturesList,
  });
};

/*
Generates a random point within 0.025 radius of map center coordinates.
*/

export default fetchFakeData;
