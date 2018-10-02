var deciseconds = 0;
var clickList = [];
var judgeName = "";
var otherJudge = "";
var yt_link = "";
var positive = 0;
var negative = 0;
var judgeEntry = [];
var t;
var otherGraph = [];
var graph2 = [];

function saveData()
{
  judgeName = $('#judge-name').val();
  yt_link = $('#yt-link').val();
}

$("body").on("keydown", function(event)
{
  // enter key to start the timer - press this once the song starts
  if (event.which == 13)
  {
    timer();
  }
  // press a key to click a negative
  else if (event.which == 76)
  {
    negative+=1;
    raw = positive-negative;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text("+" + String(positive) + " " + "-" + String(negative));
  }
  // press a key to click a positive
  else if (event.which == 65)
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

  }
});

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
  getLinks();
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

function showChart()
{
  var yourX = [];
  var yourY = [];
  var otherX = [];
  var otherY = [];
  console.log(otherGraph);
  console.log(clickList);
  for (var a=0;a<clickList.length;a++)
  {
    yourX.push(clickList[a][0]);
    yourY.push(clickList[a][1]);
  }
  for (var b=0;b<otherGraph.length;b++)
  {
    otherX.push(otherGraph[b][0]);
    otherY.push(otherGraph[b][1]);
    if (otherGraph[b+1] == "Break")
    {
      break;
    }
  }
  console.log(otherX);
  console.log(otherY);
  console.log(yourX);
  console.log(yourY);
  var trace1 =
  {
    x: yourX,
    y: yourY,
    mode: 'lines',
    name: judgeName
  };
  var trace2 =
  {
    x: otherX,
    y: otherY,
    mode: 'lines',
    name: otherJudge
  };
  var data = trace1;

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
