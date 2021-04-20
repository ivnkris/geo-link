// if local storage is empty render an alert card
const renderNothingInFavourites = () => {
  const emptyFavourites = `<div class="callout warning grid-x">
  <h2 class="cell align-center-middle text-center">Nothing in favourites yet</h2>
  <p class="cell align-center-middle text-center">
    Try searching for your interests on the homepage to add them onto favourites!
  </p>
</div>`;
  $("#cards-container").append(emptyFavourites);
};

// if remove from favourites button  is clicked invoke this funtion to remove venue from local storage
const onClickRemoveFavourite = (event) => {
  const target = $(event.target);
  if (target.is('button[name="remove-favourite"]')) {
    const venueId = target.data("venue");
    const venues = getFromLocalStorage("venues", []);

    const callback = (each) => venueId !== each.id;
    const filteredVenues = venues.filter(callback);
    localStorage.setItem("venues", JSON.stringify(filteredVenues));
    renderFavouriteCards(filteredVenues);
  }
};

// on page load render favourites cards onto the page if local storage isn't empty
const renderFavouritesCard = (each) => {
  const favouritesCard = `
  <div class="card cell large-3 medium-6 small-12 cards-padding cards-margin">
    <h3>${each.name}</h3>
  <div id="map">
    <img src="${each.image}" />
  </div>
  
  <div class="card-section">
    <p>
    Address: <span>${each.address}</span>
    </p>
  </div>
  <div class="card-buttons">
    <button type="button" name="more-info" id="${each.id}" class="button radius bordered shadow success">
      More Information
    </button>
    <button type="button" name="remove-favourite" data-venue="${each.id}" class="button radius bordered shadow alert">
      Remove from favourites
    </button>
  </div>
</div>`;

  $("#cards-container").append(favouritesCard);
  $('button[name="more-info"]').on("click", displayMoreInfo);
};

// on page load check if favourites object, returned from local storage, is empty. If it isn't invoke renderFavouriteCards function and if it is invoke renderNothingInFavourites function
const renderFavouriteCards = (favourites) => {
  $("#cards-container").empty();
  if (favourites.length !== 0) {
    favourites.forEach(renderFavouritesCard);
  } else {
    renderNothingInFavourites();
  }
};

// on page load check if local storage is not empty and invoke function renderFavouritesCard. If local storage is empty invoke function renderNothingInFavourites
const onReady = () => {
  const favourites = getFromLocalStorage("venues", []);
  renderFavouriteCards(favourites);
};

$("#cards-container").on("click", onClickRemoveFavourite);

$(document).ready(onReady);
