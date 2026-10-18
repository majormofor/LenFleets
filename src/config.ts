// Set only verified store destinations and a real HTTPS form submission endpoint.
export const config = {
  formEndpoint: '',
  apps: {
    nest: { ios: '', android: '' },
    sentinel: { ios: '', android: '' },
    tracker: { ios: '', android: '' },
    dashboard: { ios: '', android: '' },
  },
  legal: { privacy: '', terms: '', cookies: '' },
};
