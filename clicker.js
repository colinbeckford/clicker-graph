var deciseconds = 0;
var judgeEntry = [];
var clickList = [];
var graphB = [];
var graphC = [];
var graphD = [];
var judgeName = "";
var otherJudgeData = "";
var yt_link = "";
var t;
var positive = 0;
var negative = 0;
var player;
var maxSec = 0;

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
    player.stopVideo();
    clearTimeout(t);
    deciseconds = 0;
    formatList();
    showChart(clickList,graphB);
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
  loadVideo();
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
    data[0] = parseFloat(data[0]);
    data[1] = parseFloat(data[1]);
    graphB.push([data[0], data[1]]);
  }
  graphB.push(list[0]);
  graphB.push(" ");
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

function showChart(listA, listB)
{
  var count = 0;
  var breakpoint = 0;
  var judgeB = "";
  var judgeC = "";
  var aX = [];
  var aY = [];
  var bX = [];
  var bY = [];
  var cX = [];
  var cY = [];
  if (listB.length == 0)
  {
  convertList(listA);
  convertList(listB);
  }
  for (var i=0;i<listB.length;i++)
  {
    if (listB[i] == " ")
    {
      count++;
      breakpoint = i;
      judgeB = listB[i-1];
      break;
    }
  }
  for (var a=0;a<listA.length;a++)
  {
    aX.push(listA[a][0]);
    aY.push(listA[a][1]);
  }
  for (var b=0;b<breakpoint;b++)
  {
    bX.push(listB[b][0]);
    bY.push(listB[b][1]);
  }
  breakpoint+=1;
  for (var c=breakpoint;c<listB.length;c++)
  {
    cX.push(listB[c][0]);
    cY.push(listB[c][1]);
    if (listB[c+2] == " ")
    {
      judgeC = listB[c+1];
      break;
    }
  }
  var trace1 =
  {
    x: aX,
    y: aY,
    mode: 'lines',
    name: judgeName
  };
  var trace2 =
  {
    x: bX,
    y: bY,
    mode: 'lines',
    name: judgeB
  };
  var trace3 =
  {
    x: cX,
    y: cY,
    mode: 'lines',
    name: judgeC
  };

  var data = [trace1, trace2, trace3];
  var layout = {
    title: 'Your Scores',
    xaxis: {
      title: 'Time',
      showgrid: false,
      zeroline: false,
      range: [0, maxSec],
      nticks: 10,
    },
    yaxis: {
      title: 'Score',
      showline: false
    }
  };
  Plotly.newPlot('chart', data, layout);
}

function convertList(list)
{
  for (var i=0;i<list.length;i++)
  {
    var sec = 0;
    var min = 0;
    if (list[i][0] > 60)
    {
      min = ((list[i][0])/60);
      sec = ((list[i][0])%60);
    }
    else
    {
      min = 0;
      sec = (list[i][0]);
    }
    if (list[i][0] < 10)
    {
    list[i][0] = min + ":0" + sec;
    }
    else
    {
    list[i][0] = min + ":" + sec;
    }
  }
}

function loadVideo()
{
  document.getElementById("video").innerHTML = "<div id='player'></div>";
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady()
{
  for (var i=0;i<yt_link.length;i++)
  {
    if (yt_link.charAt(i) == "v" && yt_link.charAt(i+1) == "=")
    {
      yt_link = yt_link.slice(i+2);
    }
    else if (yt_link.charAt(i) == "e" && yt_link.charAt(i+1) == "/")
    {
      yt_link = yt_link.slice(i+2);
    }
  }
  player = new YT.Player('player', {
  height: '390',
  width: '640',
  videoId: yt_link,
  events: {
  'onReady': onPlayerReady,
  'onStateChange': onPlayerStateChange
}
});
}

function onPlayerReady(event)
{
  event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
if (event.data == YT.PlayerState.PLAYING && !done) {
done = true;
}
}
