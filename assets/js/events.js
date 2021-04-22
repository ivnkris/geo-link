const TICKET_MASTER_API_KEY = "mNXBZ1qpoSA72ABjpHTrpDTzHSNfkmO4";

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
      class="card cell large-11 medium-11 small-12 cards-padding cards-margin radius bordered shadow card"
      id="card"
    >
      <h3 class="text-center">${event.name}</h3>
      <div class="event-card">

      <div class="card-section event-details">
        <p><strong>Date:</strong> <span>${event.dates.start.localDate}, ${event.dates.start.localTime}</span></p>
        <p><strong>Venue:</strong> <span>${event._embedded.venues[0].name}</span></p>
        <p><strong>Address:</strong> <span>${event._embedded.venues[0].address.line1}, ${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].postalCode}</span></p>
        <p><span><a href="${event.url}">Buy your ticket here!</a></span></p>
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
