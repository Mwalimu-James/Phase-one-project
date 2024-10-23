document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById('submitApplicationBtn');
    const getApplicationsBtn = document.getElementById('getApplicationsBtn');
    const apiMethodsNotification = document.getElementById('apiMethodsNotification');
    const applicationsTbody = document.getElementById('applicationsTbody');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');
    const loginNotification = document.getElementById('loginNotification');

    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            document.getElementById('welcome').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        });
    }

    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            
            fetch('http://localhost:3000/users')
                .then(response => response.json())
                .then(users => {
                    const user = users.find(u => u.username === username && u.password === password);
                    if (user) {
                        loginNotification.innerText = 'Login successful!';
                        document.getElementById('login').style.display = 'none';
                        document.getElementById('dashboard').style.display = 'block';
                        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                        getApplications(); // Fetch applications after login
                    } else {
                        loginNotification.innerText = 'Invalid username or password!';
                    }
                })
                .catch(error => {
                    loginNotification.innerText = 'Error logging in. Please try again.';
                });
        });
    }

    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('welcome').style.display = 'block';
        });
    }

    
    function getApplications() {
        fetch('http://localhost:3000/jobApplications')
            .then(response => response.json())
            .then(data => {
                const applicationsHtml = data.map(application => `
                    <tr>
                        <td>${application.id || 'N/A'}</td> <!-- Display ID if necessary -->
                        <td>${application.company || 'N/A'}</td>
                        <td>${application.position || 'N/A'}</td>
                        <td>${application.dateApplied || 'N/A'}</td>
                        <td>${application.status || 'N/A'}</td>
                        <td>${application.whereApplied || 'N/A'}</td>
                        <td>${application.methodOfApplication || 'N/A'}</td>
                        <td>
                            <button class="update-btn" data-id="${application.id}">Update</button>
                            <button class="delete-btn" data-id="${application.id}">Delete</button>
                        </td>
                    </tr>
                `).join('');
                applicationsTbody.innerHTML = applicationsHtml;
    
                
                document.querySelectorAll('.update-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        updateApplication(id);
                    });
                });
    
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.getAttribute('data-id');
                        deleteApplication(id);
                    });
                });
    
                apiMethodsNotification.innerText = 'Applications retrieved successfully!';
            })
            .catch(error => {
                apiMethodsNotification.innerText = 'Error retrieving applications: ' + error.message;
            });
    }
    

    
    function postApplication() {
        const company = document.getElementById('company').value;
        const position = document.getElementById('position').value;
        const dateApplied = document.getElementById('dateApplied').value;
        const status = document.getElementById('status').value;
        const whereApplied = document.getElementById('whereApplied').value;
        const methodOfApplication = document.getElementById('methodOfApplication').value;

        fetch('http://localhost:3000/jobApplications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company,
                position,
                dateApplied,
                status,
                whereApplied,
                methodOfApplication
            })
        })
            .then(response => response.json())
            .then(data => {
                apiMethodsNotification.innerText = 'Application created successfully!';
                getApplications(); 
            })
            .catch(error => {
                apiMethodsNotification.innerText = 'Error creating application: ' + error.message;
            });
    }

    
    function updateApplication(id) {
        const company = prompt('Enter the new company:');
        const position = prompt('Enter the new position:');
        const dateApplied = prompt('Enter the new date applied (yyyy-mm-dd):');
        const status = prompt('Enter the new status:');
        const whereApplied = prompt('Enter the new place where you applied:');
        const methodOfApplication = prompt('Enter the new method of application:');

        fetch(`http://localhost:3000/jobApplications/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company,
                position,
                dateApplied,
                status,
                whereApplied,
                methodOfApplication
            })
        })
            .then(response => response.json())
            .then(data => {
                apiMethodsNotification.innerText = 'Application updated successfully!';
                getApplications(); 
            })
            .catch(error => {
                apiMethodsNotification.innerText = 'Error updating application: ' + error.message;
            });
    }

    
    function deleteApplication(id) {
        fetch(`http://localhost:3000/jobApplications/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    apiMethodsNotification.innerText = 'Application deleted successfully!';
                    getApplications(); 
                } else {
                    throw new Error('Failed to delete application');
                }
            })
            .catch(error => {
                apiMethodsNotification.innerText = 'Error deleting application: ' + error.message;
            });
    }

    
    if (submitButton) {
        submitButton.addEventListener('click', postApplication);
    }

    if (getApplicationsBtn) {
        getApplicationsBtn.addEventListener('click', getApplications);
    }

    
    window.addEventListener('load', () => {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            document.getElementById('welcome').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            getApplications(); // Now this will work as well
        }
    });
});
