const URL = "https://teachablemachine.withgoogle.com/models/I_dkC5SeO/";

let model, maxPredictions;
let isModelLoaded = false;

// Elements
const uploadArea = document.getElementById("upload-area");
const imageUpload = document.getElementById("image-upload");
const uploadPlaceholder = document.getElementById("upload-placeholder");
const imagePreview = document.getElementById("image-preview");
const previewImg = document.getElementById("preview-img");
const loadingArea = document.getElementById("loading-area");
const resultArea = document.getElementById("result-area");
const labelContainer = document.getElementById("label-container");

// Initialize
init();

async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Load the model
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        isModelLoaded = true;
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading model:", error);
        alert("모델을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침 해보세요.");
    }
}

// Upload Handling
uploadArea.addEventListener("click", (e) => {
    // Should not trigger if clicking remove button
    if(e.target.closest('.remove-btn')) return;
    imageUpload.click();
});

uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = "#eef2ff";
    uploadArea.style.borderColor = "#6366f1";
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.backgroundColor = "";
    uploadArea.style.borderColor = "";
});

uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = "";
    uploadArea.style.borderColor = "";
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }
});

imageUpload.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드할 수 있습니다.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        uploadPlaceholder.hidden = true;
        imagePreview.hidden = false;
        resultArea.hidden = true;
        
        // Predict immediately after loading
        predict();
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    imageUpload.value = "";
    previewImg.src = "#";
    imagePreview.hidden = true;
    uploadPlaceholder.hidden = false;
    resultArea.hidden = true;
    labelContainer.innerHTML = "";
}

async function predict() {
    if (!isModelLoaded) {
        loadingArea.hidden = false;
        // Wait for model... simpler logic: just alert or retry
        await init(); 
        if(!isModelLoaded) return;
    }

    loadingArea.hidden = false;
    
    // Simulate a short delay for UX (so user sees "Analyzing...")
    // Also gives time for the image to render completely
    setTimeout(async () => {
        try {
            const prediction = await model.predict(previewImg);
            displayResult(prediction);
        } catch (error) {
            console.error(error);
            alert("분석 중 오류가 발생했습니다.");
        } finally {
            loadingArea.hidden = true;
        }
    }, 500);
}

function displayResult(prediction) {
    // Sort predictions by probability
    prediction.sort((a, b) => b.probability - a.probability);

    labelContainer.innerHTML = "";
    
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        const percentage = Math.round(probability * 100) + "%";
        
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        
        resultItem.innerHTML = `
            <div class="label-container">
                <span class="label-name">${titleCase(classPrediction)}</span>
                <span class="label-prob">${percentage}</span>
            </div>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${percentage}; opacity: ${0.3 + (probability * 0.7)}"></div>
            </div>
        `;
        
        labelContainer.appendChild(resultItem);
    }
    
    resultArea.hidden = false;
}

function titleCase(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
