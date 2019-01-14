/*-----------------------------------------------------------------------------
 * settings.js - Ajax functions powering the setting page of result lab
 * Author: Abdulwali Yahaya
 * created: 23/08/2018
 * Last modified: 25/08/2018
 */

var csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

window.onload = function (){
    var nameLogoButton = document.getElementById('namelogo_submit');
    nameLogoButton.onclick = setNameLogo;
    updateCurrentTermSession();
    var termUpdateButton = document.getElementById('term_submit');
    termUpdateButton.onclick = setCurrentTermSession;
    var subjectAddButton = document.getElementById('subject_submit');
    subjectAddButton.onclick = addSubject;
    //addition of onclick event to subject delete button
    var subject_delete_buttons = document.getElementById('subjects').getElementsByClassName('delete_subject');
    for(var i = 0; i < subject_delete_buttons.length; i++) {
        var button = subject_delete_buttons[i];
        button.onclick = removeSubjectUpdate
    }
    var classAddButton = document.getElementById('class_submit');
    classAddButton.onclick = addClass;
    var class_delete_buttons = document.getElementById('classes').getElementsByClassName('delete_subject');
    //addition of onclick event to class delete button
    for(var i = 0; i < class_delete_buttons.length; i++) {
        var button = class_delete_buttons[i];
        button.onclick = removeClassUpdate
    }
}
//-----------------------------------------------------------------------------
// ajax function for setting School name and logo
//-----------------------------------------------------------------------------
var setNameLogo = function (event) {
    var form = document.getElementById('form_id');
    var formData = new FormData(form);
    var url = 'post-name-logo';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            response = JSON.parse(response);
            try{
                document.getElementById("img").src = response['img'];
                document.getElementById('pro_pic').src = response['img'];
            }
            catch (err){
            }
            document.getElementById('school_name').textContent = document.getElementById('id_name').value;
            alert('School name/logo updated Successfully')
        }
    };
    xhr.send(formData);
    event.preventDefault();
};
//-----------------------------------------------------------------------------
// ajax function for retrieving school's current term and updating the ui with it
//-----------------------------------------------------------------------------
var updateCurrentTermSession = function (){
    var xhr = new XMLHttpRequest();
    var url = 'update-current-term';
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
            var response = JSON.parse(xhr.responseText);
            var selectedTerm = document.getElementById('selected_term');
            var selectOptions = selectedTerm.getElementsByTagName('option');
            for(var i = 0; i < selectOptions.length; i++){
                if(selectOptions[i].value === response['current_term']){
                    selectOptions[i].selected = true;
                }
            }
            var current_session = response['current_session']
            document.getElementById('current_session').value = current_session
        }
    };
    xhr.send()
};
//-----------------------------------------------------------------------------
// ajax function for setting School's current term
//-----------------------------------------------------------------------------
var setCurrentTermSession = function (event){
    var selectedTerm = document.getElementById('selected_term');
    var current_session_id = document.getElementById('current_session');
    var current_term = selectedTerm.value;
    var current_session = current_session_id.value;
    var data = {
        current_term: current_term,
        current_session: current_session
    };
    var url = 'set-current-term';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
            var response = xhr.responseText;
            alert(response)
        }
    };
    xhr.send(JSON.stringify(data));
    event.preventDefault()
};
//-----------------------------------------------------------------------------
// ajax function to add subject and update list
//-----------------------------------------------------------------------------
var addSubject = function (event){
    var subjectFieldValue = document.getElementById('subject_id').value ;
    if(subjectFieldValue !== ''){
        event.preventDefault()
        var data = {
        subjectFieldValue: subjectFieldValue
        };
        var url = 'add-subject';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
        xhr.onreadystatechange = function (){
            if(xhr.readyState === 4 && xhr.status === 200){
                var response = xhr.responseText;
                response = JSON.parse(response);
                if(response['subjects'] === ''){
                    alert(response['response'])
                }
                if(response['subjects'] !== ''){
                    var subjectContainer = document.getElementById('subjects');
                    subjectContainer.textContent = '';
                    var subjects = response['subjects'];
                    // update the UI with the list of subject from response
                    for(var i =0; i < subjects.length; i++){
                        var subject = document.createElement('li');
                        subject.setAttribute('class', 'subject_list');
                        subject.textContent = subjects[i];
                        var delete_button = document.createElement('span');
                        delete_button.setAttribute('class', 'delete_subject');
                        delete_button.setAttribute('data-name', subjects[i]);
                        delete_button.textContent = 'x';
                        subject.appendChild(delete_button);
                        subjectContainer.appendChild(subject);
                        document.getElementById('subject_id').value = '';
                        document.getElementById('subject_id').focus();
                        // addition of onclick event handlers to the delete buttons
                        var subject_delete_buttons = document.getElementsByClassName('delete_subject');
                        for(var y = 0; y < subject_delete_buttons.length; y++) {
                            var button = subject_delete_buttons[y];
                            button.onclick = removeSubjectUpdate
}
                    }
                }
            }
        };
        xhr.send(JSON.stringify(data));
        event.preventDefault()
    }else{
        alert('You have not entered any subject to add')
    }
    event.preventDefault()
};
//-----------------------------------------------------------------------------
// ajax function to remove subject and update list
//-----------------------------------------------------------------------------
var removeSubjectUpdate = function(event){
    event.preventDefault()
    var subject = this.getAttribute('data-name');
    var url = 'remove-subject';
    var data = {
        'subject': subject
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
            var response = xhr.responseText;
            response = JSON.parse(response);
            var subjectContainer = document.getElementById('subjects');
            subjectContainer.textContent = '';
            var subjects = response['subjects'];
            for(var i =0; i < subjects.length; i++) {
                var subject = document.createElement('li');
                subject.setAttribute('class', 'subject_list');
                subject.textContent = subjects[i];
                var delete_button = document.createElement('span');
                delete_button.setAttribute('class', 'delete_subject');
                delete_button.setAttribute('data-name', subjects[i]);
                delete_button.textContent = 'x';
                subject.appendChild(delete_button);
                subjectContainer.appendChild(subject);
                var subject_delete_buttons = document.getElementsByClassName('delete_subject');
                for(var x = 0; x < subject_delete_buttons.length; x++) {
                    var button = subject_delete_buttons[x];
                    button.onclick = removeSubjectUpdate
}
            }
        }
    };
    xhr.send(JSON.stringify(data))
}
//-----------------------------------------------------------------------------
// ajax function to add class and update list
//-----------------------------------------------------------------------------
var addClass = function (event){
    var classFieldValue = document.getElementById('class_id').value ;
    if(classFieldValue !== ''){
        var data = {
        classFieldValue: classFieldValue
        };
        var url = 'add-class';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
        xhr.onreadystatechange = function (){
            if(xhr.readyState === 4 && xhr.status === 200){
                var response = xhr.responseText;
                response = JSON.parse(response);
                if(response['classes'] === ''){
                    alert(response['response'])
                }
                if(response['classes'] !== ''){
                    var classContainer = document.getElementById('classes');
                    classContainer.textContent = '';
                    var classes = response['classes'];
                    // update the UI with the list of subject from response
                    for(var i =0; i < classes.length; i++){
                        var classz = document.createElement('li');
                        classz.setAttribute('class', 'subject_list');
                        classz.textContent = classes[i];
                        var delete_button = document.createElement('span');
                        delete_button.setAttribute('class', 'delete_subject');
                        delete_button.setAttribute('data-name', classes[i]);
                        delete_button.textContent = 'x';
                        classz.appendChild(delete_button);
                        classContainer.appendChild(classz);
                        document.getElementById('class_id').value = '';
                        document.getElementById('class_id').focus();
                        // addition of onclick event handlers to the delete buttons
                        var class_delete_buttons = document.getElementById('classes').getElementsByClassName('delete_subject');
                        for(var y = 0; y < class_delete_buttons.length; y++) {
                            var button = class_delete_buttons[y];
                            button.onclick = removeClassUpdate
}
                    }
                }
            }
        };
        xhr.send(JSON.stringify(data));
        event.preventDefault()
    }else{
        alert('You have not entered any class to add')
    }
    event.preventDefault()
};
//-----------------------------------------------------------------------------
// ajax function to remove class and update list
//-----------------------------------------------------------------------------
var removeClassUpdate = function(event){
    event.preventDefault();
    var classz = this.getAttribute('data-name');
    var url = 'remove-class';
    var data = {
        'class': classz
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.setRequestHeader('X-CSRFToken', csrfToken);
    xhr.onreadystatechange = function (){
        if(xhr.readyState === 4 && xhr.status === 200){
            var response = xhr.responseText;
            response = JSON.parse(response);
            var classContainer = document.getElementById('classes');
            classContainer.textContent = '';
            var classes = response['classes'];
            for(var i =0; i < classes.length; i++) {
                var classz = document.createElement('li');
                classz.setAttribute('class', 'class_list');
                classz.textContent = classes[i];
                var delete_button = document.createElement('span');
                delete_button.setAttribute('class', 'delete_subject');
                delete_button.setAttribute('data-name', classes[i]);
                delete_button.textContent = 'x';
                classz.appendChild(delete_button);
                classContainer.appendChild(classz);
                var class_delete_buttons = document.getElementById('classes').getElementsByClassName('delete_subject');
                for(var x = 0; x < class_delete_buttons.length; x++) {
                    var button = class_delete_buttons[x];
                    button.onclick = removeClassUpdate
}
            }
        }
    };
    xhr.send(JSON.stringify(data))
};