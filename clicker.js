var deciseconds = 0;
var clickList = [];
var judge_name = "";
var yt_link = "";
var pos = 0;
var neg = 0;

function saveData()
{
  judge_name = $('#judge-name').val();
  yt_link = $('#yt-link').val();
}

$(function() {
    $("body").hide();
  });

$("body").on("keydown", function(event)
{
  // enter key to start the timer - press this once the song starts
  if (event.which == 13)
  {
    timer();
  }
  // press a key to click a positive
  else if (event.which == 65)
  {
    pos+=1;
    raw = pos-neg;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text(" +" + pos + " " + "-" + neg);
  }
  // press a key to click a negative
  else if (event.which == 76)
  {
    neg+=1;
    raw = pos-neg;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text(" +" + pos + " " + "-" + neg);
  }
  // press 0 key to end the timer
  else if (event.which == 48)
  {
    makeApiCall();
    clearTimeout(t);
    deciseconds = 0;
    console.log(clickList);
    showChart();
  }
});

function add()
{
  deciseconds++;
  timer();
}

function timer()
{
  t = setTimeout(add, 100);
}

function showChart()
{
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawBasic);
}

function drawBasic()
{
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', $('#judge-name'));
    data.addRows(clickList);
    var options = {
      hAxis: {
        title: 'Time'
      },
      vAxis: {
        title: 'Score'
      },
      curveType: 'function',
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(data, options);
    $('#chart').show();
}

function makeApiCall() {
  var params = {
    spreadsheetId: '1KrN4qEuSED2x3R_Y4dOSXoHYix6ccP3SBlMMsDxgLO0',
    range: 'B1:J500',
    valueInputOption: 'RAW',
    insertDataOption: 'OVERWRITE',
  };
  var valueRangeBody = {
    "range": 'B1:J500',
    "majorDimension": "COLUMNS",
    "values": [judge_name,
    yt_link, clickList],
  };
  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}
function initClient() {
    var API_KEY = "AIzaSyBL78U6X04LeYMJ2h-35dPoPnXduUx_opo";  // TODO: Update placeholder with desired API key.
    var CLIENT_ID = "174011806378-ruu4bj26124mrbejev4btf1v4v8kslrb.apps.googleusercontent.com";  // TODO: Update placeholder with desired client ID.
    var SCOPE = "https://www.googleapis.com/auth/spreadsheets";
  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    $('body').show();
  }
}
function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
