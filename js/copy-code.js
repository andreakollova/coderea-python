// Copy Code Button Functionality
document.addEventListener('DOMContentLoaded', () => {
    const copyCodeButton = document.querySelector('.copy-code-btn');

    if (copyCodeButton) {
        copyCodeButton.addEventListener('click', () => {
            const textarea = document.querySelector('textarea'); // Adjust selector if needed
            if (textarea) {
                const code = textarea.value;
                navigator.clipboard.writeText(code)
                    .then(() => {
                        alert('Code copied to clipboard!');
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
            } else {
                console.error('Textarea not found.');
            }
        });
    }
});
