let empPayrollList;
window.addEventListener('DOMContentLoader', (event) => {
    empPayrollList = getEmployeePayrollDataFromStorage();
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem("editEmp");
});

const getEmployeePayrollDataFromStorage = () => {
    return localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
}

const createInnerHtml = () => {

    const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th>" +
        "<th>start Date</th><th>Actions</th>";

    if (empPayrollList.length == 0){
        return;
    }
    let innerHtml = `${headerHtml}`
    for (const empPayrollData of empPayrollList) {
        innerHtml = `${innerHtml}
            <tr>
                <td><img src="${empPayrollData._profilePic}" class="profile" width="30px" alt=""></td>
                <td>${employeePayrollData._name}</td>
                <td>${employeePayrollData._gender}</td>
                <td>${getDeptHtml(employeePayrollData._department)}</td>
                <td>${employeePayrollData._salary}</td>
                <td>${employeePayrollData._startDate}</td>
                <td>
                    <img name="${empPayrollData._id}" onclick="remove(this)" alt="delete" width="30px" src="Assests\delete-black-18dp.svg">
                    <img name="${empPayrollData._id}" onclick="update(this)" alt="edit" width="30px" src="Assests\delete-black-18dp.svg ">
                </td>
            </tr>
        `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml
}
