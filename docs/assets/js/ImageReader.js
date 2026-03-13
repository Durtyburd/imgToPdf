const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("file-input");
const downloadLink = document.getElementById("download-link");

fileInput.addEventListener("change", loadFile);
downloadLink.addEventListener("click", saveFile);

function loadFile(event) {
  const file = event.target.files[0];
  if (!file) {
    console.log("No file selected");
    return;
  }

  console.log(
    "File selected:",
    file.name,
    "Type:",
    file.type,
    "Size:",
    file.size,
  );

  const reader = new FileReader();

  reader.onload = function (e) {
    console.log("FileReader loaded, creating image...");
    const img = new Image();

    img.onload = function () {
      console.log(
        "Image loaded successfully. Dimensions:",
        img.width,
        "x",
        img.height,
      );

      // Resize canvas to match image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);

      console.log("Image drawn to canvas");

      // Optional: Verify by logging first few pixels
      try {
        const imageData = ctx.getImageData(0, 0, 1, 1);
        console.log("First pixel RGBA:", imageData.data);
      } catch (e) {
        console.log("Could not read pixel data (may be CORS issue)");
      }
    };

    img.onerror = function (error) {
      console.error("Error loading image:", error);
    };

    // Set the source AFTER defining onload handler
    img.src = e.target.result;
    console.log("Image src set");
  };

  reader.onerror = function (error) {
    console.error("FileReader error:", error);
  };

  // Use readAsDataURL for PNG files
  reader.readAsDataURL(file);
  console.log("FileReader reading as DataURL");
}

function saveFile(event) {
  event.preventDefault();

  console.log("Saving canvas as PNG...");
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);

  canvas.toBlob(function (blob) {
    if (!blob) {
      console.error("Failed to create blob");
      return;
    }

    console.log("Blob created, size:", blob.size);

    // Revoke old URL to avoid memory leaks
    if (downloadLink.href && downloadLink.href.startsWith("blob:")) {
      URL.revokeObjectURL(downloadLink.href);
    }

    const url = URL.createObjectURL(blob);

    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.download = "image.png";
    tempLink.click();
  }, "image/png");
}
