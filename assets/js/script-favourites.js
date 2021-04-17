// retrieve information from local storage and save it into favouritesObject variable
const localStorageMemoryString = localStorage.getItem("venueIds");
const favouritesObject = JSON.parse(localStorageMemoryString);
console.log(favouritesObject);

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
const onClickRemoveFavourite = () => {
  console.log("remove");
};

// on page load render favourites cards onto the page
const renderFavouritesCard = (index) => {
  const favouritesCard = `
  <div class="card cell large-3 medium-6 small-12 cards-padding cards-margin">
  <h3>${favouritesObject[index].name}</h3>
  <div id="map">
  <img src="${favouritesObject[index].image}" />
  </div>
  
  <div class="“card-section”">
    <p>
    Address: ${favouritesObject[index].address}
    </p>
  </div>
  <button type="button" name="more-info" id="${favouritesObject[index].id}" class="button radius bordered shadow success">
  More Information
</button>
  <button type="button" name="remove-favourite" data-venueId="${favouritesObject[index].id}" class="button radius bordered shadow alert">
    Remove from favourites
  </button>
</div>`;

  $("#cards-container").append(favouritesCard);
  $('button[name="more-info"]').on("click", onClickMoreInfo);
  $('button[name="remove-favourite"]').on("click", onClickRemoveFavourite);
};

// on page load check if local storage is not empty and invoke function renderFavouritesCard. If local storage is empty invoke function renderNothingInFavourites
const onReady = () => {
  if (favouritesObject) {
    $(favouritesObject).each(renderFavouritesCard);
  } else {
    renderNothingInFavourites();
  }
};

$(document).ready(onReady);
