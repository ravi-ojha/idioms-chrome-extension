function makeUL(array) {

  // If there's just one element in the list, just return a simple span
  // else create a ul li list
  if(array.length === 1) {
    var item = document.createElement('span');
    item.appendChild(document.createTextNode(array[0]));
    return item;
  }

  // Create the list element:
  var list = document.createElement('ul');

  for(var i = 0; i < array.length; i++) {
    // Create the list item:
    var item = document.createElement('li');
    // Set its contents:
    item.appendChild(document.createTextNode(array[i]));
    // Add it to the list:
    list.appendChild(item);
  }

  // Finally, return the constructed list:
  return list;
}

function getPrevDate() {
  var d = new Date();
  d.setDate(d.getDate() - 1);
  query = d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear();
  return query;
}

function getCurrDate() {
  // Create the date for which we need the idiom
  var d = new Date();
  query = d.getDate() + '-' + (d.getMonth()+1) + '-' + d.getFullYear();
  return query;
}


function renderContent(response) {
  $('#idiom-title').text(response['title']);
  $('#idiom-meaning').text(response['meaning']);
  $('#idiom-example').append(makeUL(response['examples']));
  $('#idiom-body-placeholder').hide();
  $('#idiom-body').fadeIn();
}


function setLocal(response) {
  var key = 'idiom-of-the-day-' + getCurrDate();
  var idiom = {};
  idiom[key] = response;
  chrome.storage.local.set(idiom);

  // Delete yesterday's data
  var del_key = 'idiom-of-the-day-' + getPrevDate();
  chrome.storage.local.remove(del_key);
}


function getFromServer() {
  var curr_date = getCurrDate();
  // Make an ajax call to server
  $.ajax({
    type: "GET",
    url: "http://104.197.255.87/idiom/get_idiom_of_the_day/"+curr_date+'/',
    success: function(response){
      renderContent(response);
      setLocal(response);
    },
    error: function(){
      console.log('idiom ajax failed');
    }
  });
}

function getFromLocal() {
  var key = 'idiom-of-the-day-' + getCurrDate();
  chrome.storage.local.get(key, function(response) {
    // `response` is the object with key 'idiom-of-the-day-' + getCurrDate();
    // So first check if the response[key] is a valid data
    // If yes, then check if `title` key is there in the stored data
    // If yes, then render from local storage, else make server call
    if(response[key] && response[key]['title']) {
      response = response[key];
      renderContent(response);
    } else {
      getFromServer();
    }
  });
}

getFromLocal();
