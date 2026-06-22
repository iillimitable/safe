import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, Info, Lightbulb, Users, Clock, AlertTriangle, Send, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
// Map and Autocomplete functionality removed as per user request

const ReportForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        location: null,
        preciseLocation: null, // { lat, lon }
        areaName: '', // Kept for backward compatibility display
        pincode: '',  // Kept for backward compatibility display
        responses: {},
        comments: ''
    });
    const [loading, setLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [citySelected, setCitySelected] = useState(false);

    const totalSteps = 6;
    const progress = (step / totalSteps) * 100;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionSelect = (qId, value) => {
        if (qId === 'q14') {
            const currentSelected = formData.responses[qId] || [];
            // Ensure it's an array for multi-select
            const selectedArray = Array.isArray(currentSelected) ? currentSelected : (currentSelected ? [currentSelected] : []);
            
            let newSelected;
            if (value === 'No major issues') {
                // If "No issues" is selected, clear everything else
                newSelected = ['No major issues'];
            } else {
                // Remove "No issues" if selecting a specific incident
                const filtered = selectedArray.filter(v => v !== 'No major issues');
                if (filtered.includes(value)) {
                    newSelected = filtered.filter(v => v !== value);
                } else {
                    newSelected = [...filtered, value];
                }
                // If empty after deselecting, you might want to force "No issues" or just keep empty
                if (newSelected.length === 0) newSelected = []; 
            }
            
            setFormData({
                ...formData,
                responses: { ...formData.responses, [qId]: newSelected }
            });
        } else {
            setFormData({
                ...formData,
                responses: { ...formData.responses, [qId]: value }
            });
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.areaName.trim() !== '' && formData.pincode.trim() !== '';
            case 2:
                return formData.responses.q1 && formData.responses.q2 && formData.responses.q3;
            case 3:
                return formData.responses.q4 && formData.responses.q5 && formData.responses.q6 && formData.responses.q7;
            case 4:
                return formData.responses.q8 && formData.responses.q9;
            case 5:
                return formData.responses.q10 && formData.responses.q11 && formData.responses.q12 && formData.responses.q13;
            case 6:
                const q14Response = formData.responses.q14;
                const hasQ14 = Array.isArray(q14Response) ? q14Response.length > 0 : !!q14Response;
                return hasQ14 && formData.comments.trim() !== '';
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Send manual areaName and pincode
            const submissionData = {
                ...formData,
                location: null // No precise location from map/API
            };
            await axios.post('/api/reports', submissionData);
            navigate('/profile');
        } catch (err) {
            console.error('Error submitting report', err);
            alert('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderOption = (qId, value, label) => {
        const isSelected = qId === 'q14' 
            ? (Array.isArray(formData.responses[qId]) && formData.responses[qId].includes(value))
            : formData.responses[qId] === value;

        return (
            <button
                type="button"
                className={`px-4 py-3 rounded-lg border transition-all text-sm font-medium ${isSelected
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-background-glass border-glass text-text-dim hover:border-primary/50 hover:text-text-main'
                    }`}
                onClick={() => handleOptionSelect(qId, value)}
            >
                {label}
            </button>
        );
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="p-4 md:p-8 glass animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-black">
                            <MapPin className="text-primary" /> Location Information
                        </h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-main ml-1">1. Area Name</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                                    <input 
                                        type="text"
                                        name="areaName"
                                        className="input-field pl-12"
                                        placeholder="e.g. Bandra, Mumbai or Connaught Place, Delhi"
                                        value={formData.areaName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-main ml-1">2. Pincode</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                                    <input 
                                        type="text"
                                        name="pincode"
                                        className="input-field pl-12"
                                        placeholder="Enter 6-digit pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-4 md:p-8 glass animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-black">
                            <Shield className="text-primary" /> Overall Safety
                        </h2>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">1. How would you rate the overall safety of this area?</span>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
                                    {[1, 2, 3, 4, 5].map(v => renderOption('q1', v.toString(), v === 1 ? 'Unsafe' : v === 5 ? 'Safe' : v.toString()))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">2. Do you feel safe walking alone here?</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {renderOption('q2', '4', 'Yes (Day & Night)')}
                                    {renderOption('q2', '3', 'Only Day')}
                                    {renderOption('q2', '2', 'Not at Night')}
                                    {renderOption('q2', '1', 'Not at All')}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">3. Have you ever experienced or witnessed crime here?</span>
                                <div className="flex gap-4">
                                    <div className="flex-1">{renderOption('q3', 'Yes', 'Yes')}</div>
                                    <div className="flex-1">{renderOption('q3', 'No', 'No')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4 md:p-8 glass animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-black">
                            <Lightbulb className="text-primary" /> Infrastructure
                        </h2>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">4. How is the street lighting at night?</span>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {[5, 4, 3, 2, 1].map(v => renderOption('q4', v.toString(), v === 5 ? 'Very Good' : v === 1 ? 'Very Poor' : v.toString()))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">5. Is the area crowded during most hours?</span>
                                <div className="grid grid-cols-2 gap-3">
                                    {renderOption('q5', '4', 'Always Crowded')}
                                    {renderOption('q5', '3', 'Sometimes')}
                                    {renderOption('q5', '2', 'Rarely')}
                                    {renderOption('q5', '1', 'Almost Empty')}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">6. Are CCTV cameras visible in the area?</span>
                                <div className="grid grid-cols-3 gap-3">
                                    {renderOption('q6', '3', 'Many')}
                                    {renderOption('q6', '2', 'Few')}
                                    {renderOption('q6', '1', 'None')}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">7. How clean and maintained is the area?</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {renderOption('q7', '4', 'Very Clean')}
                                    {renderOption('q7', '3', 'Clean')}
                                    {renderOption('q7', '2', 'Average')}
                                    {renderOption('q7', '1', 'Dirty')}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="p-4 md:p-8 glass animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-black">
                            <Users className="text-primary" /> Law & Order
                        </h2>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">8. How often do you see police patrol here?</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {renderOption('q8', '4', 'Frequently')}
                                    {renderOption('q8', '3', 'Sometimes')}
                                    {renderOption('q8', '2', 'Rarely')}
                                    {renderOption('q8', '1', 'Never')}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">9. Is emergency help easily available here?</span>
                                <div className="grid grid-cols-2 gap-3">
                                    {renderOption('q9', '4', 'Very Easy')}
                                    {renderOption('q9', '3', 'Manageable')}
                                    {renderOption('q9', '2', 'Difficult')}
                                    {renderOption('q9', '1', 'Not Available')}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="p-4 md:p-8 glass animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-black">
                            <Clock className="text-primary" /> Time & Gender Safety
                        </h2>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">10. How safe is the area during daytime? (1-5)</span>
                                <div className="grid grid-cols-5 gap-3">
                                    {[1, 2, 3, 4, 5].map(v => renderOption('q10', v.toString(), v.toString()))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">11. How safe is the area during nighttime? (1-5)</span>
                                <div className="grid grid-cols-5 gap-3">
                                    {[1, 2, 3, 4, 5].map(v => renderOption('q11', v.toString(), v.toString()))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">12. Do you think this area is safe for women?</span>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {[5, 4, 3, 2, 1].map(v => renderOption('q12', v.toString(), v === 5 ? 'Very Safe' : v === 1 ? 'Very Unsafe' : v.toString()))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">13. Have you observed harassment or suspicious behavior?</span>
                                <div className="flex gap-4">
                                    <div className="flex-1">{renderOption('q13', 'Yes', 'Yes')}</div>
                                    <div className="flex-1">{renderOption('q13', 'No', 'No')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="p-8 glass animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-black">
                            <AlertTriangle className="text-primary" /> Incident & Comments
                        </h2>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="text-sm font-medium text-text-main block">14. What type of issues are common here? (Select all that apply)</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {renderOption('q14', 'Theft', 'Theft')}
                                    {renderOption('q14', 'Burglary', 'Burglary')}
                                    {renderOption('q14', 'Robbery', 'Robbery')}
                                    {renderOption('q14', 'Assault', 'Assault')}
                                    {renderOption('q14', 'Harassment / Crimes against women', 'Harassment / Crimes against women')}
                                    {renderOption('q14', 'Drug activity', 'Drug activity')}
                                    {renderOption('q14', 'Cyber fraud', 'Cyber fraud')}
                                    {renderOption('q14', 'Kidnapping', 'Kidnapping')}
                                    {renderOption('q14', 'Property damage', 'Property damage')}
                                    {renderOption('q14', 'Murder / serious violence', 'Murder / serious violence')}
                                    {renderOption('q14', 'No major issues', 'None / No issues')}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-text-main block ml-1">15. Additional comments</label>
                                <textarea
                                    rows="4"
                                    placeholder="Tell us more about your experience..."
                                    className="input-field resize-none"
                                    value={formData.comments}
                                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="h-1.5 w-full bg-background-glass rounded-full mb-8 md:mb-12 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {renderStep()}

            <div className="flex justify-between items-center mt-12">
                {step > 1 ? (
                    <button
                        className="flex items-center gap-2 px-6 py-3 rounded-lg border border-glass text-text-main font-semibold hover:bg-white/5 transition-all"
                        onClick={prevStep}
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>
                ) : <div />}

                {step < totalSteps ? (
                    <button
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                    >
                        Next <ChevronRight size={20} />
                    </button>
                ) : (
                    <button
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={loading || !isStepValid()}
                    >
                        {loading ? 'Submitting...' : 'Submit Report'} <Send size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReportForm;

