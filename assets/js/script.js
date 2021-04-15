const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    // console.log(error);
  }
};

const createVenueCards = (venue) => {
  const formattedAddress = venue.location.formattedAddress.join(", ");
  const venueCard = `<div class="card cell large-3 medium-3 small-12 cards-padding">
  <h3>${venue.name}</h3>
  <img src="http://placehold.it/300x300" />
  <div class="“card-section”">
    <p>
      Address: ${formattedAddress}
    </p>
  </div>
  <button type="button" class="button radius bordered shadow primary">
    Add to favourites
  </button>
</div>
  `;

  return venueCard;
};

const createPlacesCards = (place) => {
  const placeCard = `<div class="card cell large-3 medium-3 small-12 cards-padding">
  <h3>${venue.name}</h3>
  <img src="http://placehold.it/300x300" />
  <div class="“card-section”">
    <p>
      Address: ${formattedAddress}
    </p>
  </div>
  <button type="button" class="button radius bordered shadow primary">
    Add to favourites
  </button>
</div>
  `;

  return placeCard;
};

const onSubmit = async (event) => {
  event.preventDefault();
  const location = $("#location-input").val();
  const interest = $("#interest-input").val();

  const fourSquareUrl = `https://api.foursquare.com/v2/venues/search?client_id=DLH22EORW1EKOQP5HEOCIADCUNESSGS0YB33AYNKKEUEDVQ5&client_secret=5WMAC0I3GLYX3TL2A3ZBLK1E1RDMWQJEOIPD5G2NZHKDQ5X4&near=${location}&query=${interest}&v=20210401`;

  const fourSquareData = await fetchData(fourSquareUrl);

  const venues = fourSquareData.response.venues;

  const venueCards = await venues.map(createVenueCards);

  $("#cards-container").append(venueCards);

  const getLanLng = async (location) => {
    const openCageDataURL = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=645bd41d9fc842d8a2b990b8b3dd0b26`;

    const openCageData = await fetchData(openCageDataURL);

    const googlePlacesCityObject = {
      lat: openCageData.results[0].bounds.northeast.lat,
      lng: openCageData.results[0].bounds.northeast.lng,
    };

    console.log(googlePlacesCityObject);

    return;
  };

  const latLngObject = getLanLng(location);
};

$("#search-form").on("submit", onSubmit);
