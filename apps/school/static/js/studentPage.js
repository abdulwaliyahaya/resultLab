var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

function studentList(query, classz, page) {
    var data = {
        query: query,
        classz: classz,
        page: page
    }
    var url = 'student-list'
    xhr  = new XMLHttpRequest()
    xhr.open('POST', url, false)
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200){
            var response = xhr.responseText;
            response = JSON.parse(response);
            var page = response['requested_page'];
            var pageCount = response['num_of_pages'];
            var query = response['query'];
            var classz = response['classz'];
            var studentList = response['students'];
            var tableBody = document.getElementById('tbody');
            tableBody.textContent = '';
            for(var s = 0; s < studentList.length; s++){
                var student_info = studentList[s];
                var tableRow = document.createElement('tr');
                tableRow.setAttribute('data-studentID', student_info[1]);
                tableRow.setAttribute('class', 'student_row');
                tableRow.onclick = studentClickHandler;
                var checktr = document.createElement('td');
                var checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox')
                checkbox.value = student_info[1];
                checkbox.setAttribute('class', 'checkStudent')
                checktr.appendChild(checkbox);
                tableRow.appendChild(checktr);
                var serialNumber = s + 1;
                //serial tr
                var sltr = document.createElement('td');
                sltr.textContent = student_info[0]
                tableRow.appendChild(sltr);
                // registration number tr
                var regtr = document.createElement('td');
                regtr.textContent = student_info[1]
                tableRow.appendChild(regtr)
                // full name tr
                var fntr = document.createElement('td');
                fntr.textContent = student_info[2]
                tableRow.appendChild(fntr)
                // gender tr
                var gtr = document.createElement('td');
                gtr.textContent = student_info[3]
                tableRow.appendChild(gtr)
                // class tr
                var clstr = document.createElement('td');
                clstr.textContent = student_info[4]
                tableRow.appendChild(clstr)
                tableBody.appendChild(tableRow)
            }
            var paging =  document.getElementsByClassName('paging')[0];
            paging.textContent = '';
            for(var z = 1; z < pageCount + 1; z++){
                var pageLink = document.createElement('a');
                pageLink.setAttribute('data-page', z.toString());
                pageLink.setAttribute('data-query', query);
                pageLink.setAttribute('href', '');
                pageLink.setAttribute('data-classz', classz);
                pageLink.setAttribute('class', 'page_number');
                pageLink.textContent = z.toString();
                paging.appendChild(pageLink);
                pageLink.onclick = addEvent
            }
            //add current_page to the current pageLink
            var pages = paging.getElementsByTagName('a');
            for(var r = 0; r < pages.length; r++){
                if(pages[r].getAttribute('data-page') === page.toString()){
                    pages[r].setAttribute('class', 'current_page')
                }
            }

        }
    }
    xhr.send(JSON.stringify(data))

}
//----------------------------------------
function studentClickHandler() {
    window.location.pathname = 'school/student/' + this.getAttribute('data-studentID')
}
(function () {
    var student_class = document.getElementById('student_class');
    var search = document.getElementById('search');
    var query = document.getElementById('query');
    var optionElement = document.createElement('option');
    optionElement.value = '';
    optionElement.selected = true;
    student_class.insertBefore(optionElement, student_class.firstChild);
    studentList(query.value, student_class.value, 1);
    search.onclick = function (event){
        event.preventDefault();
        studentList(query.value, student_class.value, 1)
    };
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
    var deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    deleteSelectedBtn.onclick = function (event){
        event.preventDefault();
        var studentsBox = document.getElementsByClassName('checkStudent');
        var studentDeleteList = [];
        for(var j = 0; j < studentsBox.length; j++){
            if(studentsBox[j].checked === true){
                studentDeleteList.push(studentsBox[j].value)
            }
        }
        // ajax request to send name to be deleted
        var xhrDelete = new XMLHttpRequest();
        var url = 'remove-students';
        xhrDelete.open('POST', url, false);
        xhrDelete.setRequestHeader('X-CSRFToken', csrfToken);
        xhrDelete.onreadystatechange = function (){
            if(xhrDelete.readyState === 4 && xhrDelete.status === 200){
                alert('deleted successfully...')
                studentList('', '', 1)
            }
        }
        var data = {
            studentDeleteList: studentDeleteList
        }
        xhrDelete.send(JSON.stringify(data))
    }
    var addStudentsBtn = document.getElementById('addStudentsBtn');
    addStudentsBtn.onclick = function (event){
        event.preventDefault()
        var addStudentCsvForm = document.getElementById('addStudentCsvForm');
        var formData = new FormData(addStudentCsvForm);
        var xhr = new XMLHttpRequest();
        var url = 'add-students';
        xhr.open('POST', url, false);
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
        xhr.onreadystatechange = function (){
            if(xhr.readyState === 4 && xhr.status === 200){
                alert('Students added successfully...')
                studentList('', '', 1)
            }
        };
        xhr.send(formData)
    }

})();
function addEvent(event) {
    event.preventDefault();
    console.log(this.getAttribute('data-classz'));
    studentList(this.getAttribute('data-query'), this.getAttribute('data-classz'),
        parseInt(this.getAttribute('data-page')))
}

var studentButtons = document.getElementsByClassName('add_student');
for(var i = 0; i < studentButtons.length;i++){
    studentButtons[i].onclick = function () {
        var div = [document.getElementById('add_student_frame'), document.getElementById('add_students_frame'),
            document.getElementById('promote_students_frame')];

        for(var i = 0; i < div.length; i++) {
            div[i].style.display = 'none';
        }
        function setting_update(id, heading) {
            document.getElementById(id).style.display = 'flex';
            var setting_container = document.getElementById('add_student_div');
            setting_container.getElementsByTagName('header')[0].getElementsByTagName('h5')[0].textContent = heading
        }
        document.getElementById('add_student_div').style.display = 'block';
        if(this.getAttribute('data-name') === 'add_student'){
            setting_update("add_student_frame", 'Add Student')
        }
        if(this.getAttribute('data-name') === 'add_students'){
            setting_update('add_students_frame', 'Add Many Students')
        }
        if(this.getAttribute('data-name') === 'promote_students'){
            setting_update('promote_students_frame', 'Promote Students')
        }

    }
}

var student_close = document.getElementById('student_close');
student_close.onclick = function (){
    document.getElementById('add_student_div').style.display = 'none';
};
var addStudentBtn = document.getElementById('add_student_btn');
addStudentBtn.onclick = function (event){
    event.preventDefault();
    var form = document.getElementById('student_data');
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    var url = 'add-student';
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
            var response = xhr.responseText;
            if(response === 'successful'){
                alert('Student Added Succesful');
                document.getElementById('reg_id').value = '';
                document.getElementById('first_name').value = '';
                document.getElementById('last_name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('address').value = '';
                document.getElementById('parent_phone').value = '';
                studentList('', '', 1);
            }
        }
    };
    xhr.send(formData)
}
