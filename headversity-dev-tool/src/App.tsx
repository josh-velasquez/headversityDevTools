import React, { useState } from "react";
import {
  Button,
  Container,
  Divider,
  Dropdown,
  DropdownItemProps,
  DropdownProps,
  Header,
  Input,
  InputOnChangeData,
  Label,
  List,
  Segment,
} from "semantic-ui-react";
import * as _ from "lodash";
import "./styling.css";

import config from "./config.json";
import { CopyTextBox } from "./CopyTextBox";

enum Implementations {
  Features = "features",
  Bugs = "bugs",
  QA = "qa",
}

function getCurrentDate(separator = "") {
  const newDate = new Date();
  const date = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  const formattedDate = date < 10 ? `0${date}` : `${date}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  return `${year}${separator}${formattedMonth}${separator}${formattedDate}`;
}

function App() {
  const user = config.username === "" ? "<username>" : config.username;
  const iOSSimulatorCommand =
    "open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app";
  const androidEmulatorCommand = `cd /Users/${user}/Library/Android/sdk/emulator/ | ./emulator -avd ${config.settings.androidEmulatorName}`;
  const [jiraId, setJiraId] = useState("");
  const [jiraIdPr, setJiraIdPr] = useState("");
  const [branchName, setBranchName] = useState("");
  const [jiraPrTitle, setJiraPrTitle] = useState("");
  const [prBody, setPrBody] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [defaultAndroidUrl, setDefaultAndroidUrl] = useState("");
  const [androidUrl, setAndroidUrl] = useState("");
  const [implementation, setImplementation] = useState<string>(
    Implementations.Features
  );
  const [ticketTitle, setTicketTitle] = useState("");
  const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);
  const implementations: string[] = Object.values(Implementations);
  const implementationOptions: DropdownItemProps[] = _.map(
    implementations,
    (impl: string, index: number) => ({
      key: index,
      text: impl,
      value: index,
    })
  );

  const generateBranchName = () => {
    if (jiraId === "" || ticketTitle === "") {
      return;
    }
    const newTicketTitle = ticketTitle.replaceAll(" ", "_");
    const currentDate = getCurrentDate();
    let branchName =
      implementation + "/" + currentDate + "_" + jiraId + "_" + newTicketTitle;
    setBranchName(branchName);

    if (config.features.enableReminderPopup) {
      alert("Move the ticket to 'In Progress' on Jira.");
    }
  };

  const generatePr = () => {
    if (jiraIdPr === "" || jiraPrTitle === "") {
      return;
    }
    const jiraTicketHeader = "[" + jiraIdPr + "] " + jiraPrTitle;
    setPrTitle(jiraTicketHeader);
    const jiraPrInfo =
      "## Description\n <changes> " +
      "\n\n## Ticket" +
      "\n[" +
      jiraIdPr +
      "]" +
      "(https://headversity.atlassian.net/browse/" +
      jiraIdPr +
      ")";
    setPrBody(jiraPrInfo);

    if (config.features.enableReminderPopup) {
      alert("Move the ticket to 'In Review' on Jira.");
    }
  };

  const generateNewAndroidUrl = () => {
    if (defaultAndroidUrl === "") {
      return;
    }
    const newAndroidUrl = defaultAndroidUrl.replace("localhost", "10.0.2.2");
    setAndroidUrl(newAndroidUrl);
  };

  const handleJiraIdChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    _: InputOnChangeData
  ) => {
    setJiraId(event.currentTarget.value);
  };

  const handJiraIdPrChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    _: InputOnChangeData
  ) => {
    setJiraIdPr(event.currentTarget.value);
  };

  const handleTicketTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    _: InputOnChangeData
  ) => {
    setTicketTitle(event.currentTarget.value);
  };

  const handlePrTicketTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    _: InputOnChangeData
  ) => {
    setJiraPrTitle(event.currentTarget.value);
  };

  const handleAndroidUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    _: InputOnChangeData
  ) => {
    setDefaultAndroidUrl(event.currentTarget.value);
  };

  const onImplementationsSelect = (
    _: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    if (data.value === null) {
      return;
    }
    if (typeof data.value === "number") {
      setImplementation(implementations[data.value]);
    }
  };

  const onShowMoreInfoClick = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div
      style={{
        backgroundColor: "#023047",
        height: !showMoreInfo ? "100vh" : "315vh",
        paddingTop: "50px",
      }}
    >
      <Container>
        <Segment className="segment-container">
          <Header>Branch Name Generator</Header>
          <Divider />
          <Container>
            <Dropdown
              button
              className="icon"
              floating
              selection
              labeled
              selectOnBlur={true}
              defaultValue={0}
              onChange={onImplementationsSelect}
              icon="sort"
              options={implementationOptions}
            />
            <Input
              value={jiraId}
              placeholder="Jira ID"
              onChange={handleJiraIdChange}
            />
            <Input
              value={ticketTitle}
              placeholder="Ticket Title..."
              onChange={handleTicketTitleChange}
            />
          </Container>
          <div className="generate-button">
            <Button primary onClick={generateBranchName}>
              Generate
            </Button>
          </div>
          {branchName && (
            <>
              <Divider />
              <Label>{branchName}</Label>
              <CopyTextBox content={branchName} />
            </>
          )}
        </Segment>
        <Segment className="segment-container">
          <Header>Pull Request Generator</Header>
          <Divider />
          <Container>
            <Input
              value={jiraIdPr}
              placeholder="Jira ID"
              onChange={handJiraIdPrChange}
            />
            <Input
              value={jiraPrTitle}
              placeholder="Ticket Title..."
              onChange={handlePrTicketTitleChange}
            />
          </Container>
          <div className="generate-button">
            <Button primary onClick={generatePr}>
              Generate
            </Button>
          </div>
          {prTitle && prBody && (
            <>
              <Divider />
              <Label>{prTitle}</Label>
              <CopyTextBox content={prTitle} />
              <Label>{prBody}</Label>
              <CopyTextBox content={prBody} />
            </>
          )}
        </Segment>
        <Button primary onClick={onShowMoreInfoClick}>
          {showMoreInfo ? "Hide" : "Show More"} Info
        </Button>
        {showMoreInfo && (
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
                  <p>
                    Default android url on simulator:
                    <pre>
                      <code>10.0.2.2:3004</code>
                    </pre>
                    <pre>
                      <code>
                        cd /Users/{user}/Library/Android/sdk/emulator/
                      </code>
                    </pre>
                  </p>
                </List.Item>
                <List.Item>
                  <label>Debugging Android Chrome (simulator):</label>
                  <pre>
                    <code>chrome://inspect#devices</code>
                  </pre>
                </List.Item>
                <List.Item>
                  <label>
                    <h3>Ports</h3>
                  </label>
                  <p>Team: 3001</p>
                  <p>Team Admin: 3002</p>
                  <p>People: 3003</p>
                  <p>Solo: 3004</p>
                  <p>BullMQ: 3000 (:3000/queues)</p>
                  <p>Admin Panel: 3333 (:3333/admin)</p>
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
                <h4>DB Commands</h4>
                <List.Item>
                  <label>Refresh database</label>
                  <pre>node ace migration:fresh</pre>
                </List.Item>
                <List.Item>
                  <label>Reseed database</label>
                  <pre>node ace db:seed</pre>
                </List.Item>
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
        )}
      </Container>
    </div>
  );
}

export default App;
