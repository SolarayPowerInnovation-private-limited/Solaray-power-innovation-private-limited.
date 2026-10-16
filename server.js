const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database for Applications (Can be wired to MongoDB / PostgreSQL)
const applications = [];

// API Route 1: Solar Capacity & Subsidy Calculator
app.post('/api/calculate', (req, res) => {
    const { monthlyBill, roofArea } = req.body;

    if (!monthlyBill || !roofArea) {
        return res.status(400).json({ error: 'Please provide monthly bill and roof area' });
    }

    // Recommendation logic according to PM Surya Ghar guidelines
    // Approx 1kW requires 80-100 sq ft and produces ~120 units/month (savings ~₹800-₹1200)
    let recommendedKw = Math.ceil(monthlyBill / 1200);
    const maxKwByArea = Math.floor(roofArea / 80);
    recommendedKw = Math.max(1, Math.min(recommendedKw, maxKwByArea, 10)); // Cap between 1kW and 10kW

    // PM Surya Ghar Central Government Subsidy Framework
    let subsidyAmount = 0;
    if (recommendedKw === 1) {
        subsidyAmount = 30000;
    } else if (recommendedKw === 2) {
        subsidyAmount = 60000;
    } else if (recommendedKw >= 3) {
        subsidyAmount = 78000; // Cap for residential 3kW+
    }

    const estimatedMonthlySavings = Math.round(recommendedKw * 1150);
    
    // Total System Cost approx ₹65,000 per kW before subsidy
    const grossCost = recommendedKw * 62000;
    const netCost = grossCost - subsidyAmount;
    
    // SBI Loan EMI @ 5.75% for 5 years
    const monthlyRate = 0.0575 / 12;
    const months = 60;
    const estimatedEmi = Math.round((netCost * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));

    return res.json({
        capacityKw: recommendedKw,
        subsidyAmount: subsidyAmount,
        monthlySavings: estimatedMonthlySavings,
        estimatedCost: netCost,
        estimatedEmi: estimatedEmi
    });
});

// API Route 2: Submit Solar Lead / Application
app.post('/api/apply', (req, res) => {
    const { fullName, phone, email, district, sanctionedLoad, message } = req.body;

    if (!fullName || !phone || !district) {
        return res.status(400).json({ error: 'Full Name, Phone, and District are required.' });
    }

    const newApplication = {
        applicationId: 'SOL-' + Date.now().toString().slice(-6),
        fullName,
        phone,
        email,
        district,
        sanctionedLoad: sanctionedLoad || 'N/A',
        message: message || '',
        status: 'PENDING_SURVEY',
        createdAt: new Date().toISOString()
    };

    applications.push(newApplication);

    // Save to local JSON backup
    fs.writeFileSync(path.join(__dirname, 'applications_backup.json'), JSON.stringify(applications, null, 2));

    console.log(`[NEW APPLICATION] ${newApplication.applicationId} - ${fullName} (${phone})`);

    return res.status(201).json({
        message: 'Application received successfully',
        applicationId: newApplication.applicationId
    });
});

// API Route 3: Admin List Applications
app.get('/api/admin/applications', (req, res) => {
    res.json({ total: applications.length, applications });
});

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` SOLARAY POWER INNOVATIONS SERVER RUNNING `);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`==================================================`);
});
