/*
 *  Copyright 2019 Google LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/** Initiatlize a fixed size Google Map object centered on Athens, Greece */
function initMap() {
  var map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: 37.98, lng: 23.73}, zoom: 12});

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Service area businesses are defined as a region type, to limit results
  // restrict autocomplete search results to this type.
  var types = ['(regions)'];
  autocomplete.setTypes(types);

  autocomplete.bindTo('bounds', map);

  // Specify just the place data fields that you need.
  autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var geocoder = new google.maps.Geocoder;

  var marker = new google.maps.Marker({map: map, draggable: true});
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      return;
    }

    // The following logged details are used by the GMB location.create method

    // Lat/Lng may be required by location.create when the address is
    // insufficient to geocode the establishment
    console.log('Lat/Lng: ' + place.geometry.location.toString());
    // A Place ID corresponding to a region is required for establishments
    // with a service area
    console.log('Place ID: ' + place.place_id);

    geocoder.geocode({'placeId': place.place_id}, function(results, status) {
      if (status !== 'OK') {
        window.alert('Geocoder failed due to: ' + status);
        return;
      }
      map.setZoom(11);
      map.setCenter(results[0].geometry.location);

      // Set the position of the marker using the place ID and location.
      marker.setPlace(
          {placeId: place.place_id, location: results[0].geometry.location});
      marker.setVisible(true);

      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-id'].textContent = place.place_id;
      infowindowContent.children['latlng'].textContent =
          results[0].geometry.location;
      infowindowContent.children['place-address'].textContent =
          results[0].formatted_address;

      infowindow.open(map, marker);
    });
  });
}

/**  Load the API client and OAuth2 library */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/** Initialize OAuth2 and register event handlers */
function initClient() {
  gapi.client.init({apiKey: apiKey, clientId: clientId, scope: scopes})
      .then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
}

/**
 * callback handler for OAuth2 after sign-in status has been received
 * @param {boolean} isSignedIn
 */
function updateSigninStatus(isSignedIn) {
  var e = document.getElementsByClassName('section');
  var bg = '#0367C4';

  if (isSignedIn == false) {
    bg = 'red';
    document.getElementById('oauth-banner').style.visibility = 'visible';
  } else {
    document.getElementById('oauth-banner').style.visibility = 'hidden';
  }

  for (var i = 0; i < e.length; i++) {
    e[i].style.backgroundColor = bg;
  }
}

/**
 * Display request details
 * @param {string} type
 * @param {string} url
 * @param {string} request_body
 */
function htmlifyRequest(type, url, request_body) {
  document.getElementById('request-area').style.display = 'inherit';
  document.getElementById('request-area').innerHTML = type + '\n' + url +
      '\nRequest Body:\n' + JSON.stringify(request_body, undefined, 2);
}

/**
 * Display detailed response outcome
 * @param {?XMLHttpRequest} xhr
 */
function htmlifyResponse(xhr) {
  document.getElementById('response-area').style.background = '';
  document.getElementById('response-area').style.display = 'inherit';
  document.getElementById('response-area').innerHTML =
      'HTTP Response Code: ' + xhr.status + '\nResponse Body:\n' +
      JSON.stringify(xhr.response, undefined, 2);
}

/**
 * Display detailed error response
 * @param {?XMLHttpRequest} xhr
 */
function htmlifyError(xhr) {
  htmlifyResponse(xhr);
  document.getElementById('response-area').style.background = '#F7BD67';
}

/**
 * We receive an HTTP Response code from the server and an endpoint reply
 * to our request in the response in body.
 * @param {string} type
 * @param {string} url
 * @param {string} request_body
 * @return {?XMLHttpRequest}
 */
function XHRequest(type, url, request_body) {
  // update here so we visually get a sense of the response time
  document.getElementById('request-area').innerHTML = '';
  document.getElementById('response-area').innerHTML = '';

  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    var user = gapi.auth2.getAuthInstance().currentUser.get();
    var oauthToken = user.getAuthResponse().access_token;

    req.responseType = 'json';
    req.open(type, url);

    // Authorize this request to the API by adding the bearer token
    // to the HTTP Request Headers in the authorization field
    req.setRequestHeader('Authorization', 'Bearer ' + oauthToken);

    // Enable verbose debug
    req.setRequestHeader('X-GOOG-API-FORMAT-VERSION', '2 ');

    req.onload = function() {
      if (req.status == 200) {
        resolve(req);
      } else {
        // bad api request: policy violation, incorrect parameters, ...
        reject(req);
      }
    };

    req.onerror = function() {
      reject(Error(
          'Network Error: DNS, TLS or CORS preflight may have failed.<br>' +
          'Confirm that the API project permissions, the request URL ' +
          'format and HTTP headers are set appropriately.<br>' +
          'For more information on CORS preflight failures please see: ' +
          'https://developer.mozilla.org/en-US/docs/Glossary/' +
          'Preflight_request'));
    };
    htmlifyRequest(type, url, request_body);

    var encoded_request = JSON.stringify(request_body);
    req.send(encoded_request);
  });
}

/** OAuth2 Authorize button press handler */
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}

/** OAuth2 Sign Out button press handler */
function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

/** Fetch a list of accounts available to the caller */
function handleAccountsClick() {
  var url = gmb_api_version + '/accounts';

  XHRequest('GET', url).then(htmlifyResponse).catch(htmlifyError);
}

/** Fetch a list of categories */
function handleCategoriesClick() {
  var formData = new FormData(document.getElementById('category-form'));
  var url = gmb_api_version + '/categories' +
      '?regionCode=' + formData.get('regionCode') +
      '&languageCode=' + formData.get('languageCode') +
      '&searchTerm=' + formData.get('searchTerm') +
      '&pageSize=' + formData.get('catPageSize') +
      '&pageToken=' + formData.get('catPageToken');

  XHRequest('GET', url).then(htmlifyResponse).catch(htmlifyError);
}

/** Fetch a list of attributes */
function handleAttributesClick() {
  var formData = new FormData(document.getElementById('attribute-form'));
  var catFormData = new FormData(document.getElementById('category-form'));
  var url = gmb_api_version + '/attributes' +
      '?country=' + formData.get('country') +
      '&languageCode=' + catFormData.get('languageCode') +
      '&categoryId=' + formData.get('categoryId') +
      '&pageSize=' + formData.get('attrPageSize') +
      '&pageToken=' + formData.get('attrPageToken');

  XHRequest('GET', url).then(htmlifyResponse).catch(htmlifyError);
}

/** Fetch a list of admins for the specified account */
function handleAdminsClick() {
  var formData = new FormData(document.getElementById('accounts-form'));
  var url = gmb_api_version + '/' + formData.get('accountName') + '/admins';

  XHRequest('GET', url).then(htmlifyResponse).catch(htmlifyError);
}

/** Fetch all locations within the specified account */
function handleLocationsClick() {
  var formData = new FormData(document.getElementById('accounts-form'));
  var url = gmb_api_version + '/' + formData.get('accountName') + '/locations';

  XHRequest('GET', url).then(htmlifyResponse).catch(htmlifyError);
}

/** Search for a matching location using a query string as input criteria */
function handleQuerySearchClick() {
  var formData = new FormData(document.getElementById('search-form'));
  var url = gmb_api_version + '/googleLocations:search';
  var request_body = {};

  /* Construct JSON request body and sub-objects using form data */
  for (let tuple of formData.entries()) {
    request_body[tuple[0]] = tuple[1];
  }

  XHRequest('POST', url, request_body)
      .then(htmlifyResponse)
      .catch(htmlifyError);
}

/** Search for a matching location using a Location object as input criteria */
function handleLocationSearchClick() {
  var search = new FormData(document.getElementById('search-form'));
  var formData = new FormData(document.getElementById('location-form'));
  var catFormData = new FormData(document.getElementById('category-form'));
  var url = gmb_api_version + '/googleLocations:search';
  var postalAddress = {};
  var latlng = {};
  var request_body = {};

  // Construct JSON request body and sub-objects using form data
  request_body['resultCount'] = search['resultCount'];
  request_body.location = {};
  request_body.location['languageCode'] = catFormData.get('languageCode');
  postalAddress['regionCode'] = catFormData.get('regionCode');
  request_body.location.address = postalAddress;

  // Construct JSON request body and sub-objects using form data
  for (let tuple of formData.entries()) {
    if (tuple[1] === '') {
      continue;  // ignore empty entry fields
    }

    switch (tuple[0]) {
      case 'locationName':
      case 'primaryPhone':
      case 'websiteUrl':
        request_body.location[tuple[0]] = tuple[1];
        break;
      case 'addressLines':
      case 'locality':
      case 'postalCode':
      case 'administrativeArea':
        postalAddress[tuple[0]] = tuple[1];
        request_body.location.address = postalAddress;
        break;
      case 'latitude':
      case 'longitude':
        latlng[tuple[0]] = tuple[1];
        request_body.location.latlng = latlng;
        break;
      case 'name':
      case 'placeId':
      case 'businessType':
      case 'categoryId':
      case 'displayName':
      default:
        // ignore, not used by the GoogleLocations.Search method
        break;
    }
  }

  XHRequest('POST', url, request_body)
      .then(htmlifyResponse)
      .catch(htmlifyError);
}

/** Run validation checks but do not create a new business location */
function handleCreateLocationClick() {
  var accounts = new FormData(document.getElementById('accounts-form'));
  var formData = new FormData(document.getElementById('location-form'));
  var catFormData = new FormData(document.getElementById('category-form'));
  var attrFormData = new FormData(document.getElementById('attribute-form'));
  var url = gmb_api_version + '/' + accounts.get('accountName') + '/locations' +
      '?validateOnly=' + formData.get('validateOnly') +
      '&requestId=' + formData.get('requestId');
  var postalAddress = {};
  var latlng = {};
  var places = {};
  var placeInfo = {};
  var placeInfos = [];
  var primaryCategory = {};
  var serviceArea = {};
  var request_body = {};

  primaryCategory['categoryId'] = attrFormData.get('categoryId');
  request_body.primaryCategory = primaryCategory;
  postalAddress['regionCode'] = catFormData.get('regionCode');
  request_body.address = postalAddress;
  request_body['languageCode'] = catFormData.get('languageCode');

  // Construct JSON request body and sub-objects using form data
  for (let tuple of formData.entries()) {
    if (tuple[1] === '') {
      continue;  // ignore empty entry fields
    }

    switch (tuple[0]) {
      case 'validateOnly':
      case 'requestId':
        // ignore URL parameters in the form
        continue;
      case 'addressLines':
      case 'locality':
      case 'postalCode':
      case 'administrativeArea':
        postalAddress[tuple[0]] = tuple[1];
        request_body.address = postalAddress;
        break;
      case 'latitude':
      case 'longitude':
        latlng[tuple[0]] = tuple[1];
        request_body.latlng = latlng;
        break;
      case 'businessType':
        serviceArea[tuple[0]] = tuple[1];
        request_body.serviceArea = serviceArea;
        break;
      case 'name':
      case 'placeId':
        placeInfo[tuple[0]] = tuple[1];
        placeInfos[0] = placeInfo;
        places.placeInfos = placeInfos;
        serviceArea.places = places;
        request_body.serviceArea = serviceArea;
        break;
      default:
        request_body[tuple[0]] = tuple[1];
    }
  }

  XHRequest('POST', url, request_body)
      .then(htmlifyResponse)
      .catch(htmlifyError);
}
