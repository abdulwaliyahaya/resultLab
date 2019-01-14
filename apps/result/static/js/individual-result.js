var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
var tBody = document.getElementById('tbody');
function fillResultTable(results, subjects) {
    var results = results;
    var subjects = subjects;
    for(var i = 0; i < results.length; i++){
        var result = results[i];
        var tableRow = document.createElement('tr');
        var serialNumber = document.createElement('td');
        serialNumber.textContent = result[0];
        tableRow.appendChild(serialNumber);
        var regNumber = document.createElement('td');
        regNumber.textContent = result[1];
        tableRow.appendChild(regNumber);
        var fullName = document.createElement('td');
        fullName.textContent = result[2];
        tableRow.appendChild(fullName);
        var loopPosition = 2;
        for(var j = 0; j < subjects.length; j++){
            loopPosition += 1;
            var subjectScore = document.createElement('td');
            subjectScore.textContent = result[loopPosition];
            tableRow.appendChild(subjectScore);
            loopPosition += 1;
            var subjectPosition = document.createElement('td');
            subjectPosition.textContent = result[loopPosition];
            tableRow.appendChild(subjectPosition);
        }
        loopPosition += 1;
        var totalScore = document.createElement('td');
        totalScore.textContent = result[loopPosition];
        tableRow.appendChild(totalScore);
        loopPosition += 1;
        var average = document.createElement('td');
        average.textContent = result[loopPosition];
        tableRow.appendChild(average);
        loopPosition += 1;
        var position = document.createElement('td');
        position.textContent = result[loopPosition];
        tableRow.appendChild(position);
        loopPosition += 1;
        var attendance = document.createElement('td');
        attendance.textContent = result[loopPosition];
        tableRow.appendChild(attendance);
        loopPosition += 1;
        var remark = document.createElement('td');
        remark.textContent = result[loopPosition];
        tableRow.appendChild(remark);

        tBody.appendChild(tableRow);

    }

}

function getResultData() {
    /* Send an ajax request and return list of resultSheet*/
    var xhr = new XMLHttpRequest();
    var url = window.location.pathname + 'ajax';
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    var response;
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            response = JSON.parse(xhr.responseText)
        }
    }
    xhr.send()
    return response;
}

function goBack() {
    var history_back = document.getElementById('history_back');
    history_back.onclick = function (event) {
        event.preventDefault()
        window.history.back()
    }
}

(function () {
    fillResultTable(getResultData()['results'], getResultData()['subjects']);
    getResultData()
    goBack()
})();