
document.addEventListener('DOMContentLoaded', () => {

    // 1. Solar Calculator Logic
    const calcForm = document.getElementById('solarCalcForm');
    const calcResults = document.getElementById('calcResults');

    calcForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const monthlyBill = parseFloat(document.getElementById('monthlyBill').value);
        const roofArea = parseFloat(document.getElementById('roofArea').value);

        try {
            // Call Backend API
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthlyBill, roofArea })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('resCapacity').innerText = data.capacityKw + ' kW';
                document.getElementById('resSubsidy').innerText = '₹ ' + data.subsidyAmount.toLocaleString('en-IN');
                document.getElementById('resSavings').innerText = '₹ ' + data.monthlySavings.toLocaleString('en-IN');
                document.getElementById('resEmi').innerText = '₹ ' + data.estimatedEmi.toLocaleString('en-IN');
                calcResults.classList.remove('hidden');
            }
        } catch (err) {
            console.error('Calculator API error:', err);
            // Client-side fallback calculation
            const kw = Math.min(Math.ceil(monthlyBill / 1000), Math.floor(roofArea / 80));
            const cap = Math.max(1, kw);
            let sub = cap === 1 ? 30000 : (cap === 2 ? 60000 : 78000);
            
            document.getElementById('resCapacity').innerText = cap + ' kW';
            document.getElementById('resSubsidy').innerText = '₹ ' + sub.toLocaleString('en-IN');
            document.getElementById('resSavings').innerText = '₹ ' + (cap * 1100).toLocaleString('en-IN');
            document.getElementById('resEmi').innerText = '₹ ' + (cap * 650).toLocaleString('en-IN');
            calcResults.classList.remove('hidden');
        }
    });

    // 2. Application Form Backend Submission
    const inquiryForm = document.getElementById('solarInquiryForm');
    const formStatus = document.getElementById('formStatus');

    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formStatus.className = 'form-status';
        formStatus.innerText = 'Submitting application...';
        formStatus.style.display = 'block';

        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            district: document.getElementById('district').value,
            sanctionedLoad: document.getElementById('sanctionedLoad').value,
            message: document.getElementById('message').value
        };

        try {
            const res = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (res.ok) {
                formStatus.className = 'form-status success';
                formStatus.innerText = 'Thank you! Application ' + result.applicationId + ' received. Our solar engineer will contact you shortly.';
                inquiryForm.reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (err) {
            formStatus.className = 'form-status error';
            formStatus.innerText = 'Failed to submit. Please contact us directly at (M) 9436452537.';
        }
    });
});
