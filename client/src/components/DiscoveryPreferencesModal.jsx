import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  SlidersHorizontal, 
  MapPin, 
  Buildings,
  Check,
  Sparkle
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function DiscoveryPreferencesModal({
  isOpen,
  onClose,
  currentPreferences = {},
  onSave,
}) {
  const [roles, setRoles] = useState(currentPreferences.roles || 'Frontend Engineer, Web Developer Intern, Full Stack Developer');
  const [locations, setLocations] = useState(currentPreferences.locations || 'Bengaluru, Remote India, Hyderabad, Mumbai, Gurugram');
  const [workModes, setWorkModes] = useState(currentPreferences.workModes || ['remote', 'hybrid', 'in-office']);
  const [experienceLevel, setExperienceLevel] = useState(currentPreferences.experienceLevel || 'fresher');
  const [saving, setSaving] = useState(false);

  const toggleWorkMode = (mode) => {
    if (workModes.includes(mode)) {
      if (workModes.length === 1) {
        toast.error('Select at least one work mode');
        return;
      }
      setWorkModes(workModes.filter(m => m !== mode));
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updated = {
      roles,
      locations,
      workModes,
      experienceLevel,
    };
    try {
      if (onSave) {
        await onSave(updated);
      }
      toast.success('Radar preferences updated!');
      onClose();
    } catch (err) {
      toast.error('Could not save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-[#141210] border border-white/10 rounded-[4px] text-stone-100">
        <DialogHeader className="p-5 bg-[#121110] border-b border-white/10 text-left">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-white/5 border border-white/10 text-[#FF4124] flex items-center justify-center">
              <Sparkle className="w-4 h-4" weight="fill" />
            </div>
            <div>
              <DialogTitle className="text-[16px] font-bold text-white tracking-tight">
                Tune your job radar
              </DialogTitle>
              <DialogDescription className="text-[13px] text-stone-400">
                Tell us what you're looking for so we only suggest roles worth your time.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Desired Roles */}
          <div>
            <label className="block text-[13px] font-bold text-stone-300 mb-1.5">
              Target Roles & Keywords
            </label>
            <Input
              type="text"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              placeholder="e.g. Frontend Intern, Junior Developer, React Engineer"
              className="text-[13px] bg-white/5 border-white/10 text-white rounded-[4px] focus-visible:border-white/25"
            />
            <span className="text-[11px] text-stone-400 mt-1 block font-mono">
              Comma-separated roles you want us to match against.
            </span>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-[13px] font-bold text-stone-300 mb-1.5">
              Preferred Cities & Regions
            </label>
            <div className="relative">
              <Input
                type="text"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                placeholder="e.g. Bengaluru, Remote India, Hyderabad, Mumbai, Gurugram"
                className="pl-8 text-[13px] bg-white/5 border-white/10 text-white rounded-[4px] focus-visible:border-white/25"
              />
              <MapPin className="w-4 h-4 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block font-mono">
              Indian tech hubs or Remote.
            </span>
          </div>

          {/* Work Mode Toggle Pills */}
          <div>
            <label className="block text-[13px] font-bold text-stone-300 mb-2">
              Work Modes
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'remote', label: 'Remote' },
                { id: 'hybrid', label: 'Hybrid' },
                { id: 'in-office', label: 'In-office' },
              ].map(({ id, label }) => {
                const active = workModes.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleWorkMode(id)}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-mono transition border flex items-center space-x-1.5 cursor-pointer ${
                      active
                        ? 'bg-white/15 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 text-[#FF4124]" weight="bold" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Career Stage / Seniority */}
          <div>
            <label className="block text-[13px] font-bold text-stone-300 mb-2">
              Current Career Stage
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'internship', label: 'Internships', desc: 'Pre-final / final year' },
                { id: 'fresher', label: 'Fresher / Junior', desc: '0-2 yrs experience' },
                { id: 'mid', label: 'Mid-level', desc: '2+ yrs experience' },
              ].map(({ id, label, desc }) => {
                const selected = experienceLevel === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setExperienceLevel(id)}
                    className={`p-3 text-left rounded-[4px] border transition cursor-pointer flex flex-col justify-between ${
                      selected
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-white/5 border-white/10 text-stone-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-[12px] font-bold">{label}</span>
                    <span className="text-[10px] text-stone-400 font-mono mt-1">{desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={saving}
              className="rounded-[4px] bg-white/5 border-white/10 text-stone-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={saving}
              className="rounded-[4px] bg-[#FF4124] text-white hover:bg-[#FF4124]/90"
            >
              {saving ? 'Updating...' : 'Save & update radar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
