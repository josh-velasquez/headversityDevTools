import {
  Button,
  Divider,
  Header,
  Input,
  Label,
  List,
  Segment,
} from "semantic-ui-react";
import { CopyTextBox } from "./CopyTextBox";

interface InfoProps {
  androidUrl: string;
  iOSSimulatorCommand: string;
  androidEmulatorCommand: string;
  defaultAndroidUrl: string;
  backendCommands: { [key: string]: string }[];
  ports: { [key: string]: string }[];
  user: string;
  androidInfo: { [key: string]: string }[];
  handleAndroidUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  generateNewAndroidUrl: () => void;
}

export const Info: React.FC<InfoProps> = ({
  iOSSimulatorCommand,
  androidEmulatorCommand,
  defaultAndroidUrl,
  androidUrl,
  user,
  ports,
  androidInfo,
  backendCommands,
  handleAndroidUrlChange,
  generateNewAndroidUrl,
}): JSX.Element => {
  return (
    <>
      <Segment>
        <Header>iOS Simulator</Header>
        <Divider />
        <pre>
          <code>{iOSSimulatorCommand}</code>
        </pre>
        <CopyTextBox content={iOSSimulatorCommand} />
      </Segment>
      <Segment>
        <Header>Android Simulator</Header>
        <Divider />
        <pre>
          <code>{androidEmulatorCommand}</code>
        </pre>
        <CopyTextBox content={androidEmulatorCommand} />
      </Segment>
      <Segment>
        <Header>Android URL Editor</Header>
        <Divider />
        <Input
          value={defaultAndroidUrl}
          placeholder="URL"
          onChange={handleAndroidUrlChange}
        />
        <Button primary onClick={generateNewAndroidUrl}>
          Set URL to Android
        </Button>
        {androidUrl && (
          <>
            <Divider />
            <Label>{androidUrl}</Label>
            <CopyTextBox content={androidUrl} />
          </>
        )}
      </Segment>
      <Segment>
        <Header>Android Terminal Commands</Header>
        <Divider />
        <List>
          <List.Item>
            <label>Listing available android devices</label>
            <pre>
              <code>./emulator -list-avds</code>
            </pre>
          </List.Item>
          <List.Item>
            <label>Running android simulator device</label>
            <pre>
              <code>./emulator -avd "device-name"</code>
            </pre>
          </List.Item>
        </List>
      </Segment>
      <Segment>
        <Header>General Information</Header>
        <Divider />
        <List>
          <List.Item>
            <h3>Android:</h3>
            <table className="info-table">
              <tbody>
                {androidInfo.map((command, index) => {
                  const [key, value] = Object.entries(command)[0];
                  return (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </List.Item>
          <List.Item>
            <h3>Ports</h3>
            <table className="info-table">
              <tbody>
                {ports.map((portInfo, index) => {
                  const [key, value] = Object.entries(portInfo)[0];
                  return (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </List.Item>
        </List>
      </Segment>
      <Segment>
        <Header>Commands:</Header>
        <Divider />
        <List>
          <h4>Ionic CLI</h4>
          <List.Item>
            <label>Syncing packages across platforms</label>
            <pre>
              <code>npx cap sync</code>
            </pre>
          </List.Item>
        </List>
        <List>
          <h4>Backend Commands</h4>

          <table className="info-table">
            <tbody>
              {backendCommands.map((command, index) => {
                const [key, value] = Object.entries(command)[0];
                return (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </List>
        <List>
          <h4>GitHub Command</h4>
          <List.Item>
            <label>View grep branches</label>
            <pre>git branch | grep "pattern"</pre>
          </List.Item>
          <List.Item>
            <label>Delete multiple branches from grep</label>
            <pre>git branch | grep "pattern" | xargs git branch -D</pre>
          </List.Item>
        </List>
      </Segment>
    </>
  );
};
