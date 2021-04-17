const localStorageMemoryString = localStorage.getItem("venueId");
const favouritesObject = JSON.parse(localStorageMemoryString);
console.log(favouritesObject);

const renderNothingInFavourites = () => {
  const emptyFavourites = `<div class="callout warning grid-x">
  <h2 class="cell align-center-middle text-center">Nothing in favourites yet</h2>
  <p class="cell align-center-middle text-center">
    Try searching for your interests on the homepage to add them onto favourites!
  </p>
</div>`;
  $("#cards-container").append(emptyFavourites);
};

const onClickRemoveFavourite = () => {
  console.log("remove");
};

const renderFavouritesCards = async (each) => {
  const favouritesCard = `
  <div class="card cell large-3 medium-6 small-12 cards-padding cards-margin">
  <h3></h3>
  <div id="map">
  <img src="" />
  </div>
  
  <div class="“card-section”">
    <p>
    Address: 
    </p>
  </div>
  <button type="button" name="more-info" id="" class="button radius bordered shadow success">
  More Information
</button>
  <button type="button" name="remove-favourite" data-venueId="" class="button radius bordered shadow alert">
    Remove from favourites
  </button>
</div>`;

  $("#cards-container").append(favouritesCard);
  $('button[name="more-info"]').on("click", onClickMoreInfo);
  $('button[name="remove-favourite"]').on("click", onClickRemoveFavourite);
};

const getItemsFromLocalStorage = () => {
  if (favouritesObject) {
    $(favouritesObject).each(renderFavouritesCards);
  } else {
    renderNothingInFavourites();
  }
};

const onReady = () => {
  getItemsFromLocalStorage();
};

$(document).ready(onReady);
