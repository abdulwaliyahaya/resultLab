var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

function getResult(classz, page) {
    /* Send an ajax request and return list of resultSheet*/
    var data = {
        classz: classz,
        page: page
    }
    var xhr = new XMLHttpRequest();
    var url = 'get-results';
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
    /* Populate the data returned by the getResult function */
    var result = resultData;
    var tableBody = document.getElementById('tbody');
    tableBody.textContent = '';
    for(var i = 0; i < result.length; i++){
        var specificResult = result[i];
        var tableRow = document.createElement('tr');
        tableRow.setAttribute('data-resultID', specificResult[5]);
        var checktd = document.createElement('td');
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.value = specificResult[1];
        checkbox.setAttribute('class', 'checkStudent');
        checktd.appendChild(checkbox);
        tableRow.appendChild(checktd);
        var serialNumber = document.createElement('td');
        serialNumber.textContent = specificResult[0];
        tableRow.appendChild(serialNumber);
        var name = document.createElement('td');
        name.textContent = specificResult[1];
        tableRow.appendChild(name);
        var className = document.createElement('td');
        className.textContent = specificResult[2];
        tableRow.appendChild(className);
        var term = document.createElement('td');
        term.textContent = specificResult[3];
        tableRow.appendChild(term);
        var session = document.createElement('td');
        session.textContent = specificResult[4];
        tableRow.appendChild(session);
        tableBody.appendChild(tableRow);
        tableRow.onclick = resultClickHandler
    }
}

function resultClickHandler() {
    window.location.pathname = 'school/result/' + this.getAttribute('data-resultID')
}

function addPaging(num_of_pages, requested_page, className) {
    /* function for adding paging */
    var paging =  document.getElementsByClassName('paging')[0];
    paging.textContent = '';
    for(var i = 1; i < num_of_pages + 1; i++){
        var pageLink = document.createElement('a');
        pageLink.setAttribute('data-page', i.toString());
        pageLink.setAttribute('href', '');
        pageLink.setAttribute('data-classz', className);
        pageLink.setAttribute('class', 'page_number');
        pageLink.textContent = i.toString();
        pageLink.onclick = pagingButtonHandler;
        paging.appendChild(pageLink);
        //add current_page to the current pageLink
        var pages = paging.getElementsByTagName('a');
        for(var r = 0; r < pages.length; r++){
            if(pages[r].getAttribute('data-page') === requested_page.toString()){
                pages[r].setAttribute('class', 'current_page')
            }
        }
    }
}

function pagingButtonHandler(event) {
    /* onclick function for page button */
    event.preventDefault()
    var page = this.getAttribute('data-page').toString();
    var className = this.getAttribute('data-classz');
    updateResultInterface(className, page)
}
function updateResultInterface(className, page) {
    /* updating the result interface using the fillTableData and addPaging functions */
    var result = getResult(className, page);
    fillTableData(result['results']);
    addPaging(result['num_of_pages'], result['requested_page'], result['classz'])
}

function selectAllResultHandler() {
    var selectCheckbox = document.getElementById('selectCheckbox');
    selectCheckbox.onchange = function (){
        var studentsBox = document.getElementsByClassName('checkStudent');
        if(selectCheckbox.checked === true){
            for(var o = 0; o < studentsBox.length; o++){
                studentsBox[o].checked = true;
            }
        }else{
            for(var u = 0; u < studentsBox.length; u++){
                studentsBox[u].checked = false;
            }
        }
    }
}

function deleteResults(event) {
    event.preventDefault();
    var resultList = [];
    var resultCheckBoxes = document.getElementsByClassName('checkStudent');
    for(var i = 0; i < resultCheckBoxes.length; i++){
        if(resultCheckBoxes[i].checked === true){
            resultList.push(resultCheckBoxes[i].value);
        }
    }
    var data = {
        resultList: resultList
    }
    var xhr = new XMLHttpRequest();
    var url = 'delete-results';
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            alert('result deleted successfully...')
            updateResultInterface(document.getElementById('student_class').value, 1);
        }
    };
    xhr.send(JSON.stringify(data))
}
(function () {
    // event handler for selecting result class
    var selectResultClassBtn = document.getElementById('search');
    selectResultClassBtn.onclick = function (event) {
        event.preventDefault();
        updateResultInterface(document.getElementById('student_class').value, 1);
    };
    updateResultInterface('', 1);
    selectAllResultHandler();
    var deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    deleteSelectedBtn.onclick = deleteResults
})();
