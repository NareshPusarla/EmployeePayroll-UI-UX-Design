let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener("DOMContentLoaded", (event) => {
    const name = document.querySelector("#name");
    // const textError = document.querySelector(".text-error");
    name.addEventListener("input", function () {
        if (name.value.length == 0) {
            setTextValue('.textContent', "");
            return;
        }
        try {
            const checkName = (name)=>{
                let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
                if(!nameRegex.test(name)) throw 'Name is Incorrect';
            }
            // textError.textContent = "";
            setTextValue('.textContent', "");
        } catch (e) {
            setTextValue('.textContent', e);
        }
    });

    //event listener for salary
    const salary = document.querySelector("#salary");
    setTextValue('.salary-output', salary.value);
    salary.addEventListener("input", function () {
        setTextValue('.salary-output', salary.value);
    });

    //date validation
    const date = document.querySelector("#date");
    date.addEventListener("input", function () {
        let startDate = getInputValueById('#day')+" "+getInputValueById('#month')+getInputValueById('#year');
        // const startDate = new Date(
        //     Date.parse(
        //         getInputValueById("#day") +
        //         " " +
        //         getInputValueById("#month") +
        //         " " +
        //         getInputValueById("#year")
        //     )
        // );
        try {
            const checkStartDate = (startDate)=>{
                let now = new Date();
                if(startDate>now) throw 'Start Date is a future date!';
                var diff = Math.abs(now.getTime() - startDate.getTime());
                if(diff/(1000*60*60*24)>30){
                    throw 'Start Date is beyond 30 days!';
                }
            }
            setTextValue(".date-error", "");
        } catch (e) {
            setTextValue(".date-error", e);
        }
    });

    document.querySelector('#cancelButton').href = site_properties.home_page;
    checkForUpdate();
});

//to create Employee Payroll Object On Save.
 
const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayrollObject();
        if(site_properties.use_local_storage.match("true")){
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        }else{
            createOrUpdateEmployeePayroll();
        }
    } catch (e) {
        return;
    }
};

const createOrUpdateEmployeePayroll = () =>{
    let postUrl = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate){
        methodCall = "PUT";
        postUrl = postUrl+employeePayrollObj.id.toString();
    }
    makeServiceCall(methodCall,postUrl,true,employeePayrollObj)
        .then(responseText => {
            resetForm();
            window.location.replace(site_properties.home_page);
        })
        .catch(error=>{
            throw error;
        });
}

//creating object
const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;

};


const setEmployeePayrollObject = () => {
    if(!isUpdate) employeePayrollObj.id = createNewEmployeeId();
    employeePayrollObj._name = getInputValueById("#name");
    employeePayrollObj._profilePic = getSelectedValues("[name=profile]").pop();
    employeePayrollObj._gender = getSelectedValues("[name=gender]").pop();
    employeePayrollObj._department = getSelectedValues("[name=department]");
    employeePayrollObj._salary = getInputValueById("#salary");
    employeePayrollObj._note = getInputValueById("#notes");
    let date =
        getInputValueById("#day") +
        " " +
        getInputValueById("#month") +
        " " +
        getInputValueById("#year");
    employeePayrollObj._startDate = date;
};


const setEmployeePayrollData = (employeePayrollData) => {
    try {
        employeePayrollData.name = employeePayrollObj._name;
    } catch (e) {
        setTextValue(".name-error", e);
        throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    employeePayrollData.id = Date.parse(new Date());
    try {
        employeePayrollData.startDate = new Date(
            Date.parse(employeePayrollObj._startDate)
        );
    } catch (e) {
        setTextValue(".date-error", e);
        throw e;
    }
    alert(employeePayrollData.toString());
};


const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID) + 1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
};

//to save the Employee Payroll Object to Local Storage.
 
function createAndUpdateStorage() {
    let employeePayrollList = JSON.parse(
        localStorage.getItem("EmployeePayrollList")
    );
    // console.log(employeePayrollList);

    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.find(
            (empData) => empData.id == employeePayrollObj.id
        );
        if (!empPayrollData) {
            employeePayrollList.push(employeePayrollObj);
        } else {
            const index = employeePayrollList
                .map((empData) => empData.id)
                .indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObj);
        }
    } else {
        employeePayrollList = [employeePayrollObj];
    }
    localStorage.setItem(
        "EmployeePayrollList",
        JSON.stringify(employeePayrollList)
    );
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


//Update an Employee Payroll details.
 
const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value === value)
            item.checked = true;
    });
}


//Reset form function to reset values
const resetForm = () => {
    setValue('#name', ' ');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', ' ');
    setValue('#notes', ' ');
    setValue('#day', '1');
    setValue('#month', 'January');
    setValue('#year', '2020');
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

const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}