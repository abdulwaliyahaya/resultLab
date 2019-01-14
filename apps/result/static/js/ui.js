

(function () {
    var highlightNavLink = function (navLink) {
    var style = navLink.style;
        style.background = '#2C3B41';
        style.borderLeft = '4px solid #2e8b57';
        style.opacity = '1';
};
    var currentUrl = window.location.href;
    var domain = window.location.host;
    var path = currentUrl.replace(domain, '');
    path = path.replace('http://', '');
    //var path2 = window.location.pathname;
    var home = 'http://' + domain + '/school/';
    // variables for login links
    var overview = document.getElementById('overview_id');
    var result = document.getElementById('result_id');
    var student = document.getElementById('student_id');
    var setting = document.getElementById('setting_id');
    if(currentUrl === home){
        highlightNavLink(overview)
    }
    if(path.indexOf('/school/student') === 0){
        highlightNavLink(student)
    }
    if(path.indexOf('/school/result') === 0){
        highlightNavLink(result)
    }
    if(path.indexOf('/school/setting') === 0){
        highlightNavLink(setting)
    }
})();

var navLinks = document.getElementsByClassName('set-panel')[0].getElementsByTagName('li');

for(var i = 0; i < navLinks.length;i++){
    navLinks[i].onclick = function () {
        var div = [document.getElementById('school_name_logo'), document.getElementById('school_subject'),
            document.getElementById('current_term'), document.getElementById('school_class')];

        for(var i = 0; i < div.length; i++) {
            div[i].style.display = 'none';
        }
        function setting_update(id, heading) {
            document.getElementById(id).style.display = 'flex';
            var setting_container = document.getElementById('setting-div');
            setting_container.getElementsByTagName('header')[0].getElementsByTagName('h5')[0].textContent = heading
        }
        document.getElementById('setting-div').style.display = 'block';
        if(this.getAttribute('data-name') === 'namelogo'){
            setting_update("school_name_logo", 'School Name and Logo')
        }
        if(this.getAttribute('data-name') === 'subject'){
            setting_update('school_subject', 'Subject Setting')
        }
        if(this.getAttribute('data-name') === 'class'){
            setting_update('school_class', 'Class Setting')
        }
        if(this.getAttribute('data-name') === 'term'){
            setting_update('current_term', 'Current Term Setting')
        }
    }
}

var setting_close = document.getElementById('setting_close');
setting_close.onclick = function (){
    document.getElementById('setting-div').style.display = 'none';
};
