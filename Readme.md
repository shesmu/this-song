# this-song
Download the audio from the youtube video currently playing. Please respect artist rights when using this.

# Installation
`npm install this-song`

You must run chrome in remote debugger mode for this to work. `google-chrome --remote-debugging-port=9222`. If you use 9222 you need not specify port when running the command.

# Usage
`this-song [option] [param]`

# Options
-f Specify the file path for the audio to be downloaded to. By default the download is saved in the current directory.

-p Specify the port that chrome remote debugger is using. If this option is not used the default port will be 9222.
