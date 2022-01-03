let dataurl;
let jsonObj;
let g;

function loadJira() {
    var myHeaders = new Headers();
    var basicauth = 'Basic ' + btoa('username:password');
    console.log(basicauth);
    myHeaders.append('Authorization', basicauth);
    myHeaders.append('Content-Type','application/json');
    myHeaders.append('Access-Control-Allow-Origin','*');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    var jirainstance = "https://jira-instance.es"
    fetch(jirainstance+"/rest/api/2/search?jql=filter=14816&fields=key", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}

function start(e) {

    loadJira();

  g = new JSGantt.GanttChart(document.getElementById('embedded-Gantt'), 'week');
  if (g.getDivId() != null) {

    /* 
    // Add Custom tasks programatically
    g.AddTaskItem(new JSGantt.TaskItem(1, 'Task Objects', '', '', 'ggroupblack', '', 0, 'Shlomy', 40, 1, 0, '', '', '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(121, 'Constructor Proc', '2019-08-20', '2020-03-06', 'gtaskblue', '', 0, 'Brian T.', 60, 0, 1, 1, '', '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(122, 'Task Variables', '2019-08-20', '2020-03-06', 'gtaskred', '', 0, 'Brian', 60, 0, 1, 1, 121, '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(123, 'Task by Minute/Hour', '2019-08-20', '2020-03-06 12:00', 'gtaskyellow', '', 0, 'Ilan', 60, 0, 1, 1, '', '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(124, 'Task Functions', '2019-08-20', '2020-03-06', 'gtaskred', '', 0, 'Anyone', 60, 0, 1, 1, '123', 'This is a caption', null, g));
    */

    g.setOptions({
      vCaptionType: 'None',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,
      vQuarterColWidth: 36,
      vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
      vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to display dates in the "Major" header of the "Day" view
      vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
      vAdditionalHeaders: { // Add data columns to your table
        issues: {
          title: 'Issues'
        },
        done: {
          title: 'Done'
        },
        category: {
            title: 'Estado'
        }
      },
      vShowRes: 0,
      vShowPlanStartDate :0,
      vShowPlanEndDate :1,
      vShowTaskInfoLink: 1, // Show link in tool tip (0/1)
      vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily view (1/0)
      vUseSingleCell: 10000, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
      vFormatArr: ['Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
      vScrollTo: new Date(),

      // EVENTS

      // OnChangee
      vEventsChange: {
        taskname: console.log,
        res: console.log,
      },
      // EventsClickCell
      vEvents: {
        taskname: console.log,
        res: console.log,
        dur: console.log,
        comp: console.log,
        start: console.log,
        end: console.log,
        planstart: console.log,
        planend: console.log,
        cost: console.log,
        additional_category: console.log, // for additional fields
        beforeDraw: ()=>console.log('before draw listener'),
        afterDraw: ()=>{
            //console.log('before after listener: '+g.vTaskList.find(item => item.getOriginalID() == 121).getAllData().pName);
        }
      },
      vEventClickRow: console.log,
      vEventClickCollapse: console.log
    });


    // Teste manual add task
    /*
     g.AddTaskItemObject({
       pID: 100,
       pName: "Extranet empresa",
       pStart: "2022-02-01",
       pEnd: "2022-06-31",
       pPlanStart: "2022-01-01",
       pPlanEnd: "2022-07-31",
       pLink: "",
       pClass: "gtaskblue",
       pMile: 0,
       pComp: 20,
       pGroup: 0,
       pParent: 0,
       pOpen: 1,
       pNotes: "",
       category: 'Portales'
     });
    */
    JSGantt.parseJSON('./data.json', g, false)
            .then(j => jsonObj = j);
    g.Draw();

  } else {
    alert("Error, unable to create Gantt Chart");
  }

}

function scrollingTwoMains(mainMoving, mainMoved) {
  document.getElementById(mainMoved).scrollTop = document.getElementById(mainMoving).scrollTop;
}

function clearTasks() {
  g.ClearTasks();
  g.Draw()
}

function printTasksInConsole() {
  const tasks = g.vTaskList.map(e => ({ ...e.getAllData(), ...e.getDataObject() }));
  console.log(tasks);
}

function printChart(){
  let width, height;
  [ width, height ] = document.querySelector('#print_page_size').value.split(',');
  g.printChart( width, height );
}


function editValue(list, task, event, cell, column) {
  console.log(list, task, event, cell, column)
  const found = list.find(item => item.pID == task.getOriginalID());
  if (!found) {
    return;
  }
  else {
    found[column] = event ? event.target.value : '';
  }
}

function drawCustomElements(g) {
  for (const item of g.getList()) {
    const dataObj = item.getDataObject();
    if (dataObj && dataObj.deadline) {
      const x = g.chartRowDateToX(new Date(dataObj.deadline));
      const td = item.getChildRow().querySelector('td');
      td.style.position = 'relative';
      const div = document.createElement('div');
      div.style.left = `${x}px`;
      div.classList.add('deadline-line');
      td.appendChild(div);
    }
  }
}

function generateTooltip(task) {
  // default tooltip for level 1
  if (task.getLevel() === 1) return;

  // string tooltip for level 2. Show completed/total child count and current timestamp
  if (task.getLevel() === 2) {
    let childCount = 0;
    let complete = 0;
    for (const item of g.getList()) {
      if (item.getParent() == task.getID()) {
        if (item.getCompVal() === 100) {
          complete++;
        }
        childCount++;
      }
    }
    console.log(`Generated dynamic sync template for '${task.getName()}'`);
    return `
      <dl>
        <dt>Name:</dt><dd>{{pName}}</dd>
        <dt>Complete child tasks:</dt><dd style="color:${complete === childCount ? 'green' : 'red'}">${complete}/${childCount}</dd>
        <dt>Tooltip generated at:</dt><dd>${new Date()}</dd>
      </dl>
    `;
  }

  // async tooltip for level 3 and below
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 3000;
    setTimeout(() => {
      console.log(`Generated dynamic async template for '${task.getName()}'`);
      resolve(`Tooltip content from the promise after ${Math.round(delay)}ms`);
    }, delay);
  });
}

start('pt')