import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card title="Profile Settings">
          <p className="text-gray-600">Manage your profile information</p>
        </Card>
        <Card title="Appearance">
          <p className="text-gray-600">Theme and display preferences</p>
        </Card>
        <Card title="Notifications">
          <p className="text-gray-600">Configure notification preferences</p>
        </Card>
        <Card title="Account">
          <Button variant="danger">Delete Account</Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
