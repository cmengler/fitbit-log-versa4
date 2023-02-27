import { CLIENT_ID, CLIENT_SECRET } from './oauth.secret';

function mySettings(props) {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            Fitbit Account
          </Text>
        }
      >
        <Oauth
          settingsKey="oauth"
          title="Login"
          label="Fitbit"
          status="Login"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId={CLIENT_ID}
          clientSecret={CLIENT_SECRET}
          scope="weight nutrition"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
