$(document).ready(function () {
    let inputCount = 0;

    // Hàm thêm input
    function addInput() {
        inputCount++;
        const inputHtml = `<div class="input-group mb-2" id="inputGroup${inputCount}">
                            <input type="text" class="form-control" placeholder="Nhập dữ liệu">
                            <button class="btn btn-danger removeInput">Xóa</button>
                           </div>`;
        $('#inputsContainer').append(inputHtml);
    }

    // Hàm xóa input
    function removeInput() {
        $(this).closest('.input-group').remove();
    }

    // Hàm vẽ spinner
    function drawSpinner(values) {
        const canvas = document.getElementById('spinnerCanvas');
        const ctx = canvas.getContext('2d');
        const total = values.length;
        const anglePerSegment = 2 * Math.PI / total;
        let startAngle = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        values.forEach((value, index) => {
            const endAngle = startAngle + anglePerSegment;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = `hsl(${index * 360 / total}, 100%, 50%)`;
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(startAngle + anglePerSegment / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#000";
            ctx.font = "20px Arial";
            ctx.fillText(value, canvas.width / 2 - 10, 10);
            ctx.restore();

            startAngle = endAngle;
        });
    }

    // Hàm quay spinner
    function spin() {
        const values = $('#inputsContainer input').map((_, input) => $(input).val()).get();
        if (values.length < 2) {
            alert("Please add at least 2 values.");
            return;
        }

        drawSpinner(values);
        const canvas = document.getElementById('spinnerCanvas');
        const ctx = canvas.getContext('2d');
        const total = values.length;
        const anglePerSegment = 2 * Math.PI / total;
        
        // Loại bỏ ô cuối cùng
        const validIndices = Array.from({ length: total - 1 }, (_, i) => i);
        const targetIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
        
        const targetAngle = targetIndex * anglePerSegment;
        const spins = 5; // Number of spins before stopping
        const totalRotation = 2 * Math.PI * spins + targetAngle;

        let currentRotation = 0;
        const duration = 3000; // Duration of the spin in milliseconds
        const startTime = performance.now();

        function animate(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            currentRotation = totalRotation * progress;

            ctx.resetTransform();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentRotation);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawSpinner(values);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                $('#result').html(`<h2>Kết quả: ${values[targetIndex]}</h2>`);
            }
        }

        requestAnimationFrame(animate);
    }

    // Gắn sự kiện cho các nút
    $('#addInput').click(addInput);
    $('#inputsContainer').on('click', '.removeInput', removeInput);
    $('#spin').click(spin);

    // Thêm các input ban đầu
    addInput();
    addInput();
});