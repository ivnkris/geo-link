let latLngObject = {
  lat: "",
  lng: "",
};

const getValueFromNestedObject = (
  nestedObj = {},
  tree = [],
  defaultValue = ""
) =>
  Array.isArray(tree)
    ? tree.reduce(
        (obj, key) => (obj && obj[key] ? obj[key] : defaultValue),
        nestedObj
      )
    : {};

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
    } else {
      return data;
    }
  } catch (error) {
    errorHandling();
  }
};

// function to create venue cards following form submit. Returns single venue card.
const createVenueCard = (venue) => {
  // TODO fix using nested object function
  const formattedAddress = venue.location.formattedAddress.join(", ");

  latLngObject = {
    lat: venue.location.lat,
    lng: venue.location.lng,
  };

  const googleAPI = `https://maps.googleapis.com/maps/api/staticmap?center=${formattedAddress}&zoom=13&size=400x200&maptype=roadmap
    &markers=color:blue%7Clabel:S%7C${latLngObject.lat},${latLngObject.lng}
    &key=AIzaSyCSXQ8uJfo_0ylcrT6Z9_FXLzgiO9jcUkU`;

  const venueCard = `<div class="card cell large-3 medium-6 small-12 cards-padding cards-margin">
        <h3>${venue.name}</h3>
        <div id="map">
            <img src="${googleAPI}">
        </div>
        <div class="“card-section”">
            <p>
            Address: <span>${formattedAddress}</span>
            </p>
        </div>
        <div id="venue-card-buttons">
          <button type="button" name="more-info" id="${venue.id}" class="button radius bordered shadow success">
              More Information
          </button>
          <button type="button" name="add-favourite" data-venue="${venue.id}" class="button radius bordered shadow primary">
             Add to favourites
          </button>
        </div>
    </div>`;

  return venueCard;
};

// function to create popup when more info button is clicked
const createVenuePopup = (venue) => {
  const overlay = $('<div id="overlay"></div>');

  const popupCard = `<div class='popup-container'>
  <div class='popup-box'>
  <h3>${venue.name}</h3>
  <p>
  <strong>Opening hours:</strong> ${getValueFromNestedObject(
    venue,
    ["defaultHours", "status"],
    "Not available"
  )} <br>
  <strong>Contact details:</strong> ${getValueFromNestedObject(
    venue,
    ["contact", "formattedPhone"],
    "Not available"
  )} <br>
  <strong>How many people are currently in the venue:</strong> ${getValueFromNestedObject(
    venue,
    ["hereNow", "summary"],
    "Not available"
  )} <br>
  <strong>Prices:</strong> ${getValueFromNestedObject(
    venue,
    ["price", "message"],
    "Not available"
  )} <br>
  <strong>Rating:</strong> ${venue.rating || "Not available"} <br>
  <strong>Website:</strong> <a href='${
    venue.url || "Not available"
  }' target="_blank">${venue.url}</a> <br>
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

  const venueData = fourSquareVenueData.response.venue;

  createVenuePopup(venueData);
};

const addToFav = (event) => {
  const target = $(event.target);
  const parent = target.parent();
  const venueMemory = getFromLocalStorage("venueIds", []);
  const venueName = parent.find("h3").text();
  const venueImg = parent.find("img").attr("src");
  const venueAddress = parent.find("span").text();
  const venueId = parent.find("button").attr("id");

  const venueObject = {
    name: venueName,
    image: venueImg,
    address: venueAddress,
    id: venueId,
  };

  venueMemory.push(venueObject);

  localStorage.setItem("venueIds", JSON.stringify(venueMemory));

  const venueCardDiv = event.target.parentElement;

  event.target.remove();

  const addedToFavourites = `
  <button type="button" name="add-favourite" data-venue="${venueId}" class="button radius bordered shadow warning">
    ✔️Added to favourites
  </button>
`;

  $(venueCardDiv).append(addedToFavourites);
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

  const venueCards = await venues.map(createVenueCard);

  $("#cards-container").append(venueCards);

  $('button[name="add-favourite"]').on("click", addToFav);
  $('button[name="more-info"]').on("click", onClickMoreInfo);
};

$("#search-form").on("submit", onSubmit);
