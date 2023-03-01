import { FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET, FITBIT_SCOPES } from '../common/oauth.secret';

function mySettings(props: SettingsComponentProps) {
  const refreshToken = props.settingsStorage.getItem('refresh_token');
  const currentUserName = props.settingsStorage.getItem('current_user_name');
  const isLoggedIn = refreshToken && currentUserName;
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            Fitbit Log Settings
          </Text>
        }
      >
        {isLoggedIn && <Text>Logged in as {currentUserName}</Text>}
        {!isLoggedIn && (
          <Oauth
            settingsKey="oauth"
            title="Fitbit Login"
            label="Fitbit"
            status={refreshToken ? 'Logged In' : 'Login'}
            authorizeUrl="https://www.fitbit.com/oauth2/authorize"
            requestTokenUrl="https://api.fitbit.com/oauth2/token"
            clientId={FITBIT_CLIENT_ID}
            clientSecret={FITBIT_CLIENT_SECRET}
            scope={FITBIT_SCOPES}
            onReturn={(data) => {
              //console.log(`[Settings] Auth code received`);
              props.settingsStorage.setItem('current_user_name', '');
              props.settingsStorage.setItem('refresh_token', '');
              props.settingsStorage.setItem('oauth_code', data.code);
            }}
          />
        )}
        {isLoggedIn && <Button label="Logout" onClick={() => props.settingsStorage.setItem('refresh_token', '')} />}
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
