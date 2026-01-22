
import React from 'react';
import { useData } from '../context/DataContext';

const SettingsPage = () => {
  const { data } = useData();

  return (
    <div style={{ padding: '24px' }}>
      <h1>Settings</h1>
      
      <section style={{ marginBottom: '32px' }}>
        <h2>Account</h2>
        <p>Name: {data.user.displayName}</p>
        <p>Email: {data.user.email}</p>
        <p>Handle: {data.user.handle}</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2>Notifications</h2>
        <label>
          <input type="checkbox" defaultChecked />
          Email notifications
        </label>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2>Playback</h2>
        <label>
          <input type="checkbox" defaultChecked />
          Autoplay next video
        </label>
      </section>

      <section>
        <h2>Privacy</h2>
        <label>
          <input type="checkbox" defaultChecked />
          Keep watch history
        </label>
        <br />
        <label>
          <input type="checkbox" defaultChecked />
          Keep search history
        </label>
      </section>
    </div>
  );
};

export default SettingsPage;
  