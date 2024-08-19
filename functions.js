export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
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

    api("https://localhost:7222/api/v1/Student/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        attachStudents(data.studentList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddStudentPage();
    });

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
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createStudent();
    })

}

function createRow(student) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${student.id}</td>
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

function createStudent() {

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

        api("https://localhost:7222/api/v1/Student/create", "POST", student)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
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