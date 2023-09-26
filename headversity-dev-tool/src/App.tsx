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
  Label,
  Segment,
} from "semantic-ui-react";
import * as _ from "lodash";
import "./styling.css";

import config from "./config.json";
import { CopyTextBox } from "./CopyTextBox";
import { Info } from "./Info";

enum Implementations {
  Features = "features",
  Bugs = "bugs",
  Refactor = "refactor",
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

  const ports: { [key: string]: string }[] = [
    { Team: "3001" },
    { "Team Admin": "3002" },
    { People: "3003" },
    { Solo: "3004" },
    { BullMQ: "3000 (:3000/queues)" },
    { "Admin Panel": "3333 (:3333/admin)" },
  ];

  const backendCommands: { [key: string]: string }[] = [
    { "Start backend": "npm run dev" },
    { "Refresh database": "node ace migration:fresh" },
    { "Reseed database": "node ace db:seed" },
    { "Start BullMQ": "node ace queue:listen" },
    { "Start server": "node ace serve" },
    { "Manual migrations": "node ace make:migration <users>" },
  ];

  const androidInfo: { [key: string]: string }[] = [
    { "Android Site URL": "10.0.2.2:3004" },
    {
      "Android Emulator Path": `cd /Users/${user}/Library/Android/sdk/emulator/`,
    },
    { "Open Android": "ionic cap open android" },
    {
      "Running Android":
        "ionic capacitor run android -l --external --port=3004",
    },
    { "Android Chrome Debugging": "chrome://inspect#devices" },
  ];

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
      ")" +
      "\n\n ## Checklist" +
      "\n- [ ] Desktop/mobile responsive" +
      "\n- [ ] Light/dark themes" +
      "\n- [ ] En/Fr/Sp support" +
      "\n- [ ] Mixpanel events" +
      "\n- [ ] SonarCloud issues";
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

  const handleJiraIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJiraId(event.currentTarget.value);
  };

  const handJiraIdPrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJiraIdPr(event.currentTarget.value);
  };

  const handleTicketTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTicketTitle(event.currentTarget.value);
  };

  const handlePrTicketTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJiraPrTitle(event.currentTarget.value);
  };

  const handleAndroidUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
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
        height: !showMoreInfo ? "120vh" : "400vh",
        paddingTop: "50px",
      }}
    >
      <Container style={{ backgroundColor: "#023047" }}>
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
          <Info
            androidUrl={androidUrl}
            iOSSimulatorCommand={iOSSimulatorCommand}
            androidEmulatorCommand={androidEmulatorCommand}
            defaultAndroidUrl={defaultAndroidUrl}
            backendCommands={backendCommands}
            ports={ports}
            androidInfo={androidInfo}
            handleAndroidUrlChange={handleAndroidUrlChange}
            generateNewAndroidUrl={generateNewAndroidUrl}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
