var deciseconds = 0;
var clickList = [];
var judge_name = "";
var yt_link = "";
var positive = 0;
var negative = 0;
var t;
var sameLinks = [];
var otherGraph = [];

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
    console.log(negative);
    raw = positive-negative;
    seconds = (deciseconds/10);
    clickList.push([seconds, raw]);
    $("#click-display").text("+" + String(positive) + " " + "-" + String(negative));
  }
  // press a key to click a positiveitive
  else if (event.which == 65)
  {
    positive+=1;
    console.log(positive);
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
    console.log(clickList);
    formatList();
    showChart();
  }
});

function formatList()
{
  var judgeEntry = [];
  judgeEntry.push(judge_name);
  judgeEntry.push(yt_link);
  for (var i=0;i<clickList.length;i++)
  {
    var csv = "";
    csv = clickList[i][0] + "," + clickList[i][1];
    judgeEntry.push(csv);
  }
  console.log(judgeEntry);
  makeApiCall(judgeEntry);
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
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawBasic);
}

function drawBasic()
{
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', judge_name);
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
