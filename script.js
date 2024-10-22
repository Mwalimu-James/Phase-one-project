console.log("Kenya");
const baseurl = "http://localhost:3000";

function collectData() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();  // Prevent default form submission
            
            const formData = {
                "Company": e.target.CompanyPosition.value, 
                "Application": e.target.DateofApplication.value,
                "Position": e.target.JobPosition.value,
            };

            form.reset();  // Reset form fields
            console.log(formData);  // Log form data
            postData(formData);  // Send form data to the server
        });
    } else {
        console.error('Form not found!');
    }
}

collectData();

function postData(formData) {
    fetch(`${baseurl}/Job%20Application`, {  // URL encoded space
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)  // Correct JSON.stringify usage
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));  // Error handling
}
function fetchJob_Application() {
    fetch(`${baseurl}/Job%20Application`)
    .then(response => response.json())
    .then(data => data.forEach((item) => {
        displayJob_Application(item)

    }))
    .catch(error => console.error('Error occured'))
}
fetchJob_Application()

function displayJob_Application(item) {
    const tableBody = document.querySelector('#body')
    const row = document.createElement('tr')
    row.innerHTML = `
    
        <th scope="row">${item.id}</th>
            <td>${item.Company}</td>
            <td>${item.Application}</td>

            <td>${item.Position}</td>
            <td>
                <button type="button" class="btn btn-warning">Update</button>
                <button type="button" class="btn btn-danger" id="delete">Delete</button>
        </td>
          `
    tableBody.appendChild(row)
    const deleteButton = row.querySelector("#delete")
    //console.log(deleteButton)
    deleteButton.addEventListener('click', () => {
        alert("Uko na uhakika?")
        fetch(`${baseurl}/Job%20Application/${item.id} `, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    })
}

