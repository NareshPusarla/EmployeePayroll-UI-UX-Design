class EmployeeDetails {

    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        let nameRegex = RegExp('^[A-Z]{1}[a-z]{2,}$');
        if (nameRegex.test(name)) {
            this._name = name;
        } else {
            throw 'Name is not valid';
        }
    }
    get profilePic() {
        return this._profilePic;
    }
    set profilePic(profilePic) {
        this._profilePic = profilePic;
    }
    get gender() {
        return this._gender;
    }
    set gender(gender) {
        this._gender = gender;
    }
    get department() {
        return this._department;
    }
    set department(department) {
        this._department = department;
    }
    get salary() {
        return this._salary;
    }
    set salary(salary) {
        this._salary = salary;
    }
    get note() {
        return this._note;
    }
    set note(note) {
        this._note = note;
    }
    get startDate() {
        return this._startDate;
    }
    set startDate(startDate) {
        let now = new Date();
        if(startDate>now) throw 'Start Date is a future Date!';
        var diff = Math.abs(now.getTime() - startDate.getTime());
        if(diff/(1000*60*60*24)>30) throw 'Start Date is beyond 30 Days!';
        this._startDate = startDate;
    }

    toString() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const empDate = this.startDate === undefined ? "Undefined" : this.startDate.toLocaleDateString("en-US", options);
        return "id : " + this.id + " Name : " + this.name + " Gender : " + this.gender + " Profile Pic : "
            + this.profilePic + " Department : " + this.department + " Salary : " + this.salary + " Start Date : " + empDate
            + " Notes : " + this.note;
    }
}

let isUpdate = false;
let employeePayrollObj = {};
window.addEventListener('DOMContentLoader', () => {
    const name = document.querySelector('#name');
    name.addEventListener('input', function () {
        if (name.value.length == 0) {
            setTextValue('.text-error',"");
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;
            setTextValue('.text-error',"");
        } catch (e) {
            setTextValue('.text-error',e);
        }
    });

    const date = document.querySelector('#date');
    date.addEventListener('input', function(){
        const startDate = new Date(Date.parse(getInputValueById('#day')+""+getInputValueById('#month')+""+getInputValueById('#year')));
        try{
            (new EmployeePayrollData()).startDate = startDate;
            setTextValue('.date-error',"");
        }catch(e){
            setTextValue('.date-error',e);
        }
    })

    const salary = document.querySelector('#salary');
    setTextValue('.salary-output',salary.value);
    salary.addEventListener('input', function () {
        setTextValue('.salary-output',salary.value);
    });
    checkForUpdate();
});

const checkForUpdate = ()=> {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if(!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () =>{
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]',employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]',employeePayrollObj._gender);
    setSelectedValues('[name=department]',employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output',employeePayrollObj._salary)
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split("");
    setValue('#day',date[0]);
    setValue('#month',date[1]);
    setValue('#year',date[2]);
}

const setSelectedValues = (propertyValue, value) =>{
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item =>{
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }else if (item.value === value) {
            item.checked = true;
        }
    });
}

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace(site_properties.home_page);
    } catch (e) {
        return;
    }
}

const setEmployeePayrollObject = ()=>{
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();   
    employeePayrollObj._department = getSelectedValues('[name=department]'); 
    employeePayrollObj._salary = getSelectedValues('#salary');
    employeePayrollObj._note = getSelectedValues('#notes');
    let date = getInputValueById('#day')+" "+getInputValueById('#month')+" "+getInputValueById('#year');
    employeePayrollObj._startDate = date;
}

const createAndUpdateStorage = () =>{
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList){
        let empPayrollData = empPayrollList.find(empData=>empData._id == employeePayrollObj._id);
        if (!employeePayrollList) {
            employeePayrollList.push(createEmployeePayrollData());
        } else {
            const index = employeePayrollList.map(empData=>empData._id).indexOf(empPayrollData._id);
            employeePayrollList.splice(index,1,createEmployeePayrollData(empPayrollData._id));
        }
    }else{
        employeePayrollList = [createEmployeePayrollData()]
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createEmployeePayrollData = (id) =>{
    let employeePayrollData = new EmployeePayrollData();
    if(!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData)=>{
    try{
        employeePayrollData.name = employeePayrollObj._name;
    }catch(e){
        setTextValue('.text-error',e);
        throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    try {
        employeePayrollData.startDate = new Date(Date.parse(employeePayrollObj._startDate));
    } catch (e) {
        setTextValue('.date-error',e);
        throw e;
    }
    alert(employeePayrollData.toString());
}

const createNewEmployeeId = ()=>{
    let empID = localStorage.setItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}

function saveEmployeeDetails() {
    let name = document.getElementById("name").value
    console.log(name);

    let department = document.getElementsByClassName("checkbox")
    for (var i = 0; i < department.length; i++) {
        if (department[i].checked) {
            console.log(department[i].value)
        }
    }
    console.log(department);

    let gender = document.getElementsByName("gender")
    for (var i = 0; i < gender.length; i++) {
        if (gender[i].checked) {
            console.log(gender[i].value)
        }
    }
    console.log(gender);
}


const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if (item.checked) selItems.push(item.value);
    });
    return selItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getInputElementValue = (id) => {
    let value = document.getElementById(id).value;
    return value;
}

// function createAndUpdateStorage(employeePayrollData) {
//     let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
//     if (employeePayrollList != undefined) {
//         employeePayrollList.push(employeePayrollData);
//     } else {
//         employeePayrollList = [employeePayrollData];
//     }
//     alert(employeePayrollList.toString());
//     localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
// }

const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name = department]');
    setValues('#salary', '');
    setValue('#notes', '');
    setValue('#startDate', '1-January-2020');
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
    }
    return deptHtml;
}

// const createEmployeePayrollJSON = () => {
//     let empPayrollListLocal = [
//         {
//             _name : 'Naresh',
//             _gender : 'Male',
//             _department : [
//                 'Engineering',

//             ],
//             _salary: '1000',
//             _startDate: '1 Jan 2021',
//             _note: '',
//             _id: new Date().getTime(),
//             _profilePic: '../assets/profile-images/Ellipse -3.png'
//         },
//         {
//             _name : 'Nisha',
//             _gender : 'Female',
//             _department : [
//                 'Finance',

//             ],
//             _salary: '2000',
//             _startDate: '1 Feb 2021',
//             _note: '',
//             _id: new Date().getTime(),
//             _profilePic: '../assets/profile-images/Ellipse -1.png'
//         }
//     ];
//     return empPayrollListLocal;
// }

const remove = (node) =>{
    let empPayrollData = empPayrollList.find(empData=>empData._id==node._id);
    if(!empPayrollData) return;
    const index = empPayrollList.map(empData=>empData._id).indexOf(empPayrollData._id);
    empPayrollList.splice(index,1);
    localStorage.setItem("EmployeepayrollList",JSON.stringify(empPayrollList));
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
}