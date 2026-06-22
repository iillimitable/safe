const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Report = require('./src/models/Report');
const Incident = require('./src/models/Incident');

dotenv.config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const reports = await Report.find();
        const incidents = await Incident.find();

        console.log('--- All Report UserIds ---');
        reports.forEach(r => console.log(`Report Area: ${r.areaName}, UserId: ${r.userId.toString()}`));
        
        console.log('--- All Incident UserIds ---');
        incidents.forEach(i => console.log(`Incident Type: ${i.type}, UserId: ${i.userId.toString()}`));

        const reportUserIds = new Set(reports.map(r => r.userId.toString()));
        const incidentUserIds = new Set(incidents.map(i => i.userId.toString()));

        const commonIds = [...reportUserIds].filter(id => incidentUserIds.has(id));
        console.log(`Common UserIds: ${commonIds.join(', ')}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
