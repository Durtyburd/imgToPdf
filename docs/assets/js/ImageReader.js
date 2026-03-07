// Get DOM elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const downloadLink = document.getElementById('download-link');

// Set up event listeners
fileInput.addEventListener('change', loadFile);
downloadLink.addEventListener('click', saveFile);

// Modified loadFile function for PNG support
function loadFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Use FileReader to read as Data URL (works with PNG, JPG, etc.)
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            // Resize canvas to match image dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image to canvas
            ctx.drawImage(img, 0, 0);

            // If you still need the raw pixel data for manipulation:
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // Now you have the RGBA data in imageData.data (Uint8ClampedArray)
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file); // Use readAsDataURL instead of readAsBinaryString
}

// Modified saveFile function - keep saving as PNG
function saveFile(event) {
    event.preventDefault();

    // Simply convert canvas to data URL and download
    canvas.toBlob(function (blob) {
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "image.png"; // Change extension to .png
    }, "image/png");
}