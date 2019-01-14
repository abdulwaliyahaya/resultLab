var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
var student = document.getElementById('username').textContent;
function getStudentResult() {
    /* Send an ajax request and return list of student resultSheet*/
    var data = {
        student: student
    }
    var xhr = new XMLHttpRequest();
    var url = 'ajax/';
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    var response;
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            response = JSON.parse(xhr.responseText)
        }
    }
    xhr.send(JSON.stringify(data))
    return response;
}
function fillTableData(resultData) {
    /* Populate the data returned by the getStudentResult function */
    var result = resultData;
    var tableBody = document.getElementById('tbody');
    tableBody.textContent = '';
    for(var i = 0; i < result.length; i++){
        var specificResult = result[i];
        var tableRow = document.createElement('tr');
        tableRow.setAttribute('data-resultID', specificResult[1]);
        var serialNumber = document.createElement('td');
        serialNumber.textContent = specificResult[0];
        tableRow.appendChild(serialNumber);
        var name = document.createElement('td');
        name.textContent = specificResult[2];
        tableRow.appendChild(name);
        var className = document.createElement('td');
        className.textContent = specificResult[3];
        tableRow.appendChild(className);
        var term = document.createElement('td');
        term.textContent = specificResult[4];
        tableRow.appendChild(term);
        var session = document.createElement('td');
        session.textContent = specificResult[5];
        tableRow.appendChild(session);
        tableBody.appendChild(tableRow);
        tableRow.onclick = resultClickHandler
    }
}
function updateResultInterface() {
    /* updating the result interface using the fillTableData and addPaging functions */
    var result = getStudentResult();
    if(result.length === 0){
        alert(student + ' does not have any result yet')
    }
    fillTableData(result);
}
function goBack() {
    var history_back = document.getElementById('history_back');
    history_back.onclick = function (event) {
        event.preventDefault()
        window.history.back()
    }
}
function resultClickHandler() {
    // background for showing result
    var background = document.createElement('div')
    background.style.background = '#2e8b57';
    background.style.position = 'absolute';
    background.style.top = '0px';
    background.style.left = '0px';
    background.style.width = '100%'
    background.style.height = '100%';
    background.style.display = 'flex';
    background.style.alignContent = 'center';
    background.style.alignItems = 'center';
    background.style.justifyContent = 'center';
    document.body.appendChild(background);
    //result id
    var resultID = this.getAttribute('data-resultID');
    var result = getStudentResultSpecific(resultID);
    // result div
    var resultContainer = document.createElement('div');
    resultContainer.style.width = '500px';
    resultContainer.style.background = '#fff';
    resultContainer.style.border = '2px solid #2e8b57';
    resultContainer.style.padding = '10px'
    background.appendChild(resultContainer)
    var heading = document.createElement('div');
    resultContainer.appendChild(heading);
    var overallPerformance = result['overall_performance'];
    //score
    var totalScore = overallPerformance['score']
    var score  = document.createElement('h6');
    score.style.fontWeight = 'bold'
    score.textContent = 'TOTAL SCORE: ' + totalScore;
    heading.appendChild(score)
    //position
    var position = overallPerformance['position'];
    var pos  = document.createElement('h6');
    pos.style.fontWeight = 'bold';
    pos.textContent = 'POSITION: ' + position + " out of " + overallPerformance['student_count'];
    heading.appendChild(pos)
    //average
    var average = overallPerformance['average'];
    var avg  = document.createElement('h6');
    avg.style.fontWeight = 'bold';
    avg.textContent = 'AVERAGE: ' + average;
    heading.appendChild(avg)
    //attendance
    var attendance = overallPerformance['attendance'];
    var att  = document.createElement('h6');
    att.style.fontWeight = 'bold'
    att.textContent = 'ATTENDANCE: ' + attendance;
    heading.appendChild(att)
    //remark
    var remark = overallPerformance['remark'];
    var rmk  = document.createElement('h6');
    rmk.style.fontWeight = 'bold'
    rmk.textContent = "TEACHER'S REMARK: " + remark;
    heading.appendChild(rmk)
    //date prepared
    var date = overallPerformance['date'];
    var dte  = document.createElement('h6');
    dte.style.fontWeight = 'bold'
    dte.textContent = 'DATE PREPARED: ' + date;
    heading.appendChild(dte)
    //--- subject results
    var subjectResult = result['subjects'];
    var table = document.createElement('table')
    resultContainer.appendChild(table)
    var headingTr = document.createElement('tr')
    table.appendChild(headingTr)
    var subjectHD = document.createElement('th');
    subjectHD.textContent = 'SUBJECTS';
    headingTr.appendChild(subjectHD)
    var scoreHD = document.createElement('th');
    scoreHD.textContent = 'SCORE';
    headingTr.appendChild(scoreHD)
    var positionHD = document.createElement('th');
    positionHD.textContent = 'POSITION';
    headingTr.appendChild(positionHD)
    // list subject result data
    for(var i = 0; i < subjectResult.length; i++){
        var subjectData = subjectResult[i];
        var tableRow = document.createElement('tr');
        table.appendChild(tableRow);
        // subject
        var subjectTD = document.createElement('td')
        subjectTD.textContent = subjectData[0]
        tableRow.appendChild(subjectTD)
        // score
        var scoreTD = document.createElement('td');
        scoreTD.textContent = subjectData[1];
        tableRow.appendChild(scoreTD)
        // position
        var positionTD = document.createElement('td')
        positionTD.textContent = subjectData[2]
        tableRow.appendChild(positionTD)
    }
    var submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.value = 'Close';
    submitBtn.style.width = '100%';
    submitBtn.onclick = function (event) {
        event.preventDefault();
        document.body.removeChild(background)
    }
    resultContainer.appendChild(submitBtn)

}
function getStudentResultSpecific(resultID) {
    var data = {
        resultID: resultID
    }
    var xhr = new XMLHttpRequest();
    var url = 'ajax/specific';
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    var response;
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            response = JSON.parse(xhr.responseText)
        }
    }
    xhr.send(JSON.stringify(data))
    return response;
}
(function () {
    updateResultInterface()
    goBack()
})();