function sendRequest() {
    // Get token from local storage
    const token = localStorage.getItem('token');

    // Set up request options
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    };

    // Send request to http://localhost/event/
    fetch('http://localhost/event/', requestOptions)
        .then(response => response.json())
        .then(events => {
            // Create a card for each event
            const eventCards = document.getElementById('event-cards');
            eventCards.innerHTML = ''; // clear existing cards
            events.forEach(event => {
                const card = document.createElement('div');
                card.classList.add('card');

                const title = document.createElement('h2');
                title.innerText = event.name;
                card.appendChild(title);

                const description = document.createElement('p');
                description.innerText = event.description || 'No description provided.';
                card.appendChild(description);

                const created = document.createElement('p');
                created.innerText = `Created at ${event.created_at}`;
                card.appendChild(created);

                // Show existing options
                if (event.options.length > 0) {
                    const optionsTitle = document.createElement('h3');
                    optionsTitle.innerText = 'Options:';
                    card.appendChild(optionsTitle);

                    const optionsList = document.createElement('ul');
                    event.options.forEach(option => {
                        const optionItem = document.createElement('li');

                        if(option.total_votes === undefined ){
                            votes = 0
                        }
                        else{
                            votes = option.total_votes
                        }
                        optionItem.innerText = `${option.date_time} - Total votes: ${votes}`;

                        const voteButton = document.createElement('button');
                        voteButton.innerText = 'Vote';
                        voteButton.onclick = () => voteOption(event.id, option.id);

                        optionItem.appendChild(voteButton);
                        optionsList.appendChild(optionItem);
                    });
                    card.appendChild(optionsList);
                }

                // Add button to add option
                if (event.available) {
                    const addOptionButton = document.createElement('button');
                    addOptionButton.innerText = 'Add Option';
                    addOptionButton.onclick = () => openAddOptionModal(event.id);
                    card.appendChild(addOptionButton);
                }

                // Add button to close event
                if (event.available && event.created_in_the_last_2_hours) {
                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'Close Event';
                    closeButton.onclick = () => closeEvent(event.id);
                    card.appendChild(closeButton);
                }

                eventCards.appendChild(card);
            });
        })
        .catch(error => {
            console.error(error);
            alert(`Request failed: ${error}`);
        });
}

function openAddOptionModal(eventId) {
    document.getElementById('add-option-form').reset();
    document.getElementById('event-id').value = eventId;
    addOptionModal.style.display = 'block';
}

function closeAddOptionModal() {
    addOptionModal.style.display = 'none';
}

function addOption(event) {
    event.preventDefault();
    const eventId = document.getElementById('event-id').value;
    const date_time = document.getElementById('option-date-time').value;

    // Set up request options
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date_time: date_time
        })
    };

    // Send request to http://localhost/event/<eventId>/add_option/
    fetch(`http://localhost/event/${eventId}/add_option/`, requestOptions)
        .then(response => response.json())
        .then(event => {
            closeAddOptionModal();
            sendRequest();
        })
        .catch(error => {
            console.error(error);
            alert(`Request failed: ${error}`);
        });
}

function voteOption(eventId, optionId) {
    // Set up request options
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            option_id: optionId
        })
    };

    // Send request to http://localhost/event/<eventId>/vote/
    fetch(`http://localhost/event/${eventId}/vote/`, requestOptions)
        .then(response => response.json())
        .then(event => {
            sendRequest();
        })
        .catch(error => {
            console.error(error);
            alert(`Request failed: ${error}`);
        });
}

function closeEvent(eventId) {
    if (!confirm('Are you sure you want to close this event?')) {
        return;
    }

    // Set up request options
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    };

    // Send request to http://localhost/event/<eventId>/close/
    fetch(`http://localhost/event/${eventId}/close/`, requestOptions)
        .then(response => response.json())
        .then(event => {
            sendRequest();
        })
        .catch(error => {
            console.error(error);
            alert(`Request failed: ${error}`);
        });
}

// When the user clicks on <span> (x), close the modal
const addOptionModal = document.getElementById('add-option-modal');
const closeButtons = document.getElementsByClassName('close');
for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = () => closeAddOptionModal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == addOptionModal) {
        closeAddOptionModal();
    }
}

// Submit the add-option form when the user clicks "Add Option"
document.getElementById('add-option-form').onsubmit = (event) => addOption(event);

// Send request when page is loaded
window.onload = sendRequest;