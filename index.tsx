import React from 'react';

import { createRoot } from 'react-dom/client';

import { AuthProvider, useAuth } from 'react-oidc-context';
import type { UserProfile } from 'oidc-client-ts';

const oidcConfig = {
  authority: 'http://localhost:9000/application/o/destra-ui',
  client_id: 'PGpzZ2ONDzVWH7Cm7UjXWpjQqUGslooZDV81mNS7',
  redirect_uri: 'http://localhost:1234/',
  scope: 'profile ak_proxy',
};

interface CustomProfile extends UserProfile {
  groups: string[];
  ak_proxy: {
    user_attributes: {
      settings: {
        locale: string;
      };
    };
  };
}

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  let content = (
    <>
      <div style={{ textAlign: 'center' }}>
        Hi, and welcome to DestraUI ! 😉
      </div>
      <button onClick={() => void auth.signinRedirect()}>Log in</button>
    </>
  );
  if (auth.isAuthenticated) {
    let profile = auth.user?.profile as CustomProfile;
    content = (
      <>
        <div style={{ textAlign: 'center' }}>
          Hello <strong>{auth.user?.profile.given_name}</strong> !
        </div>
        <div>(profile) You belong to groups: [{profile.groups.join(', ')}]</div>
        <div>
          (ak_proxy) Your locale is{' '}
          {profile.ak_proxy.user_attributes.settings.locale}
        </div>
        <button onClick={() => void auth.removeUser()}>Log out</button>
      </>
    );
  }

  return <div className="main">{content}</div>;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <AuthProvider {...oidcConfig}>
    <App />
  </AuthProvider>
);
