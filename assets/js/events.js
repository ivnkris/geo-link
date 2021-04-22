const TICKET_MASTER_API_KEY = "FA3e9kaV6fc0cqFxTnu9DZvATbfHtS6Q";

const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const interest = urlParams.get("interest");
  const lat = urlParams.get("lat");
  const lng = urlParams.get("lng");

  return {
    interest,
    lat,
    lng,
  };
};

const renderEventCards = (events) => {
  const parent = $("#events-container");
  const div = $("<div>").addClass("grid-x align-spaced");

  const constructEventCard = (event) => {
    console.log(event);
    const image =
      event.images && event.images.length > 0 && event.images[0].url;
    const card = `<div
      class="card cell large-9 medium-9 small-12 cards-padding cards-margin radius bordered shadow card"
      id="card"
    >
      <h3 class="text-center">Hello</h3>
      <div class="event-card">

      <div class="card-section">
        <p>Address: <span>Address</span></p>
        <p>Address: <span>Address</span></p>
        <p>Address: <span>Address</span></p>
        <p>Address: <span>Address</span></p>
      </div>

      <div class="event-image-container" id="map">
        <img class="event-image" src="${image}" />
      </div>
      </div>
    </div>`;

    return card;
  };

  const eventCards = events.map(constructEventCard);

  div.append(eventCards);

  parent.append(div);
};

const onReady = async () => {
  const urlParams = getUrlParams();

  const ticketMasterApiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=${TICKET_MASTER_API_KEY}&keyword=${urlParams.interest}&latlong=${urlParams.lat},${urlParams.lng}`;

  const ticketMasterData = await fetchData(ticketMasterApiUrl);

  const eventCards = getValueFromNestedObject(
    ticketMasterData,
    ["_embedded", "events"],
    []
  );

  if (eventCards.length === 0) {
    // TODO render no events found
  } else {
    renderEventCards(eventCards);
  }
};

$(document).ready(onReady);
