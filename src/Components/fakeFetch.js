/*
 Generates GeoJSON FeatureCollection of random points based on
 he center coordinates passed in.
 */

const fetchFakeData = ({ lat, lng, radius, activity }) => {
  function getRandomCoords({ lng, lat, i }) {
    const rlat = lat + 0.01 * i;
    const rlng = lng + 0.01 * i;
    return [rlng, rlat];
  }

  const newFeaturesList = [];
  const newFeaturesPointList = [];
  for (let i = 0; i < 11; i++) {
    const id = i;
    const [dlng, dlat] = getRandomCoords({ lat, lng, i });

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

    // search by activity:
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
          participants: [{ idp: 2 }, { idp: 3 }, { idp: 4 }],
          address: `Random Point #${id}`,
          ischecked: false,
        },
      });

      // construct  'all'
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
          participants: [{ idp: 1 }, { idp: 2 }, { idp: 3 }],
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

export default fetchFakeData;
