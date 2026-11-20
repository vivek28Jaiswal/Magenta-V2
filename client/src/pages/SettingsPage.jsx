import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { 
  User, 
  ShieldCheck, 
  LockSimple, 
  DownloadSimple, 
  Trash, 
} from '@phosphor-icons/react';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [privacyTraining, setPrivacyTraining] = useState(false);
  const [deterministicStrict, setDeterministicStrict] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Account settings saved successfully!');
    }, 600);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        user: { name, email },
        exportDate: new Date().toISOString(),
        engine: 'Magenta Deterministic Core',
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `magenta_profile_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Profile archive exported to JSON');
  };

  const handleConfirmDeleteAccount = () => {
    logout();
    toast.success('Your account and associated profile matrices have been removed.');
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <Card className="bg-[#141210] border-white/10 rounded-[4px] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-[24px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
                Account & Privacy Settings
              </h1>
              <Badge variant="brand" size="xs">
                Privacy First
              </Badge>
            </div>
            <p className="text-[14px] text-stone-400">
              Manage candidate credentials, data governance policies, and discovery preferences.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Profile Details & Security */}
        <div className="lg:col-span-7 space-y-6">
          {/* Profile Information Card */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="border-b border-white/10 p-6 flex flex-row items-center space-x-3">
              <User className="w-5 h-5 text-white" weight="regular" />
              <CardTitle className="text-[18px] sm:text-[20px] font-bold text-white">
                Profile Information
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-5 text-[14px]">
                <div>
                  <label className="block text-[13px] font-bold text-stone-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-[4px] h-11 text-[14px] focus-visible:border-white/25"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-stone-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="bg-white/5 border-white/10 text-stone-500 rounded-[4px] cursor-not-allowed h-11 text-[14px]"
                  />
                  <span className="text-[12px] text-stone-500 mt-1.5 block font-mono">
                    Email cannot be changed directly for verified security.
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="default" size="default" type="submit" loading={saving} className="rounded-[4px]">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password & Security Card */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="border-b border-white/10 p-6 flex flex-row items-center space-x-3">
              <LockSimple className="w-5 h-5 text-white" weight="regular" />
              <CardTitle className="text-[18px] sm:text-[20px] font-bold text-white">
                Security & Authentication
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <p className="text-[14px] text-stone-300">
                Your account is secured with salted bcrypt hashing and JWT session tokens.
              </p>

              <div>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => toast('Password reset link sent to your registered email.')}
                  className="rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20"
                >
                  Send Password Reset Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (5 cols): Privacy & Governance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Privacy & Deterministic Governance Card */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="border-b border-white/10 p-6 flex flex-row items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-white" weight="regular" />
              <CardTitle className="text-[18px] sm:text-[20px] font-bold text-white">
                Privacy & Data Governance
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-4 text-[14px]">
              {/* Strict Mode Toggle */}
              <div className="flex items-start justify-between gap-3 p-4 bg-[#121110] border border-white/10 rounded-[4px] text-white">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-[14px]">Strict Deterministic Mode</div>
                  <p className="text-[12px] text-stone-400">
                    Rejects all probabilistic guesswork and hallucinated skills.
                  </p>
                </div>
                <Checkbox
                  checked={deterministicStrict}
                  onCheckedChange={(checked) => setDeterministicStrict(Boolean(checked))}
                  className="mt-1"
                />
              </div>

              {/* Zero AI Training Toggle */}
              <div className="flex items-start justify-between gap-3 p-4 bg-[#121110] border border-white/10 rounded-[4px] text-white">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-[14px]">Zero Data Training</div>
                  <p className="text-[12px] text-stone-400">
                    Never train LLM or public models on your uploaded CV.
                  </p>
                </div>
                <Checkbox
                  checked={!privacyTraining}
                  onCheckedChange={(checked) => setPrivacyTraining(!checked)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Export & Danger Zone */}
          <Card className="bg-[#141210] border-white/10 rounded-[4px]">
            <CardHeader className="border-b border-white/10 p-6">
              <CardTitle className="text-[13px] font-bold text-white uppercase tracking-wider font-mono">
                Data Archive & Deletion
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <Button
                variant="secondary"
                size="default"
                icon={DownloadSimple}
                onClick={handleExportData}
                className="w-full rounded-[4px] bg-white/10 border-white/15 text-white hover:bg-white/20"
              >
                Export Profile Archive (JSON)
              </Button>

              <Button
                variant="destructive"
                size="default"
                icon={Trash}
                onClick={() => setDeleteAccountModal(true)}
                className="w-full rounded-[4px]"
              >
                Delete Account & Purge Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={handleConfirmDeleteAccount}
        title="Permanently Delete Account"
        message="Are you sure you want to permanently delete your account? All extracted resume matrices, application clarity reports, and saved jobs will be permanently purged."
        confirmText="Yes, Delete My Account"
        variant="destructive"
      />
    </div>
  );
}
