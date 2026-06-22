import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Send, ChevronLeft, Calendar, Clock, FileText } from 'lucide-react';
import { indiaData, cityCoordinates, incidentTypes } from '../utils/indiaData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Icon for Incidents
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map view updates
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

// Component to handle map clicks
function LocationSelector({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });
    return null;
}

const PostIncident = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        state: '',
        city: '',
        location: null // { lat, lon }
    });
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
    const [mapZoom, setMapZoom] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'state') {
            setFormData(prev => ({ ...prev, city: '' }));
        }

        if (name === 'city' && value && cityCoordinates[value]) {
            setMapCenter(cityCoordinates[value]);
            setMapZoom(13);
        }
    };

    const handleLocationSelect = (latlng) => {
        setFormData(prev => ({ ...prev, location: { lat: latlng.lat, lon: latlng.lng } }));
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({ ...prev, location: { lat: latitude, lon: longitude } }));
            setMapCenter([latitude, longitude]);
            setMapZoom(16);

            // Attempt reverse geocoding
            try {
                // Nominatim API for reverse geocoding
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const address = response.data.address;
                
                // Try to find the state in our indiaData
                const detectedState = address.state || address.province;
                // Try to find city in our indiaData for that state
                const detectedCity = address.city || address.town || address.village || address.suburb;

                if (detectedState && indiaData[detectedState]) {
                    setFormData(prev => ({ ...prev, state: detectedState }));
                    if (detectedCity && indiaData[detectedState].includes(detectedCity)) {
                        setFormData(prev => ({ ...prev, city: detectedCity }));
                    }
                }
            } catch (err) {
                console.error('Reverse geocoding failed', err);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error('Geolocation error', error);
            alert('Unable to retrieve your location. Please check browser permissions.');
            setLoading(false);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.location) {
            alert('Please select the incident location on the map.');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/api/incidents', formData);
            navigate('/incidents');
        } catch (err) {
            console.error('Error reporting incident', err);
            alert('Failed to report incident. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl border border-glass hover:bg-white/10 transition-all">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
                        <AlertTriangle className="text-red-500" /> Report an Incident
                    </h1>
                    <p className="text-text-dim font-medium mt-1">Provide accurate details to help keep others safe</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 glass p-6 md:p-8">
                    {/* Location Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider">State</label>
                            <select 
                                name="state"
                                className="input-field cursor-pointer"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select State</option>
                                {Object.keys(indiaData).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider">City</label>
                            <select 
                                name="city"
                                className="input-field cursor-pointer"
                                value={formData.city}
                                onChange={handleInputChange}
                                disabled={!formData.state}
                                required
                            >
                                <option value="">Select City</option>
                                {formData.state && indiaData[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider">Incident Type</label>
                        <select 
                            name="type"
                            className="input-field cursor-pointer"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Type</option>
                            {incidentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={14} /> Date
                            </label>
                            <input 
                                type="date"
                                name="date"
                                className="input-field"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider flex items-center gap-2">
                                <Clock size={14} /> Time
                            </label>
                            <input 
                                type="time"
                                name="time"
                                className="input-field"
                                value={formData.time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider flex items-center gap-2">
                            <FileText size={14} /> Description
                        </label>
                        <textarea 
                            name="description"
                            rows="4"
                            className="input-field resize-none py-4"
                            placeholder="Briefly describe what happened..."
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-4 text-lg font-black flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? 'Submitting...' : 'Submit Incident Report'} <Send size={22} />
                    </button>
                    {!formData.location && <p className="text-[10px] text-red-500 text-center font-bold uppercase tracking-widest mt-2">Please click on the map to mark location</p>}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-black uppercase tracking-[0.2em]">Select Exact Location</h3>
                        <div className="flex items-center gap-2">
                            <button 
                                type="button"
                                onClick={handleUseMyLocation}
                                disabled={loading}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-primary px-3 py-1.5 rounded-full uppercase shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                <MapPin size={12} /> {loading ? 'Locating...' : 'Use My Location'}
                            </button>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase">
                                <MapPin size={12} /> Click on map
                            </div>
                        </div>
                    </div>
                    <div className="h-[350px] md:h-[500px] lg:h-full min-h-[350px] rounded-3xl overflow-hidden glass border-4 border-white/50 relative shadow-2xl">
                        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', minHeight: '350px' }}>
                            <ChangeView center={mapCenter} zoom={mapZoom} />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <LocationSelector onLocationSelect={handleLocationSelect} />
                            {formData.location && (
                                <Marker position={[formData.location.lat, formData.location.lon]} icon={redIcon} />
                            )}
                        </MapContainer>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostIncident;
