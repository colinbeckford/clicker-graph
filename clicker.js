var clickDeciseconds = 0;
var viewDeciseconds = 0;
var judgeEntry = [];
var clickList = [];
var graphB = [];
var graphC = [];
var graphD = [];
var judgeName = "";
var otherJudgeData = "";
var yt_link = "";
var ct;
var vt;
var positive = 0;
var negative = 0;
var player;
var singleClick = 0;
var doubleClick = 0;
var enterReady = false;
var clickReady = false;
var graphReady = false;
var isFlash = false;
var isViewerMode = false;
var viewIncrement = 0;

$(document).ready(function() {
    let myurl = new URL(window.location.href);
    if (myurl.searchParams.has("link"))
    {
      $('#yt-link').val("https://youtu.be/" + (myurl.searchParams.get("link")));
    }
    else if (myurl.searchParams.has("name"))
    {
      $('#judge-name').val(myurl.searchParams.get("name"));
    }
    $('#query-link').hide();
    $('#share').hide();
    $('#video').height('480px');
    $('#video').width('854px');
    $('#chart').width('854px');
});


$("body").on("keydown", function(event)
{
  if (event.which == 13 && isViewerMode == true && isFlash == true)
  {
    viewTimer();
  }
  if (event.which == 13 && enterReady == true && isViewerMode == false)
  {
    clickTimer();
    enterReady = false;
    clickReady = true;
  }
  else if ((event.which == 189 || event.which == 173) && clickReady == true)
  {
    negative+=1;
    raw = positive-negative;
    seconds = (clickDeciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text("+" + String(positive) + " " + "-" + String(negative));
    if (isFlash == true)
    {
      changeColors("neg");
    }

  }
  else if (event.which == 49 && clickReady == true)
  {
    singleClick+=1;
    positive+=1;
    raw = positive-negative;
    seconds = (clickDeciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text("+" + String(positive) + " " + "-" + String(negative));
    if (isFlash == true)
    {
      changeColors("pos");
    }
  }
  else if (event.which == 50 && clickReady == true)
  {
    doubleClick+=1;
    positive+=2;
    raw = positive-negative;
    seconds = (clickDeciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text("+" + String(positive) + " " + "-" + String(negative));
    if (isFlash == true)
    {
      changeColors("dub");
    }
  }
  else if (event.which == 48)
  {
    isViewerMode = false;
    player.stopVideo();
    clearTimeout(ct);
    var confirmTimeout = setTimeout(confirmEntry,500);
    $('#query-link').html("http://scalescollective.com/clicker/" + "?link=" + yt_link);
    $('#query-link').show();
  }
});


function changeColors(type) {
  if (type == "pos")
  {
   $("#video").css({"border-color": "#008000",
            "border-width":"15px",
            "border-style":"solid"});
  }
  else if (type == "neg")
  {
    $("#video").css({"border-color": "#FF0000",
           "border-width":"15px",
           "border-style":"solid"});
  }
  else if (type == "dub")
  {
    $("#video").css({"border-color": "#00FFFF",
           "border-width":"15px",
           "border-style":"solid"});
  }
  var colorFlash = setTimeout('change()',200);
}

function change() {
   $("#video").css({"border-color": "#FFFFFF",
          "border-width":"15px",
          "border-style":"solid"});
   }



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

function clickAdd()
{
  clickDeciseconds++;
  clickTimer();
}

function viewAdd()
{
  viewDeciseconds++;
  if (graphB[viewIncrement] == " ")
  {
    clearTimeout(vt);
  }
  else if ((viewDeciseconds/10) == graphB[viewIncrement][0])
  {
    if (viewIncrement == 0)
    {
      if (graphB[viewIncrement][1] == 1)
      {
        $("#click-display").text(graphB[viewIncrement][1]);
        changeColors("pos");
      }
      else if (graphB[viewIncrement][1] == 2)
      {
        $("#click-display").text(graphB[viewIncrement][1]);
        changeColors("dub");
      }
      else if (graphB[viewIncrement][1] == -1)
      {
        $("#click-display").text(graphB[viewIncrement][1]);
        changeColors("neg");
      }
      viewIncrement+=1;
    }
    else
    {
      if (graphB[viewIncrement][1] == (graphB[viewIncrement-1][1])+1)
      {
        $("#click-display").text(graphB[viewIncrement][1]);
        changeColors("pos");
      }
      else if (graphB[viewIncrement][1] == (graphB[viewIncrement-1][1])-1)
      {
        $("#click-display").text(graphB[viewIncrement][1]);
        changeColors("neg");
      }
      else if (graphB[viewIncrement][1] == (graphB[viewIncrement-1][1])+2)
      {
        $("#click-display").text(graphB[viewIncrement][1]);
        changeColors("dub");
      }
      viewIncrement+=1;
    }
  }
  viewTimer();
}

function clickTimer()
{
  ct = setTimeout(clickAdd, 100);
}

function viewTimer()
{
  vt = setTimeout(viewAdd, 100);
}

function saveData()
{
  isFlash = $("#flash").is(":checked");
  alert("Remember to press ENTER key when the freestyle starts!");
  enterReady = true;
  judgeName = $('#judge-name').val();
  yt_link = $('#yt-link').val();
  loadVideo();
  getLinks(yt_link);
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

function getLinks(link)
{
  var params = {
    spreadsheetId: '1KrN4qEuSED2x3R_Y4dOSXoHYix6ccP3SBlMMsDxgLO0',
    range: "Sheet1!B1:B500",
    valueRenderOption: 'FORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  };
  var links = gapi.client.sheets.spreadsheets.values.get(params);
  links.then(function(response) {
    for (var i=0;i<response.result.values.length;i++)
    {
      if (response.result.values[i] == link)
      {
        getOtherScores(i);
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
  graphReady = true;
  for (var i=2;i<list.length;i++)
  {
    var data = [];
    data = list[i].split(',');
    data[0] = parseFloat(data[0]);
    data[1] = parseInt(data[1]);
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
  console.log(listB);
  makeApiCall(judgeEntry);
  var breakpointA = 0;
  var breakpointB = 0;
  var judgeB = "";
  var judgeC = "";
  var judgeD = "";
  var judgeE = "";
  var aX = [];
  var aY = [];
  var bX = [];
  var bY = [];
  var cX = [];
  var cY = [];
  var dX = [];
  var dY = [];
  var count = 0;
  for (var i=0;i<listB.length;i++)
  {
    if (listB[i] == " ")
    {
      count++;
      breakpointA = i;
      judgeB = listB[i-1];
      break;
    }
  }
  for (var a=0;a<listA.length;a++)
  {
    aX.push(listA[a][0]);
    aY.push(listA[a][1]);
  }
  for (var b=0;b<breakpointA;b++)
  {
    bX.push(listB[b][0]);
    bY.push(listB[b][1]);
  }
  breakpointA+=1;
  for (var c=breakpointA;c<listB.length;c++)
  {
    cX.push(listB[c][0]);
    cY.push(listB[c][1]);
    if (listB[c+2] == " ")
    {
      breakpointB = listB[c+2];
      judgeC = listB[c+1];
      break;
    }
  }
  breakpointB+=1;
  for (var d=breakpointB;d<listB.length;d++)
  {
    dX.push(listB[d][0]);
    dY.push(listB[d][1]);
    if (listB[d+2] == " ")
    {
      judgeD = listB[d+1];
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
  var trace4 =
  {
    x: dX,
    y: dY,
    mode: 'lines',
    name: judgeD
  };
  var data = [trace1, trace2, trace3, trace4];
  var layout = {
    title: 'Your Scores',
    xaxis: {
      title: 'Time',
      showgrid: false,
      zeroline: false,
      nticks: 12,
      tickformat: ',d',
    },
    yaxis: {
      title: 'Score',
      showline: false
    }
  };
  Plotly.newPlot('chart', data, layout);
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
  height: '480',
  width: '854',
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
function onPlayerStateChange(event)
{
if (event.data == YT.PlayerState.PLAYING && !done)
{
  done = true;
}
}

function getScores()
{
  isFlash = $("#flash").is(":checked");
  alert("Remember to press ENTER key when the freestyle starts!");
  isViewerMode = true;
  yt_link = $('#yt-link').val();
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
  getLinks(yt_link);
  setTimeout(function()
  {
    loadVideo();
    if (graphReady == false)
    {
      alert("Nobody has scored this routine.");
    }
    else
    {
      var graphTimer = setTimeout(function(){ showChart(clickList, graphB);}, 500);
    }}, 1500);
}

function confirmEntry() {
    var txt;
    if (confirm("Would you like to submit your scores?")) {
      var cps = ((clickList[(clickList.length)-1][1])/(clickList[(clickList.length)-1][0])).toFixed(2);
      var pdc = ((doubleClick*2)/(singleClick+(doubleClick*2))).toFixed(2);
      alert("The clicks per second for this routine you scored is " + cps + ", and the percentage of clicks that you awarded +2 is " + (pdc*100) + " percent.");
      $('#share').show();
      formatList();
      showChart(clickList,graphB);
    } else {
        location.assign("http://scalescollective.com/clicker/" + "?link=" + yt_link + "&name=" + judgeName);
        var refreshTimeout = setTimeout(saveData,500);
    }
}
