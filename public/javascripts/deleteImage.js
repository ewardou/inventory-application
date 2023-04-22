const fs = require('fs');

async function deleteImageFromFS(imageName) {
    if (imageName !== 'placeholder.png') {
        return fs.unlink(`./public/images/${imageName}`, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

module.exports = deleteImageFromFS;
