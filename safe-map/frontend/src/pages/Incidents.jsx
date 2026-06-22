import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Filter, AlertTriangle, Plus, Calendar, Clock, Info } from 'lucide-react';
import { indiaData, cityCoordinates } from '../utils/indiaData';
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

const Incidents = () => {
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [incidents, setIncidents] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
    const [mapZoom, setMapZoom] = useState(5);
    const [loading, setLoading] = useState(false);
    const [isNearby, setIsNearby] = useState(false);

    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/incidents', { params: { state, city } });
            setIncidents(res.data);
            setIsNearby(false);
        } catch (err) {
            console.error('Error fetching incidents', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyIncidents = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await axios.get('/api/incidents', { 
                    params: { lat: latitude, lon: longitude, radius: 10000 } 
                });
                setIncidents(res.data);
                setMapCenter([latitude, longitude]);
                setMapZoom(13);
                setIsNearby(true);
                setState(''); 
                setCity('');  
            } catch (err) {
                console.error('Error fetching nearby incidents', err);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error('Geolocation error', error);
            alert('Unable to retrieve your location. Please check permissions.');
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!isNearby) {
            fetchIncidents();
        }
    }, [state, city]);

    const handleStateChange = (e) => {
        setState(e.target.value);
        setCity(''); // Reset city when state changes
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setCity(selectedCity);
        if (selectedCity && cityCoordinates[selectedCity]) {
            setMapCenter(cityCoordinates[selectedCity]);
            setMapZoom(12);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 p-6 rounded-3xl glass">
                <div>
                    <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
                        <AlertTriangle className="text-red-500" /> Recent Incidents
                    </h1>
                    <p className="text-text-dim font-medium mt-1">Real-time reports from across the country</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={fetchNearbyIncidents}
                        disabled={loading}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold transition-all ${isNearby ? 'bg-primary text-white shadow-lg' : 'bg-white/50 text-text-main border border-black/5 hover:bg-white'}`}
                    >
                        <MapPin size={20} className={loading && isNearby ? 'animate-bounce' : ''} />
                        {loading && isNearby ? 'Finding...' : isNearby ? 'Nearby Active' : 'Find Nearby'}
                    </button>
                    <Link to="/post-incident" className="flex-1 md:flex-none btn-primary flex items-center justify-center gap-2 py-3 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                        <Plus size={20} /> Report
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`glass p-4 flex items-center gap-4 transition-opacity ${isNearby ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Filter className="text-primary shrink-0" size={20} />
                    <select 
                        className="bg-transparent border-none focus:ring-0 text-text-main font-bold w-full cursor-pointer"
                        value={state}
                        onChange={handleStateChange}
                    >
                        <option value="">Select State</option>
                        {Object.keys(indiaData).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className={`glass p-4 flex items-center gap-4 transition-opacity ${isNearby ? 'opacity-50 pointer-events-none' : ''}`}>
                    <MapPin className="text-primary shrink-0" size={20} />
                    <select 
                        className="bg-transparent border-none focus:ring-0 text-text-main font-bold w-full cursor-pointer"
                        value={city}
                        onChange={handleCityChange}
                        disabled={!state}
                    >
                        <option value="">Select City</option>
                        {state && indiaData[state].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Map */}
            <div className="h-[400px] md:h-[600px] rounded-3xl overflow-hidden glass border-4 border-white/50 relative shadow-2xl">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', minHeight: '400px' }}>
                    <ChangeView center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {incidents.map(incident => (
                        <Marker 
                            key={incident._id} 
                            position={[incident.location.coordinates[1], incident.location.coordinates[0]]}
                            icon={redIcon}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 space-y-2 min-w-[200px]">
                                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                        <AlertTriangle size={14} className="text-red-500" />
                                        <span className="font-black text-black uppercase tracking-wider text-xs">{incident.type}</span>
                                    </div>
                                    <p className="text-xs text-text-main leading-relaxed italic">"{incident.description}"</p>
                                    <div className="flex items-center justify-between pt-1 gap-4">
                                        <div className="flex items-center gap-1 text-[10px] text-text-dim">
                                            <Calendar size={10} /> {new Date(incident.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-text-dim">
                                            <Clock size={10} /> {incident.time}
                                        </div>
                                    </div>
                                    <div className="pt-1 text-[10px] font-bold text-primary flex items-center gap-1">
                                        <MapPin size={10} /> {incident.city}, {incident.state}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Statistics Summary */}
            <div className="glass p-6">
                <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-4">
                    <Info size={18} className="text-primary" /> Incident Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white/50 border border-white/20">
                        <span className="text-xs font-bold text-text-dim uppercase tracking-widest block mb-1">Total Active</span>
                        <span className="text-2xl font-black text-black">{incidents.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100/20">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-1">Critical</span>
                        <span className="text-2xl font-black text-red-600">
                            {incidents.filter(i => ["Murder / serious violence", "Assault", "Kidnapping"].includes(i.type)).length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incidents;
