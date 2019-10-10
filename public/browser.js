console.log('browser.js started');

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