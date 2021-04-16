let latLngObject = {
  lat: "",
  lng: "",
};

const errorHandling = () => {
  $("#cards-container").empty();
  const errorContainer = `<div class="callout alert grid-x">
  <h2 class="cell align-center-middle text-center">Error!</h2>
  <p class="cell align-center-middle text-center">
    City not recognised. Please try again.
  </p>
</div>`;
  $("#cards-container").append(errorContainer);
};

// fetch data from 3rd party API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.meta.code !== 200) {
      throw new Error("Oops something went wrong!");
    }
    return data;
  } catch (error) {
    errorHandling();
  }
};

// Initialize and add the map
const initMap = () => {
  // The location of the marker
  const markerPlacement = { lat: latLngObject.lat, lng: latLngObject.lng };
  // The map, centered at the marker
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: markerPlacement,
  });
  // The marker, positioned at the location
  const marker = new google.maps.Marker({
    position: markerPlacement,
    map: map,
  });
};

// function to create venue cards following form submit. Returns single venue card.
const createVenueCards = (venue) => {
  const formattedAddress = venue.location.formattedAddress.join(", ");
  const venueCard = `<div class="card cell large-3 medium-6 small-12 cards-padding cards-margin">
  <h3>${venue.name}</h3>
  <div id="map"></div>
  <div class="“card-section”">
    <p>
      Address: ${formattedAddress}
    </p>
  </div>
  <button type="button" id="${venue.id}" class="button radius bordered shadow success">
    More Information
  </button>
  <button type="button" class="button radius bordered shadow primary">
    Add to favourites
  </button>
</div>
  `;

  latLngObject = {
    lat: venue.location.lat,
    lng: venue.location.lng,
  };

  const googleAPI =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCSXQ8uJfo_0ylcrT6Z9_FXLzgiO9jcUkU&callback=initMap&libraries=&v=weekly";

  // const googleFetchAPI = async (url) => {
  //   await fetchData(url);
  // };

  // googleFetchAPI(googleAPI);

  return venueCard;
};

// function to create popup when more info button is clicked
const createVenuePopup = (venue) => {
  const overlay = $('<div id="overlay"></div>');

  const popupCard = `<div class='popup-container'>
  <div class='popup-box'>
  <h3>${venue.name}</h3>
  <p>
  <strong>Opening hours:</strong> ${venue.defaultHours.status} <br>
  <strong>Contact details:</strong> ${venue.contact.formattedPhone} <br>
  <strong>How many people are currently in the venue:</strong> ${venue.hereNow.summary} <br>
  <strong>Prices:</strong> ${venue.price.message} <br>
  <strong>Rating:</strong> ${venue.rating} <br>
  <strong>Website:</strong> <a href='${venue.url}' target="_blank">${venue.url}</a> <br>
  <br/>
  <br/>
  <br>
  <br>
  <a href='' class='close'>Close</a>
  </p>
  </div>
  </div>`;

  overlay.appendTo($("#page-container"));
  overlay.append(popupCard);

  const removePopup = (event) => {
    event.preventDefault();
    overlay.remove();
  };

  $(".close").click(removePopup);
};

// function to fetch venue specific details when more info button is clicked
const onClickMoreInfo = async (event) => {
  const fourSquareMoreInfoUrl = `https://api.foursquare.com/v2/venues/${event.currentTarget.id}?client_id=DLH22EORW1EKOQP5HEOCIADCUNESSGS0YB33AYNKKEUEDVQ5&client_secret=5WMAC0I3GLYX3TL2A3ZBLK1E1RDMWQJEOIPD5G2NZHKDQ5X4&v=20210401`;

  const fourSquareVenueData = await fetchData(fourSquareMoreInfoUrl);

  venueData = fourSquareVenueData.response.venue;

  createVenuePopup(venueData);
};

// Main function that runs on form submission. Fetches data from Foursquare and Google Places APIs and renders cards.
const onSubmit = async (event) => {
  event.preventDefault();
  $("#cards-container").empty();

  const location = $("#location-input").val();
  const interest = $("#interest-input").val();

  $("#location-input").val("");
  $("#interest-input").val("");

  const fourSquareUrl = `https://api.foursquare.com/v2/venues/search?client_id=DLH22EORW1EKOQP5HEOCIADCUNESSGS0YB33AYNKKEUEDVQ5&client_secret=5WMAC0I3GLYX3TL2A3ZBLK1E1RDMWQJEOIPD5G2NZHKDQ5X4&near=${location}&query=${interest}&v=20210401`;

  const fourSquareData = await fetchData(fourSquareUrl);

  const venues = fourSquareData.response.venues;

  const venueCards = await venues.map(createVenueCards);

  $("#cards-container").append(venueCards);

  $(".button").on("click", onClickMoreInfo);
};

$("#search-form").on("submit", onSubmit);
