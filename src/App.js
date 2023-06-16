import React, { useState } from "react";
import { ChannelList, SendBirdProvider, Channel, OpenChannel } from "@sendbird/uikit-react"
import "@sendbird/uikit-react/dist/index.css";

import IconArrowLeft from "./icon-arrow-left.svg";
import './App.css';

const APP_ID = "DB953184-52A5-4FBB-B53E-4358FAD845E2";
const USER_ID = "jane";
const myColorSet = {
  '--sendbird-light-primary-500': '#65787B',
  '--sendbird-light-primary-400': '#4E6E75',
  '--sendbird-light-primary-300': '#3A636B',
  '--sendbird-light-primary-200': '#29565F',
  '--sendbird-light-primary-100': '#1B464F',
  '--sendbird-dark-primary-500': '#90A77D',
  '--sendbird-dark-primary-400': '#A2C882',
  '--sendbird-dark-primary-300': '#B5E18E',
  '--sendbird-dark-primary-200': '#C8F3A2',
  '--sendbird-dark-primary-100': '#DBFEBC',
};

function App() {
  const [channel, setChannel] = useState(null);
  const [theme, setTheme] = useState("light");
  const onChannelSelect = (_channel) => {
    setChannel(_channel);
    window.history.pushState({}, _channel.name, "/" + _channel.url);
  };

  const onBack = () => {
    setChannel(null);
    window.history.pushState({}, document.title, "/");
  };

  return (
    <div className="App">
      <SendBirdProvider userId={USER_ID} appId={APP_ID} colorSet={myColorSet} theme={theme}>
        {channel ? (
          <Channel
            channelUrl={channel.url}
            renderChannelHeader={() => <ChatHeader channel={channel} onBack={onBack} />}
          />
        ) : (
          <ChannelList
            renderChannelPreview={({ channel }) => (
              <ChannelPreview
                channel={channel}
                onChannelSelect={onChannelSelect}
                setTheme={setTheme}
                theme={theme}
              />
            )}
          />
        )}
      </SendBirdProvider>
    </div>
  );
}

const ChatHeader = ({ channel, onBack }) => (
  <div className="custom-channel-header">
    <button onClick={onBack}>
      <img width={20} heigth={20} src={IconArrowLeft} alt="Back button" />
    </button>
    <span>{channel.name}</span>
    <span></span>
  </div>
);

const ChannelPreview = ({ channel, onChannelSelect, setTheme, theme }) => {
  const setAppTheme = () => {
    if (theme === 'light') {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }
  return (
    <>
      <div
        className="channel-preview-wrapper"
        onClick={() => onChannelSelect(channel)}
      >
        <img
          className="channel-preview-cover"
          width={45}
          src={channel.coverUrl}
          alt=""
        />
        <div>
          <div className="channel-preview-name">{channel.name}</div>
          <div className="channel-preview-last-message">
            {channel.lastMessage?.messageType === "file"
              ? channel.lastMessage.name
              : channel.lastMessage?.message}
          </div>
        </div>
        <div className="channel-preview-last-message-date">
          {new Intl.DateTimeFormat("en-us", {
            month: "short",
            day: "2-digit"
          }).format(channel.lastMessage?.createdAt)}
        </div>
      </div>
      <button onClick={setAppTheme} className="toggle-theme-btn">Toggle Theme</button>
    </>
  );
};

export default App;
