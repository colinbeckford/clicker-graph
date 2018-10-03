var deciseconds = 0;
var judgeEntry = [];
var clickList = [];
var otherGraph = [];
var judgeName = "";
var otherJudgeName = "";
var otherJudgeData = "";
var yt_link = "";
var t;
var positive = 0;
var negative = 0;

$("body").on("keydown", function(event)
{

  // enter key to start the timer - press this once the song starts
  if (event.which == 13)
  {
    timer();
  }
  // press a key to click a negative
  else if (event.which == 189)
  {
    negative+=1;
    raw = positive-negative;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text("+" + String(positive) + " " + "-" + String(negative));
  }
  // press a key to click a positive
  else if (event.which == 49)
  {
    positive+=1;
    raw = positive-negative;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text("+" + String(positive) + " " + "-" + String(negative));
  }
  // press 0 key to end the timer
  else if (event.which == 48)
  {
    clearTimeout(t);
    deciseconds = 0;
    formatList();
    createAxes(clickList,otherGraph);
    makeApiCall(judgeEntry);
  }
});


function initClient() {
var API_KEY = "AIzaSyBL78U6X04LeYMJ2h-35dPoPnXduUx_opo";
var CLIENT_ID = "174011806378-ruu4bj26124mrbejev4btf1v4v8kslrb.apps.googleusercontent.com";
var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
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
  alert("You are signed in.");
}
}
function handleSignInClick(event) {
gapi.auth2.getAuthInstance().signIn();
}
function handleSignOutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

function add()
{
  deciseconds++;
  timer();
}

function timer()
{
  t = setTimeout(add, 100);
}

function saveData()
{
  judgeName = $('#judge-name').val();
  yt_link = $('#yt-link').val();
  getLinks();
}


function formatList()
{
  judgeEntry.push(judgeName);
  judgeEntry.push(yt_link);
  for (var i=0;i<clickList.length;i++)
  {
    var csv = "";
    csv = clickList[i][0] + "," + clickList[i][1];
    judgeEntry.push(csv);
  }
}

function getLinks()
{
  var params = {
    spreadsheetId: '1KrN4qEuSED2x3R_Y4dOSXoHYix6ccP3SBlMMsDxgLO0',
    range: "Sheet1!B1:B500",
    valueRenderOption: 'FORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  };
  var links = gapi.client.sheets.spreadsheets.values.get(params);
  links.then(function(response) {
    var hasBeenScored = false;
    for (var i=0;i<response.result.values.length;i++)
    {
      if (response.result.values[i] == yt_link)
      {
        getOtherScores(i);
        hasBeenScored = true;
      }
    }
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function getOtherScores(index)
{
  var params = {
    spreadsheetId: '1KrN4qEuSED2x3R_Y4dOSXoHYix6ccP3SBlMMsDxgLO0',
    range: "Sheet1!A" + (index+1) + ":FZ" + (index+1),
    valueRenderOption: 'FORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  };
  var otherScores = gapi.client.sheets.spreadsheets.values.get(params);
  otherScores.then(function(response) {
    otherJudgeData = response.result.values[0];
    otherJudgeName = otherJudgeData[0];
    loadOtherList(otherJudgeData);
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function loadOtherList(list)
{
  for (var i=2;i<list.length;i++)
  {
    var data = [];
    data = list[i].split(',');
    console.log(data);
    data[0] = parseFloat(data[0]);
    data[1] = parseFloat(data[1]);
    otherGraph.push([data[0], data[1]]);
  }
}
function makeApiCall(list)
{
     var params = {
       spreadsheetId:'1KrN4qEuSED2x3R_Y4dOSXoHYix6ccP3SBlMMsDxgLO0',
       range: 'Sheet1!A1:FZ250',
       valueInputOption: 'RAW',
       insertDataOption: 'OVERWRITE',
     };
     var valueRangeBody = {
           "range": 'Sheet1!A1:FZ250',
      "majorDimension": 'ROWS',
      "values": [list]
     };
     var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
     request.then(function(response) {
     }, function(reason) {
       console.error('error: ' + reason.result.error.message);
     });
   }

function createAxes(listA, listB)
{
  var yourX = [];
  var yourY = [];
  var otherX = [];
  var otherY = [];
  for (var a=0;a<listA.length;a++)
  {
    yourX.push(listA[a][0]);
    yourY.push(listA[a][1]);
  }
  for (var b=0;b<listB.length;b++)
  {
    otherX.push(listB[b][0]);
    otherY.push(listB[b][1]);
  }
  console.log(otherX);
  console.log(otherY);
  console.log(yourX);
  console.log(yourY);
  showChart(yourX, yourY, otherX, otherY);
}
function showChart(x1, y1, x2, y2)
{
  alert("You are the only person who has scored this freestyle.");
  var trace1 =
  {
    x: x1,
    y: y1,
    mode: 'lines',
    name: judgeName
  };
  var trace2 =
  {
    x: x2,
    y: y2,
    mode: 'lines',
    name: otherJudgeName
  };
  var data = [trace1, trace2];

  var layout = {
    title: 'Your Scores',
    xaxis: {
      title: 'Time',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Score',
      showline: false
    }
  };
  Plotly.newPlot('chart', data, layout);
}
