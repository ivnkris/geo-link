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

const onReady = async () => {
  const urlParams = getUrlParams();

  // build ticketmaster API url
  const ticketMasterApiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?size=10&apikey=${TICKET_MASTER_API_KEY}&keyword=${urlParams.interest}&latlong=${urlParams.lat},${urlParams.lng}`;

  // fetch data from API
  const ticketMasterData = await fetchData(ticketMasterApiUrl);
  console.log(ticketMasterData);

  // render cards
};

$(document).ready(onReady);