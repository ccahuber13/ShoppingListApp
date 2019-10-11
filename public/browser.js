console.log('browser.js started');

function itemTemplate() {
    return `
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
        <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
        <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
        </li>
    `;
};

// Create feature
let createField = document.getElementById('create-field');
document.getElementById('create-form').addEventListener('submit', (e) => {
    e.preventDefault();

    axios.post('/create-item', {text: createField.value}).then( () => {
        // Create HTML for new item
        // insertAdjacentHTML('location', 'HTML');
        // TIP: To keep organized, create a function that builds HTML and run instead of placing HTML directly in insert.
        document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate());
    }).catch( () => {
        console.log('error');
    });

});;

document.addEventListener('click', (e) => {
    // Delete Feature
    if (e.target.classList.contains('delete-me')) {
        if (confirm('Do you really want to delete this item?')) {
            axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then( () => {
                // Then do this once request is complete
                e.target.parentElement.parentElement.remove();
            }).catch( () => {
                console.log('error');
            });
        };
    };
    // Update Feature
    if (e.target.classList.contains('edit-me')) {
        let userInput = prompt('Enter new text', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
        // Make a post request behind the scenes. axios.post('post path', object of data to add)
        // Make sure userInput is true, otherwise if you cancel action, the request still goes through and causes visual error.
        if (userInput) {
            axios.post('/update-item', {text: userInput, id: e.target.getAttribute('data-id')}).then( () => {
                // Then do this once request is complete
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
            }).catch( () => {
                console.log('error');
            });
        };
    }
});