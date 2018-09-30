var deciseconds = 0;
var clickList = [];
var judge_name = "";
var yt_link = "";
var positive = 0;
var negative = 0;
var t;
var judgeEntry = [];
var sameLinks = [];
var otherGraphs = [];
var graph2 = [];

function saveData()
{
  judge_name = $('#judge-name').val();
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
  judgeEntry.push(judge_name);
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
  for (var a=0;a<clickList.length;a++)
  {
    yourX.push(clickList[a][0]);
    yourY.push(clickList[a][1]);
  }
  for (var b=0;b<graph2.length;b++)
  {
    otherX.push(graph2[b][0]);
    otherY.push(graph2[b][1]);
  }
  var trace1 =
  {
    x: yourX,
    y: yourY,
    mode: 'lines',
    name: judge_name
  };
  var trace2 =
  {
    x: otherX,
    y: otherY,
    mode: 'lines',
    name: "Other Judge"
  };
  var data = [trace1, trace2];

  var layout =
  {
    title:'Your Scores vs Other Scores'
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

// function showChart()
// {
//   google.charts.load('current', {packages: ['corechart', 'line']});
//   google.charts.setOnLoadCallback(drawVisualization);
// }
//
// function drawVisualization()
// {
//     var data = new google.visualization.DataTable();
//     data.addColumn('number', 'X');
//     data.addColumn('number', judge_name);
//     data.addColumn('number', "Other");
//     console.log(clickList);
//     console.log(graph2);
//     data.addRows(clickList);
//     data.addRows(graph2);
//     var options = {
//       hAxis: {
//         title: 'Time'
//       },
//       vAxis: {
//         title: 'Score'
//       },
//       curveType: 'function',
//     };
//     var chart = new google.visualization.LineChart(document.getElementById('chart'));
//     chart.draw(data, options);
//     $('#chart').show();
// }
