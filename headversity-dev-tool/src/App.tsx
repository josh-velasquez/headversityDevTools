import React, { useState } from "react";
import {
  Button,
  ButtonProps,
  Container,
  Divider,
  Dropdown,
  DropdownItemProps,
  DropdownProps,
  Header,
  Icon,
  Input,
  InputOnChangeData,
  Label,
  List,
  Segment,
} from "semantic-ui-react";
import * as _ from "lodash";
import "./styling.css";

import config from "./config.json";

enum Implementations {
  Features = "features",
  Bugs = "bugs",
}

function getCurrentDate(separator = "") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${date}`;
}

const App: React.FC = () => {
  const user = config.username === "" ? "<username>" : config.username;
  const iOSSimulatorCommand =
    "open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app";
  const androidEmulatorCommand = `cd /Users/${user}/Library/Android/sdk/emulator/`;
  const [jiraId, setJiraId] = useState("");
  const [jiraIdPr, setJiraIdPr] = useState("");
  const [branchName, setBranchName] = useState("");
  const [jiraPrTitle, setJiraPrTitle] = useState("");
  const [prBody, setPrBody] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [prChanges, setPrChanges] = useState("");
  const [implementation, setImplementation] = useState<string>(
    Implementations.Features
  );
  const [ticketTitle, setTicketTitle] = useState("");
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
  };

  const generatePr = () => {
    if (jiraIdPr === "" || jiraPrTitle === "") {
      return;
    }
    const jiraTicketHeader = jiraIdPr + " " + jiraPrTitle;
    setPrTitle(jiraTicketHeader);
    const jiraPrInfo =
      "## Description\n <changes> " +
      "\n\n## Ticket" +
      "[" +
      jiraIdPr +
      "]" +
      "(https://headversity.atlassian.net/browse/" +
      jiraIdPr;
    setPrBody(jiraPrInfo);
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

  const onCopyIosSimulatorPathClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: ButtonProps
  ) => {
    navigator.clipboard.writeText(iOSSimulatorCommand);
  };

  const onCopyAndroidEmulatorPath = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    __: ButtonProps
  ) => {
    navigator.clipboard.writeText(androidEmulatorCommand);
  };

  const onCopyBranchNameClick = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    __: ButtonProps
  ) => {
    navigator.clipboard.writeText(branchName);
  };

  const onCopyPrTitleNameClick = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    __: ButtonProps
  ) => {
    navigator.clipboard.writeText(prTitle);
  };
  const onCopyPrBodyNameClick = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    __: ButtonProps
  ) => {
    navigator.clipboard.writeText(prBody);
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

  return (
    <div style={{ backgroundColor: "#023047", height: "180vh" }}>
      <Container>
        <Segment>
          <Header>Branch Name Generator</Header>
          <Divider />
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
          <Button primary onClick={generateBranchName}>
            Generate branch name
          </Button>
          {branchName && (
            <>
              <Divider />
              <Label>{branchName}</Label>
              <Button
                size="mini"
                animated="vertical"
                onClick={onCopyBranchNameClick}
              >
                <Button.Content hidden>Copy</Button.Content>
                <Button.Content visible>
                  <Icon name="copy" />
                </Button.Content>
              </Button>
            </>
          )}
        </Segment>
        <Segment>
          <Header>Pull Request Generator</Header>
          <Divider />
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
          <Button primary onClick={generatePr}>
            Generate PR
          </Button>
          {prTitle && prBody && (
            <>
            <Divider />
              <Label>{prTitle}</Label>
              <Button
                size="mini"
                animated="vertical"
                onClick={onCopyPrTitleNameClick}
              >
                <Button.Content hidden>Copy</Button.Content>
                <Button.Content visible>
                  <Icon name="copy" />
                </Button.Content>
              </Button>
              <Label>{prBody}</Label>
              <Button
                size="mini"
                animated="vertical"
                onClick={onCopyPrBodyNameClick}
              >
                <Button.Content hidden>Copy</Button.Content>
                <Button.Content visible>
                  <Icon name="copy" />
                </Button.Content>
              </Button>
            </>
          )}
        </Segment>
        <Segment>
          <Header>iOS Simulator Path</Header>
          <Divider />
          <pre>
            <code>{iOSSimulatorCommand}</code>
          </pre>
          <Button
            size="mini"
            animated="vertical"
            onClick={onCopyIosSimulatorPathClick}
          >
            <Button.Content hidden>Copy</Button.Content>
            <Button.Content visible>
              <Icon name="copy" />
            </Button.Content>
          </Button>
        </Segment>
        <Segment>
          <Header>Android Simulator Path</Header>
          <Divider />
          <pre>
            <code>{androidEmulatorCommand}</code>
          </pre>
          <Button
            size="mini"
            animated="vertical"
            onClick={onCopyAndroidEmulatorPath}
          >
            <Button.Content hidden>Copy</Button.Content>
            <Button.Content visible>
              <Icon name="copy" />
            </Button.Content>
          </Button>
        </Segment>
        <Segment>
          <Header>Android Terminal Commands</Header>
          <Divider />
          <List>
            <List.Item>
              <label>Listing available android devices</label>
              <pre>
                <code>emulator -list-avds</code>
              </pre>
            </List.Item>
            <List.Item>
              <label>Running android simulator device</label>
              <pre>
                <code>emulator -avd "device-name"</code>
              </pre>
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
        </Segment>
        <Segment>
          <Header>General Information</Header>
          <Divider />
          <List>
            <List.Item>
              <label>Android:</label>
              <p>
                Default android url on simulator:
                <pre>
                  <code>10.0.2.2:3004</code>
                </pre>
              </p>
            </List.Item>
            <List.Item>
              <label>Ports</label>
              <p>Team: 3001</p>
              <p>Team Admin: 3002</p>
              <p>People: 3003</p>
              <p>Solo: 3004</p>
            </List.Item>
          </List>
        </Segment>
      </Container>
    </div>
  );
};

export default App;
