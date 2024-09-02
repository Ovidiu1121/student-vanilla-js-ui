export function createHome(alert) {

    let container = document.querySelector(".container");


    container.innerHTML = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
       </div> 

    	<h1>Students</h1>

    <button class="button">Add student</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Name</th>
				<th>Age</th>
				<th>Specialization</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    `
    let button = document.querySelector(".button");
    let table = document.querySelector(".table");
    const alertPlaceholder = document.querySelector('.container-alert');
    let load = document.querySelector(".spinner-border");

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    api("https://localhost:7222/api/v1/Student/all").then(response => {
        return response.json();
    }).then(data => {
        load.classList = "";
        console.log(data);
        attachStudents(data.studentList);
    }).catch(error => {
        load.classList = "";
        console.error('Error fetching data:', error);
        appendAlert(error, "danger");
    });

    button.addEventListener("click", (eve) => {
        CreateAddStudentPage();
    });

    table.addEventListener("click", (eve) => {

        if (eve.target.classList.contains("updateStudent")) {
            api(`https://localhost:7222/api/v1/Student/id/${eve.target.textContent}`).then(res => {
                return res.json();
            }).then(data => {
                console.log(data);

                let student = {
                    name: data.name,
                    age: data.age,
                    specialization: data.specialization
                }

                CreateUpdatePage(student, eve.target.textContent);

            }).catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    });

    if (alert === "deleted") {
        load.classList = "";
        appendAlert("Student has been DELETED with success!", "success");
    }

    if (alert === "updated") {
        load.classList = "";
        appendAlert("Student has been UPDATED with success!", "success");
    }

    if (alert === "added") {
        load.classList = "";
        appendAlert("Student has been ADDED with success!", "success");
    }

}

export function CreateAddStudentPage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New Student</h1>
    <form>
        <p class="name-container">
            <label for="name">Name</label>
            <input name="name" type="text" id="name">
            <a class="nameErr">Name required!</a>
        </p>
        <p class="age-container">
            <label for="age">Age</label>
            <input name="age" type="text" id="age">
            <a class="ageErr">Age required!</a>
        </p>
        <p class="specialization-container">
            <label for="specialization">Specialization</label>
            <input name="specialization" type="text" id="specialization">
            <a class="specializationErr">Specialization required!</a>
        </p>
        <div class="createStudent">
         <a href="#">Create New Student</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createStudent");

    button.addEventListener("click", (eve) => {
        createHome("");
    })

    test.addEventListener("click", (eve) => {
        createUpdateStudent("create");
    })

}

export function CreateUpdatePage(student, idStudent) {

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Update Student</h1>
    <form>
        <p>
            <label for="name">Name</label>
            <input name="name" type="text" id="name" value="${student.name}">
             <a class="nameErr">Name required!</a>
        </p>
        <p>
            <label for="age">Age</label>
            <input name="age" type="text" id="age" value="${student.age}">
             <a class="ageErr">Age required!</a>
        </p>
        <p>
            <label for="specialization">Specialization</label>
            <input name="specialization" type="text" id="specialization" value="${student.specialization}">
             <a class="specializationErr">Specialization required!</a>
        </p>

        <div class="submitUpdate">
         <a href="#">Update Student</a>
        </div>

          <div class="cancel">
         <a href="#">Cancel</a>
        </div>
        <div class="submitDelete">
         <a href="#">Delete Student</a>
        </div>
    </form>
    `

    let cancelButton = document.querySelector(".cancel");
    let submitUpdateButton = document.querySelector(".submitUpdate");
    let submitDeleteButton = document.querySelector(".submitDelete");
    let nameinput = document.getElementById("name");

    nameinput.disabled = true;

    cancelButton.addEventListener("click", (eve) => {
        createHome("");
    });

    submitUpdateButton.addEventListener("click", (eve) => {
        createUpdateStudent("update", idStudent);
    });

    submitDeleteButton.addEventListener("click", (eve) => {

        api(`https://localhost:7222/api/v1/Student/delete/${idStudent}`, "DELETE")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome("deleted");
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    })


}

function createRow(student) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td class="updateStudent">${student.id}</td>
				<td>${student.name}</td>
				<td>${student.age}</td>
				<td>${student.specialization}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachStudents(students) {

    let lista = document.querySelector("thead");

    students.forEach(student => {

        let tr = createRow(student);
        lista.appendChild(tr);

    });

    return lista;

}

function createUpdateStudent(request, idStudent) {

    const isNumber = (str) => {
        return /^[+-]?\d+(\.\d+)?$/.test(str);
    };

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let specialization = document.getElementById("specialization").value;

    let nameError = document.querySelector(".nameErr");
    let ageError = document.querySelector(".ageErr");
    let specializationError = document.querySelector(".specializationErr");

    let errors = [];

    if (name == '') {

        errors.push("Name");

    } else if (nameError.classList.contains("beDisplayed") && name !== '') {

        errors.pop("Name");
        nameError.classList.remove("beDisplayed");
    }

    if (age == '') {

        errors.push("Age");

    } else if (ageError.classList.contains("beDisplayed") && age !== '') {

        errors.pop("Age");
        ageError.classList.remove("beDisplayed");
    }

    if (specialization == '') {

        errors.push("Specialization");

    } else if (specializationError.classList.contains("beDisplayed") && specialization !== '') {

        errors.pop("Specialization");
        specializationError.classList.remove("beDisplayed");

    }

    if (!isNumber(age) && age != '') {

        errors.push("Age2");
    }
    else if (isNumber(age)) {

        errors.pop("Age2");

    } else if (ageError.classList.contains("beDisplayed") && age !== '') {

        errors.pop("Age2");
        ageError.classList.remove("beDisplayed");
    }

    if (errors.length == 0) {

        let student = {
            name: name,
            age: age,
            specialization: specialization
        }

        if (request === "create") {
            api("https://localhost:7222/api/v1/Student/create", "POST", student)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("added");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else if (request === "update") {
            api(`https://localhost:7222/api/v1/Student/update/${idStudent}`, "PUT", student)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    createHome("updated");
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    } else {

        errors.forEach(err => {

            if (err.includes("Name")) {

                nameError.classList.add("beDisplayed");
            }

            if (err.includes("Age")) {

                ageError.classList.add("beDisplayed");
            }

            if (err.includes("Specialization")) {

                specializationError.classList.add("beDisplayed");
            }

            if (err.includes("Age2")) {
                ageError.classList.add("beDisplayed")
                ageError.textContent = "Only numbers";
            }

        })

    }

}