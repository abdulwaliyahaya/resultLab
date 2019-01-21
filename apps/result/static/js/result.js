var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
var submitPreBtn = document.getElementById('submitPreBtn');
submitPreBtn.onclick = function (event) {
    event.preventDefault()
    var studentSubject =  document.getElementById('studentSubject');
    var student_class =  document.getElementById('studentClass').value;
    var session =  document.getElementById('resultSession').value;
    var term =  document.getElementById('resultTerm').value;
    var selectedSubjects = []
    for(var i = 0; i < studentSubject.length; i++){
        if(studentSubject[i].selected){
            selectedSubjects.push(studentSubject[i].value)
        }
    }
    var xhr = new XMLHttpRequest();
    var data = {
        studentClass: student_class
    };
    var studentList;
    var url = 'get-student-list';
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            var returnedStudentList = JSON.parse(xhr.responseText);
            studentList = returnedStudentList;
        }
    };
    xhr.send(JSON.stringify(data))
    generateSpreadSheet(selectedSubjects, studentList)

};

function generateSpreadSheet(subjects, students) {
    var spreadSheet = document.createElement('div');
    spreadSheet.setAttribute('class', 'spreadSheet');
    document.body.appendChild(spreadSheet)
    var table = document.createElement('table');
    spreadSheet.appendChild(table);
    var headingRow = document.createElement('tr');
    table.appendChild(headingRow);
    var sn = document.createElement('th');
    sn.textContent = 'S/N';
    headingRow.appendChild(sn);
    var studentth = document.createElement('th');
    studentth.textContent = 'Students';
    headingRow.appendChild(studentth);
    for(var i = 0; i < subjects.length; i++){
        var subjectth = document.createElement('th');
        subjectth.textContent = subjects[i];
        headingRow.appendChild(subjectth)
    }
    var attendance = document.createElement('th');
    attendance.textContent = 'ATTENDANCE';
    headingRow.appendChild(attendance);
    var remark = document.createElement('th');
    remark.textContent = 'STUDENT REMARK';
    headingRow.appendChild(remark)
    for(var e = 0; e < students.length; e++){
        var studentRow = document.createElement('tr');
        studentRow.setAttribute('class', 'studentResult')
        table.appendChild(studentRow)
        var serialNumber = document.createElement('td')
        var serial_number = e + 1;
        serialNumber.textContent = serial_number.toString();
        studentRow.appendChild(serialNumber);
        var studentReg  = document.createElement('td');
        studentReg.textContent = students[e];
        studentRow.appendChild(studentReg);
        for(var t = 0; t < subjects.length; t++){
            var td = document.createElement('td');
            studentRow.appendChild(td);
            var sub = document.createElement('input');
            sub.setAttribute('type', 'text');
            sub.style.width = '100%';
            sub.style.borderRadius = '0'
            td.appendChild(sub)
        }
        // attendance td
        var attendanceTd = document.createElement('td')
        var attendanceInput = document.createElement('input');
        attendanceInput.setAttribute('type', 'text')
        attendanceInput.style.width = '100%'
        attendanceInput.style.borderRadius = '0'
        attendanceTd.appendChild(attendanceInput)
        studentRow.appendChild(attendanceTd)
        // remark td
        var remarkTd = document.createElement('td')
        var remarkInput = document.createElement('input');
        remarkInput.setAttribute('type', 'text')
        remarkInput.style.width = '100%'
        remarkInput.style.borderRadius = '0'
        remarkTd.appendChild(remarkInput)
        studentRow.appendChild(remarkTd)
    }
    var resultSubmitButton = document.createElement('input');
    resultSubmitButton.setAttribute('type', 'button');
    resultSubmitButton.id = 'resultSubmitButton';
    resultSubmitButton.setAttribute('value', 'SUBMIT RESULT');
    resultSubmitButton.style.width = '100%';
    resultSubmitButton.style.height = '30px';
    resultSubmitButton.style.background = '#2e8b57';
    resultSubmitButton.style.color = '#fff';
    resultSubmitButton.style.borderStyle = 'solid';
    spreadSheet.appendChild(resultSubmitButton);
    resultSubmitButton.onclick = function () {
        var result = sendSpreadSheetData();
        var studentClassValue = document.getElementById('studentClass').value;
        var schoolSessionValue = document.getElementById('resultSession').value;
        var schoolTermValue = document.getElementById('resultTerm').value;
        sendResultAjax(result, schoolSessionValue, schoolTermValue, studentClassValue)

    }

    window.scrollTo(0,0);
    //document.getElementsByClassName('main_result_div')[0].removeChild(document.getElementById('resultHomeForm'))

}
function sendSpreadSheetData(){
    var studentResultTable = document.getElementsByTagName('table')[0];
    var topRow = studentResultTable.getElementsByTagName('tr')[0].getElementsByTagName('th');
    var heading = [];
    for(var i = 0; i < topRow.length; i++){
        heading.push(topRow[i].textContent)
    }
    //remove the S/N item
    heading.shift();
    var studentData = studentResultTable.getElementsByTagName('tr');
    var studentRawData = [];
    for(var y = 1; y < studentData.length; y++){
        var data = [];
        var row = studentData[y].getElementsByTagName('td');
        for(var s = 0; s < row.length; s++){
            if(row[s].firstChild.toString() === '[object HTMLInputElement]'){
                data.push(row[s].firstElementChild.value)
            }
            if(row[s].firstChild.toString() === '[object Text]'){
                data.push(row[s].firstChild.textContent)
            }
        }
        studentRawData.push(data)
    }
    for(var t = 0; t < studentRawData.length; t++){
        studentRawData[t].shift()
    }
    studentRawData.unshift(heading);
    // clean the data by converting the numbers in strings to integer
    for(var u = 1; u < studentRawData.length; u++){
        var studentRow = studentRawData[u];
        var length = studentRow.length - 1;
        for(var p = 1; p < length; p++){
            var n = studentRawData[u][p]
            if(isNaN(n)){
                alert('An error occurred, check all the scores entered and make sure they are numbers')
                throw new Error('n not a number')
            }
            studentRawData[u][p] = parseInt(n)
        }
    }
    return studentRawData;
}
function sendResultAjax(resultData, session, term, classz) {
    var xhr = new XMLHttpRequest();
    var url = 'process-result';
    var data = {
        result: resultData,
        session: session,
        term: term,
        classz: classz
    }
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            alert('Result processed successfully')
            window.location.pathname = 'school/result-list'
        }
    }
    xhr.send(JSON.stringify(data))
}