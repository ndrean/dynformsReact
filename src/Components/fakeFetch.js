/*
 Generates GeoJSON FeatureCollection of random points based on
 he center coordinates passed in.
 */

const fetchFakeData = ({ lat, lng, radius, activity }) => {
  function getRandomCoords({ lng, lat, radius }) {
    const r = 0.1 * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const rlat = lat + r * Math.cos(theta);
    const rlng = lng + r * Math.sin(theta);
    return [rlng, rlat];
  }

  const newFeaturesList = [];
  const newFeaturesPointList = [];
  for (let i = 0; i < 30; i++) {
    const id = i;
    const [dlng, dlat] = getRandomCoords({ lat, lng, radius });

    const dateStart = new Date("2020-09-01") + i;
    const dateEnd = dateStart;
    const setType = (i) => {
      if (i % 3 === 0) {
        return "Kite";
      } else if (i % 3 === 1) {
        return "Bike";
      } else {
        return "Canoe";
      }
    };

    if (setType(i) === activity) {
      newFeaturesPointList.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [dlng, dlat],
        },
        properties: {
          activity: setType(i),
          username: "Fred",
          phone: 44123456789,
          dateStart: dateStart,
          dateEnd: dateEnd,
          id: id,
          nbParticipants: id,
          address: `Random Point #${id}`,
        },
      });
      newFeaturesList.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [dlng, dlat],
            [dlng + 0.1, dlat + 0.1],
          ],
        },
        properties: {
          activity: setType(i),
          username: "Fred",
          phone: 44123456789,
          dateStart: dateStart,
          dateEnd: dateEnd,
          id: id,
          nbParticipants: id,
          address: `Random Point #${id}`,
        },
      });
    }
  }

  function distance([a, b], [c, d]) {
    return Math.sqrt((c - a) ** 2 + (d - b) ** 2) * 111;
  }

  return Promise.resolve(
    // {
    //   type: "FeatureCollection",
    //   features: newFeaturesList,
    // },
    {
      type: "FeatureCollection",
      features: newFeaturesPointList,
    }
  );
};

/*
Generates a random point within 0.025 radius of map center coordinates.
*/

export default fetchFakeData;
